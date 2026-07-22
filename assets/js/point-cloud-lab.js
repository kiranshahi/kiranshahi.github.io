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
  let rotationX = -0.18;
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

  function projectPoint(point) {
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const x1 = point.x * cosY - point.z * sinY;
    const z1 = point.x * sinY + point.z * cosY;
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const y2 = point.y * cosX - z1 * sinX;
    const z2 = point.y * sinX + z1 * cosX;
    const camera = 10;
    const perspective = camera / (camera + z2);
    const scale = Math.min(width, height) * 0.108 * zoom;
    return {
      x: width / 2 + x1 * scale * perspective,
      y: height * 0.54 - y2 * scale * perspective,
      z: z2,
      perspective,
      level: point.level
    };
  }

  function buildShard() {
    const detail = Number(density.value);
    const heightScale = Number(depth.value) / 100;
    const levels = detail * 2;
    const segments = Math.max(2, Math.round(detail / 7));
    const caps = [1, .93, .84, .76, .96, .88, .79, .9];
    const points = [];
    const rings = [];
    const columns = Array.from({ length: 8 * segments }, () => []);

    for (let level = 0; level <= levels; level += 1) {
      const t = level / levels;
      const taper = Math.pow(Math.max(0, 1 - t), 1.08);
      const y = (-3.45 + t * 7.25) * heightScale;
      const ring = [];

      for (let side = 0; side < 8; side += 1) {
        const next = (side + 1) % 8;
        for (let segment = 0; segment < segments; segment += 1) {
          const u = segment / segments;
          const cap = caps[side] * (1 - u) + caps[next] * u;
          if (t > cap) {
            ring.push(null);
            continue;
          }

          const angleA = side / 8 * Math.PI * 2 + Math.PI / 8;
          const angleB = (side + 1) / 8 * Math.PI * 2 + Math.PI / 8;
          const baseA = { x: Math.cos(angleA) * 1.32, z: Math.sin(angleA) * .88 };
          const baseB = { x: Math.cos(angleB) * 1.32, z: Math.sin(angleB) * .88 };
          const setback = .18 * Math.sin(Math.PI * Math.min(1, t / .16));
          const profile = taper + setback * (1 - t);
          const point = {
            x: (baseA.x * (1 - u) + baseB.x * u) * profile,
            y,
            z: (baseA.z * (1 - u) + baseB.z * u) * profile,
            level
          };
          points.push(point);
          ring.push(point);
          columns[side * segments + segment].push(point);
        }
      }
      if (!ring.includes(null) && ring.length) ring.push(ring[0]);
      rings.push(ring);
    }
    return { points, rings, columns };
  }

  function strokeWorldLine(points, colour, lineWidth) {
    let drawing = false;
    context.beginPath();
    for (const point of points) {
      if (!point) {
        drawing = false;
        continue;
      }
      const projected = projectPoint(point);
      if (drawing) context.lineTo(projected.x, projected.y);
      else {
        context.moveTo(projected.x, projected.y);
        drawing = true;
      }
    }
    context.strokeStyle = colour;
    context.lineWidth = lineWidth;
    context.stroke();
  }

  function drawGround(colour) {
    const baseY = -3.47 * Number(depth.value) / 100;
    for (let index = -4; index <= 4; index += 1) {
      strokeWorldLine([
        { x: index * .6, y: baseY, z: -2.4 },
        { x: index * .6, y: baseY, z: 2.4 }
      ], colour, .6);
      strokeWorldLine([
        { x: -2.4, y: baseY, z: index * .6 },
        { x: 2.4, y: baseY, z: index * .6 }
      ], colour, .6);
    }
  }

  function draw() {
    const styles = {
      background: readColour("--bg", "#f7f7f4"),
      line: readColour("--line", "#dfe3de"),
      accent: readColour("--accent", "#126b55"),
      text: readColour("--muted", "#65706b")
    };
    const geometry = buildShard();

    context.clearRect(0, 0, width, height);
    context.fillStyle = styles.background;
    context.fillRect(0, 0, width, height);
    drawGround(styles.line);

    if (mode.value === "mesh" || mode.value === "both") {
      geometry.rings.forEach((ring, index) => {
        if (index % 2 === 0) strokeWorldLine(ring, styles.line, .7);
      });
      geometry.columns.forEach(column => strokeWorldLine(column, styles.line, .75));
    }

    if (mode.value === "points" || mode.value === "both") {
      const projected = geometry.points.map(projectPoint);
      projected.sort((a, b) => b.z - a.z);
      for (const point of projected) {
        const heightMix = point.level / (Number(density.value) * 2);
        context.globalAlpha = .46 + heightMix * .5;
        context.fillStyle = styles.accent;
        context.beginPath();
        context.arc(point.x, point.y, Math.max(.9, 1.6 * point.perspective), 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    }

    context.fillStyle = styles.text;
    context.font = "12px system-ui, sans-serif";
    context.textAlign = "left";
    context.fillText(geometry.points.length + " architectural samples", 18, height - 18);
    context.textAlign = "right";
    context.fillText("London · procedural interpretation", width - 18, height - 18);
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
    depthValue.value = depth.value + "%";
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
    rotationX = Math.max(-1.1, Math.min(0.35, rotationX));
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
    else if (event.key === "ArrowUp") rotationX = Math.max(-1.1, rotationX - step);
    else if (event.key === "ArrowDown") rotationX = Math.min(0.35, rotationX + step);
    else if (event.key === "+" || event.key === "=") zoom = Math.min(2, zoom + 0.08);
    else if (event.key === "-") zoom = Math.max(0.58, zoom - 0.08);
    else return;
    event.preventDefault();
  });

  [density, depth].forEach(control => control.addEventListener("input", updateValues));
  reset.addEventListener("click", () => {
    rotationX = -0.18;
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
