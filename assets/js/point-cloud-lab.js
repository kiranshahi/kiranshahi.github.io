(() => {
  const canvas = document.getElementById("point-cloud-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const mode = document.getElementById("lab-mode");
  const density = document.getElementById("lab-density");
  const depth = document.getElementById("lab-depth");
  const densityValue = document.getElementById("density-value");
  const depthValue = document.getElementById("depth-value");
  const autoRotate = document.getElementById("lab-rotate");
  const reset = document.getElementById("lab-reset");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let rotationX = -0.68;
  let rotationY = -0.55;
  let zoom = 1;
  let dragging = false;
  let previousX = 0;
  let previousY = 0;
  let frame = 0;
  let lastTime = performance.now();

  function readColour(name, fallback) {
    const colour = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return colour || fallback;
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    pixelRatio = Math.min(devicePixelRatio || 1, 2);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function makePoint(x, z, amplitude) {
    const distance = Math.sqrt(x * x + z * z);
    const y = Math.sin(distance * 2.35) * Math.exp(-distance * 0.2) * amplitude
      + Math.cos(x * 1.25) * Math.sin(z * 1.1) * amplitude * 0.22;

    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;
    const camera = 8.8;
    const perspective = camera / (camera + z2);
    const scale = Math.min(width, height) * 0.105 * zoom;

    return {
      x: width / 2 + x1 * scale * perspective,
      y: height / 2 + y2 * scale * perspective,
      z: z2,
      perspective
    };
  }

  function draw() {
    const styles = {
      background: readColour("--bg", "#f7f7f4"),
      line: readColour("--line", "#dfe3de"),
      accent: readColour("--accent", "#126b55"),
      text: readColour("--muted", "#65706b")
    };

    context.clearRect(0, 0, width, height);
    context.fillStyle = styles.background;
    context.fillRect(0, 0, width, height);

    const count = Number(density.value);
    const amplitude = Number(depth.value) / 100;
    const extent = 3.35;
    const points = [];
    const grid = [];

    for (let row = 0; row < count; row += 1) {
      const line = [];
      const z = -extent + (row / (count - 1)) * extent * 2;
      for (let column = 0; column < count; column += 1) {
        const x = -extent + (column / (count - 1)) * extent * 2;
        const point = makePoint(x, z, amplitude);
        point.row = row;
        point.column = column;
        points.push(point);
        line.push(point);
      }
      grid.push(line);
    }

    if (mode.value === "mesh" || mode.value === "both") {
      context.strokeStyle = styles.line;
      context.lineWidth = 0.8;
      for (let row = 0; row < count; row += 1) {
        context.beginPath();
        grid[row].forEach((point, index) => index ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y));
        context.stroke();
      }
      for (let column = 0; column < count; column += 1) {
        context.beginPath();
        for (let row = 0; row < count; row += 1) {
          const point = grid[row][column];
          row ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y);
        }
        context.stroke();
      }
    }

    if (mode.value === "points" || mode.value === "both") {
      points.sort((a, b) => b.z - a.z);
      for (const point of points) {
        const depthMix = Math.max(0.2, Math.min(1, point.perspective));
        context.globalAlpha = 0.38 + depthMix * 0.62;
        context.fillStyle = styles.accent;
        context.beginPath();
        context.arc(point.x, point.y, Math.max(1, 1.65 * point.perspective), 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    }

    context.fillStyle = styles.text;
    context.font = "12px system-ui, sans-serif";
    context.fillText(count * count + " samples", 18, height - 18);
  }

  function animate(time) {
    const delta = Math.min(40, time - lastTime);
    lastTime = time;
    if (autoRotate.checked && !dragging && !reduceMotion.matches) rotationY += delta * 0.00012;
    draw();
    frame = requestAnimationFrame(animate);
  }

  function updateValues() {
    densityValue.value = density.value;
    depthValue.value = (Number(depth.value) / 100).toFixed(1);
  }

  canvas.addEventListener("pointerdown", event => {
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", event => {
    if (!dragging) return;
    rotationY += (event.clientX - previousX) * 0.008;
    rotationX += (event.clientY - previousY) * 0.008;
    rotationX = Math.max(-1.45, Math.min(1.45, rotationX));
    previousX = event.clientX;
    previousY = event.clientY;
  });

  canvas.addEventListener("pointerup", event => {
    dragging = false;
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("wheel", event => {
    event.preventDefault();
    zoom *= Math.exp(-event.deltaY * 0.001);
    zoom = Math.max(0.58, Math.min(2, zoom));
  }, { passive: false });

  canvas.addEventListener("keydown", event => {
    const step = 0.09;
    if (event.key === "ArrowLeft") rotationY -= step;
    else if (event.key === "ArrowRight") rotationY += step;
    else if (event.key === "ArrowUp") rotationX = Math.max(-1.45, rotationX - step);
    else if (event.key === "ArrowDown") rotationX = Math.min(1.45, rotationX + step);
    else if (event.key === "+" || event.key === "=") zoom = Math.min(2, zoom + 0.08);
    else if (event.key === "-") zoom = Math.max(0.58, zoom - 0.08);
    else return;
    event.preventDefault();
  });

  [density, depth].forEach(control => control.addEventListener("input", updateValues));
  reset.addEventListener("click", () => {
    rotationX = -0.68;
    rotationY = -0.55;
    zoom = 1;
  });

  new ResizeObserver(resize).observe(canvas);
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  updateValues();
  resize();
  frame = requestAnimationFrame(animate);

  addEventListener("pagehide", () => cancelAnimationFrame(frame), { once: true });
})();
