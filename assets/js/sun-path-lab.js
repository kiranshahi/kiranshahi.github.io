(() => {
  const canvas = document.getElementById("sun-path-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const latitudeInput = document.getElementById("sun-latitude");
  const dateInput = document.getElementById("sun-date");
  const timeInput = document.getElementById("sun-time");
  const latitudeValue = document.getElementById("latitude-value");
  const timeValue = document.getElementById("time-value");
  const altitudeValue = document.getElementById("sun-altitude");
  const azimuthValue = document.getElementById("sun-azimuth");
  const statusValue = document.getElementById("sun-status");
  const todayButton = document.getElementById("sun-today");

  let width = 0;
  let height = 0;
  let ratio = 1;
  let orbitX = -0.52;
  let orbitY = -0.38;
  let zoom = 1;
  let dragging = false;
  let previousX = 0;
  let previousY = 0;

  const radians = degrees => degrees * Math.PI / 180;
  const degrees = value => value * 180 / Math.PI;

  function cssColour(name, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  }

  function colourChannels(value) {
    const hex = value.replace("#", "").trim();
    const expanded = hex.length === 3 ? hex.split("").map(character => character + character).join("") : hex;
    return [
      parseInt(expanded.slice(0, 2), 16),
      parseInt(expanded.slice(2, 4), 16),
      parseInt(expanded.slice(4, 6), 16)
    ];
  }

  function mixColour(from, to, amount) {
    const start = colourChannels(from);
    const end = colourChannels(to);
    const mix = Math.max(0, Math.min(1, amount));
    const channels = start.map((value, index) => Math.round(value + (end[index] - value) * mix));
    return "rgb(" + channels.join(", ") + ")";
  }

  function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function dayOfYear(value) {
    const parts = value.split("-").map(Number);
    const current = Date.UTC(parts[0], parts[1] - 1, parts[2]);
    const start = Date.UTC(parts[0], 0, 0);
    return Math.floor((current - start) / 86400000);
  }

  function solarPosition(latitude, day, minutes) {
    const declination = radians(23.44 * Math.sin((2 * Math.PI * (284 + day)) / 365));
    const phi = radians(latitude);
    const hourAngle = radians((minutes / 60 - 12) * 15);
    const altitude = Math.asin(
      Math.sin(phi) * Math.sin(declination)
      + Math.cos(phi) * Math.cos(declination) * Math.cos(hourAngle)
    );
    let azimuth = degrees(Math.atan2(
      Math.sin(hourAngle),
      Math.cos(hourAngle) * Math.sin(phi) - Math.tan(declination) * Math.cos(phi)
    )) + 180;
    azimuth = (azimuth + 360) % 360;
    return { altitude: degrees(altitude), azimuth };
  }

  function worldPoint(azimuth, altitude, radius = 1) {
    const az = radians(azimuth);
    const alt = radians(altitude);
    return {
      x: Math.sin(az) * Math.cos(alt) * radius,
      y: Math.sin(alt) * radius,
      z: Math.cos(az) * Math.cos(alt) * radius
    };
  }

  function project(point) {
    const cosY = Math.cos(orbitY);
    const sinY = Math.sin(orbitY);
    const x1 = point.x * cosY - point.z * sinY;
    const z1 = point.x * sinY + point.z * cosY;
    const cosX = Math.cos(orbitX);
    const sinX = Math.sin(orbitX);
    const y2 = point.y * cosX - z1 * sinX;
    const z2 = point.y * sinX + z1 * cosX;
    const scale = Math.min(width, height) * 0.34 * zoom;
    const perspective = 4.5 / (4.5 + z2);
    return {
      x: width / 2 + x1 * scale * perspective,
      y: height * 0.58 - y2 * scale * perspective,
      z: z2
    };
  }

  function path(points, colour, lineWidth = 1) {
    if (!points.length) return;
    context.beginPath();
    points.forEach((point, index) => {
      const projected = project(point);
      index ? context.lineTo(projected.x, projected.y) : context.moveTo(projected.x, projected.y);
    });
    context.strokeStyle = colour;
    context.lineWidth = lineWidth;
    context.stroke();
  }

  function drawLabel(label, point, colour, align = "center") {
    const projected = project(point);
    context.fillStyle = colour;
    context.font = "600 11px system-ui, sans-serif";
    context.textAlign = align;
    context.fillText(label, projected.x, projected.y);
  }

  function draw() {
    const latitude = Number(latitudeInput.value);
    const day = dayOfYear(dateInput.value);
    const current = solarPosition(latitude, day, Number(timeInput.value));
    const nightTop = cssColour("--sky-night-top", "#0c1620");
    const nightBottom = cssColour("--sky-night-bottom", "#263440");
    const twilightTop = cssColour("--sky-twilight-top", "#596b83");
    const twilightBottom = cssColour("--sky-twilight-bottom", "#d28d6c");
    const dayTop = cssColour("--sky-day-top", "#b8dce8");
    const dayBottom = cssColour("--sky-day-bottom", "#f2e9cf");
    const nightInk = cssColour("--sky-ink-night", "#eef3f0");
    const dayInk = cssColour("--sky-ink-day", "#24332f");
    const nightGrid = cssColour("--sky-grid-night", "#74818b");
    const dayGrid = cssColour("--sky-grid-day", "#8da7a2");
    const lowSun = cssColour("--sun-low", "#ed7449");
    const highSun = cssColour("--sun-high", "#f2bd45");

    let skyTop;
    let skyBottom;
    let daylight;
    if (current.altitude < -4) {
      const twilight = (current.altitude + 12) / 8;
      skyTop = mixColour(nightTop, twilightTop, twilight);
      skyBottom = mixColour(nightBottom, twilightBottom, twilight);
    } else {
      daylight = Math.max(0, Math.min(1, (current.altitude + 4) / 14));
      skyTop = mixColour(twilightTop, dayTop, daylight);
      skyBottom = mixColour(twilightBottom, dayBottom, daylight);
    }

    const inkMix = Math.max(0, Math.min(1, (current.altitude + 6) / 14));
    const ink = mixColour(nightInk, dayInk, inkMix);
    const grid = mixColour(nightGrid, dayGrid, inkMix);
    const sunColour = mixColour(lowSun, highSun, Math.max(0, Math.min(1, current.altitude / 35)));

    context.clearRect(0, 0, width, height);
    const sky = context.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, skyTop);
    sky.addColorStop(1, skyBottom);
    context.fillStyle = sky;
    context.fillRect(0, 0, width, height);

    const horizon = [];
    for (let angle = 0; angle <= 360; angle += 4) horizon.push(worldPoint(angle, 0));
    path(horizon, ink, 1.2);

    for (const altitude of [15, 30, 45, 60, 75]) {
      const circle = [];
      for (let angle = 0; angle <= 360; angle += 6) circle.push(worldPoint(angle, altitude));
      path(circle, grid, 0.8);
    }

    for (const azimuth of [0, 45, 90, 135, 180, 225, 270, 315]) {
      const arc = [];
      for (let altitude = 0; altitude <= 90; altitude += 3) arc.push(worldPoint(azimuth, altitude));
      path(arc, grid, 0.8);
    }

    drawLabel("N", worldPoint(0, 0, 1.12), ink);
    drawLabel("E", worldPoint(90, 0, 1.12), ink);
    drawLabel("S", worldPoint(180, 0, 1.12), ink);
    drawLabel("W", worldPoint(270, 0, 1.12), ink);

    const dailyPath = [];
    for (let minutes = 0; minutes <= 1440; minutes += 8) {
      const position = solarPosition(latitude, day, minutes);
      if (position.altitude >= 0) dailyPath.push(worldPoint(position.azimuth, position.altitude));
    }
    path(dailyPath, sunColour, 2.2);

    if (current.altitude >= 0) {
      const sun = project(worldPoint(current.azimuth, current.altitude));
      context.fillStyle = sunColour;
      context.beginPath();
      context.arc(sun.x, sun.y, 7, 0, Math.PI * 2);
      context.fill();

      const ground = project(worldPoint(current.azimuth, 0, Math.cos(radians(current.altitude))));
      context.strokeStyle = grid;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(ground.x, ground.y);
      context.lineTo(sun.x, sun.y);
      context.stroke();
    }

    altitudeValue.textContent = current.altitude.toFixed(1) + "°";
    azimuthValue.textContent = current.azimuth.toFixed(1) + "°";
    statusValue.textContent = current.altitude >= 0 ? "Above horizon" : "Below horizon";
    statusValue.classList.toggle("is-below", current.altitude < 0);
  }

  function updateLabels() {
    const latitude = Number(latitudeInput.value);
    latitudeValue.value = Math.abs(latitude).toFixed(1) + "° " + (latitude >= 0 ? "N" : "S");
    const minutes = Number(timeInput.value);
    timeValue.value = String(Math.floor(minutes / 60)).padStart(2, "0") + ":" + String(minutes % 60).padStart(2, "0");
    draw();
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    ratio = Math.min(devicePixelRatio || 1, 2);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }

  canvas.addEventListener("pointerdown", event => {
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", event => {
    if (!dragging) return;
    orbitY += (event.clientX - previousX) * 0.008;
    orbitX += (event.clientY - previousY) * 0.008;
    orbitX = Math.max(-1.35, Math.min(0.05, orbitX));
    previousX = event.clientX;
    previousY = event.clientY;
    draw();
  });

  canvas.addEventListener("pointerup", event => {
    dragging = false;
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("wheel", event => {
    event.preventDefault();
    zoom *= Math.exp(-event.deltaY * 0.001);
    zoom = Math.max(0.65, Math.min(1.7, zoom));
    draw();
  }, { passive: false });

  [latitudeInput, dateInput, timeInput].forEach(input => input.addEventListener("input", updateLabels));
  todayButton.addEventListener("click", () => {
    dateInput.value = localDateString();
    updateLabels();
  });

  dateInput.value = localDateString();
  new ResizeObserver(resize).observe(canvas);
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  updateLabels();
})();
