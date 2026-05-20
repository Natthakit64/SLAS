function renderDensity() {
  const labels = ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "23"];
  const series = [
    { name: "Rama IV", color: "#3B6D11", values: [22, 18, 15, 28, 58, 74, 62, 67, 72, 92, 78, 48, 30] },
    { name: "Sathorn", color: "#185FA5", values: [18, 14, 12, 25, 51, 63, 59, 61, 66, 88, 75, 44, 25] },
    { name: "Asoke", color: "#BA7517", values: [20, 16, 13, 30, 64, 70, 65, 72, 78, 96, 82, 52, 33] },
  ];
  const roads = ["Rama IV", "Sathorn", "Asoke", "Ratchada", "Bangna"];
  return `
    <div class="page-stack">
      <section class="section-header">
        <div class="tabs" role="tablist" aria-label="ช่วงเวลา Time range">
          <button class="tab is-active" type="button">วันนี้ Today</button>
          <button class="tab" type="button">สัปดาห์นี้ This Week</button>
          <button class="tab" type="button">เดือนนี้ This Month</button>
        </div>
      </section>
      <article class="panel">
        <div class="panel-header"><div class="panel-title"><h2>ความหนาแน่นตามเวลา</h2><p>Traffic density over time</p></div></div>
        ${multiLineChart(series, labels)}
      </article>
      <article class="panel">
        <div class="panel-header"><div class="panel-title"><h2>ตารางความหนาแน่น</h2><p>Heatmap grid by road and hour</p></div></div>
        <div class="heatmap-grid-wrap">
          <div class="density-grid">
            <div class="density-hour">ถนน / เวลา</div>
            ${Array.from({ length: 24 }, (_, hour) => `<div class="density-hour">${hour}</div>`).join("")}
            ${roads
              .map((road, roadIndex) => {
                const cells = Array.from({ length: 24 }, (_, hour) => {
                  const peak = hour >= 7 && hour <= 9 ? 2 : hour >= 16 && hour <= 19 ? 3 : hour >= 11 && hour <= 14 ? 1 : 0;
                  const level = Math.min(5, Math.max(1, peak + ((roadIndex + hour) % 3)));
                  return `<div class="density-cell level-${level}" title="${road} ${hour}:00"></div>`;
                }).join("");
                return `<div class="density-road">${road}</div>${cells}`;
              })
              .join("")}
          </div>
        </div>
      </article>
    </div>
  `;
}

function heatmapSvg() {
  return `
    <div class="heatmap-map">
      <svg viewBox="0 0 1000 400" role="img" aria-label="Map heatmap">
        <rect width="1000" height="400" fill="#f2f2ef"></rect>
        <g stroke="#d7d4cc" stroke-width="3">
          <path d="M80 40V360"></path><path d="M220 20V380"></path><path d="M380 40V360"></path><path d="M540 20V380"></path><path d="M700 40V360"></path><path d="M860 20V380"></path>
          <path d="M40 80H960"></path><path d="M60 170H940"></path><path d="M40 260H960"></path><path d="M60 340H940"></path>
        </g>
        <g stroke="#bdb9ae" stroke-width="9" stroke-linecap="round" fill="none">
          <path d="M60 260C210 200 320 198 450 260S690 330 920 260"></path>
          <path d="M220 20C260 110 280 190 420 260S650 335 880 340"></path>
        </g>
        <g style="mix-blend-mode:multiply">
          <circle cx="260" cy="170" r="86" fill="#A32D2D" opacity="0.42"></circle>
          <circle cx="420" cy="260" r="112" fill="#DD7844" opacity="0.36"></circle>
          <circle cx="700" cy="260" r="96" fill="#A32D2D" opacity="0.36"></circle>
          <circle cx="830" cy="340" r="68" fill="#BA7517" opacity="0.32"></circle>
          <circle cx="120" cy="80" r="54" fill="#B9D986" opacity="0.5"></circle>
        </g>
      </svg>
    </div>
  `;
}

function renderHeatmaps() {
  const hotspots = [
    ["Sathorn North", "5PM", "92", "up", "+8%"],
    ["Rama IV Gate A", "8AM", "88", "up", "+5%"],
    ["Asoke Junction", "6PM", "86", "flat", "0%"],
    ["Ratchada Tunnel", "5PM", "81", "down", "-4%"],
    ["Bangna Inbound", "7PM", "78", "up", "+6%"],
    ["Vibhavadi Main", "8AM", "73", "flat", "+1%"],
    ["Rama IX Exit", "6PM", "69", "down", "-3%"],
    ["Phahon Yothin", "9AM", "66", "up", "+2%"],
    ["Phetchaburi", "5PM", "63", "flat", "0%"],
    ["Silom West", "8AM", "59", "down", "-2%"],
  ];
  return `
    <div class="page-stack">
      <section class="section-header">
        <div>
          <h2>แผนที่ฮีตแมป</h2>
          <p>Map Heatmap</p>
        </div>
      </section>
      <section class="heatmap-layout">
        <article class="panel">
          ${heatmapSvg()}
        </article>
        <aside class="panel heatmap-control">
          <div class="panel-title">
            <h2>ตัวกรองความเข้ม</h2>
            <p>Intensity threshold</p>
          </div>
          <div class="intensity-scale">
            <div class="scale-bar"></div>
            <ul class="legend">
              <li><span>ต่ำ Low</span><strong>0</strong></li>
              <li><span>สูง High</span><strong>100</strong></li>
            </ul>
          </div>
          <div class="range-row">
            <label for="intensitySlider">Threshold</label>
            <span class="range-value">62</span>
            <input class="range-input timing-slider" id="intensitySlider" type="range" min="0" max="100" value="62" />
          </div>
        </aside>
      </section>
      <section class="table-wrap">
        <div class="table-header">
          <div class="panel-title"><h2>จุดร้อนสูงสุด</h2><p>Top 10 hotspot locations</p></div>
        </div>
        <div class="table-scroll">
          <table>
            <thead><tr><th>พื้นที่ Location</th><th>ชั่วโมงสูงสุด Peak Hour</th><th>คะแนน Intensity Score</th><th>แนวโน้ม Trend</th></tr></thead>
            <tbody>
              ${hotspots
                .map(
                  ([location, hour, score, trend, change]) => `
                    <tr>
                      <td>${location}</td><td>${hour}</td><td>${score}</td>
                      <td><span class="trend ${trend}">${icon(trend === "up" ? "arrowUp" : trend === "down" ? "arrowDown" : "minus")}${change}</span></td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function pointInPlanningBoundary(point) {
  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = planningBoundary.length - 1; i < planningBoundary.length; j = i++) {
    const [latI, lngI] = planningBoundary[i];
    const [latJ, lngJ] = planningBoundary[j];
    const intersects = lngI > lng !== lngJ > lng && lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI;
    if (intersects) inside = !inside;
  }

  return inside;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function distanceMeters(pointA, pointB) {
  const midLat = ((pointA[0] + pointB[0]) / 2) * (Math.PI / 180);
  const metersPerLat = 111_320;
  const metersPerLng = Math.cos(midLat) * 111_320;
  return Math.hypot((pointA[0] - pointB[0]) * metersPerLat, (pointA[1] - pointB[1]) * metersPerLng);
}

function routeLength(points) {
  return points.slice(1).reduce((total, point, index) => {
    const previous = points[index];
    return total + distanceMeters(point, previous);
  }, 0);
}

function pointOnRoute(points, progress) {
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  const totalLength = routeLength(points);
  let walked = 0;

  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const segmentLength = distanceMeters(end, start);
    const target = safeProgress * totalLength;

    if (walked + segmentLength >= target) {
      const ratio = segmentLength ? (target - walked) / segmentLength : 0;
      return [start[0] + (end[0] - start[0]) * ratio, start[1] + (end[1] - start[1]) * ratio];
    }

    walked += segmentLength;
  }

  return points[points.length - 1];
}

function headingOnRoute(points, progress) {
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  const ahead = pointOnRoute(points, Math.min(safeProgress + 0.012, 1));
  const behind = pointOnRoute(points, Math.max(safeProgress - 0.012, 0));
  return Math.atan2(ahead[1] - behind[1], ahead[0] - behind[0]) * (180 / Math.PI) + 90;
}


function assignVehicleRoute(vehicle, shouldKeepHistory = false) {
  const route = planningCameraRoutes[Math.floor(Math.random() * planningCameraRoutes.length)];
  const reverse = Math.random() > 0.5;
  vehicle.routeName = route.name;
  vehicle.cameraIds = route.cameraIds;
  vehicle.points = reverse ? [...route.points].reverse() : route.points;
  if (reverse) vehicle.cameraIds = [...route.cameraIds].reverse();
  vehicle.progress = randomBetween(0, 0.92);
  vehicle.duration = randomBetween(24000, 56000);

  if (!shouldKeepHistory) {
    vehicle.historySegments = [[]];
  } else {
    vehicle.historySegments.push([]);
    if (vehicle.historySegments.length > 20) vehicle.historySegments.shift();
  }

}


function planningPopupHtml(vehicle, densityMode) {
  return `
    <div class="vehicle-popup">
      <strong>${vehicle.id}</strong>
      <span>${vehicle.routeName}</span>
      <span>ผ่านกล้อง: ${vehicle.cameraIds?.join(" → ") ?? "-"}</span>
      <span>ความหนาแน่น: ${densityMode.th}</span>
      <span>ความเร็วประมาณ: ${Math.max(8, Math.round(densityMode.speed + vehicle.speedOffset))} กม./ชม.</span>
    </div>
  `;
}

function cleanupPlanningMap() {
  if (!planningMapRuntime) return;

  cancelAnimationFrame(planningMapRuntime.animationFrame);
  clearTimeout(planningMapRuntime.densityTimer);
  planningMapRuntime.resizeObserver?.disconnect();
  planningMapRuntime.map.remove();
  planningMapRuntime = null;
}

function cleanupTrafficDetailMap() {
  if (!trafficDetailMapRuntime) return;
  trafficDetailMapRuntime.map.remove();
  trafficDetailMapRuntime = null;
}

function drawCameraMarkers(map, selectedCameraId = "") {
  planningCameraPoints.forEach((camera) => {
    const isSelected = camera.id === selectedCameraId;
    L.circleMarker(camera.point, {
      className: "camera-map-marker",
      color: "#ffffff",
      fillColor: isSelected ? "#1a73e8" : "#e51620",
      fillOpacity: 0.96,
      radius: isSelected ? 12 : 9,
      weight: isSelected ? 3 : 2,
    })
      .bindTooltip(`${camera.id} ${camera.name}`, { direction: "top", offset: [0, -8] })
      .addTo(map);
  });
}

function findNextRoad(currentName, endPoint) {
  let best = null;
  let bestDist = Infinity;
  let bestReverse = false;
  planningCameraRoutes.forEach((road) => {
    if (road.name === currentName) return;
    const s = distanceMeters(road.points[0], endPoint);
    const e = distanceMeters(road.points[road.points.length - 1], endPoint);
    if (s < bestDist) { bestDist = s; best = road; bestReverse = false; }
    if (e < bestDist) { bestDist = e; best = road; bestReverse = true; }
  });
  if (bestDist > routeConnectionMaxMeters) return null;
  return best
    ? {
        cameraIds: bestReverse ? [...best.cameraIds].reverse() : best.cameraIds,
        points: bestReverse ? [...best.points].reverse() : best.points,
        segments: bestReverse
          ? cameraSegments([...best.cameraIds].reverse(), [...best.points].reverse())
          : best.segments,
        name: best.name,
      }
    : null;
}

function bindPlanningMapInteractions() {
  const mapElement = document.querySelector("#planningTrafficMap");
  if (!mapElement) return;

  cleanupPlanningMap();

  if (!window.L) {
    mapElement.innerHTML = `<div class="map-fallback">ไม่สามารถโหลด Leaflet ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</div>`;
    return;
  }

  const routePoints = planningRoads.flatMap((road) => road.points);
  const cameraRoutePoints = planningCameraRoutes.flatMap((route) => route.points);
  const cameraPoints = planningCameraPoints.map((camera) => camera.point);
  const bounds = L.latLngBounds([...planningBoundary, ...routePoints, ...cameraRoutePoints, ...cameraPoints]);
  const map = L.map(mapElement, { zoomControl: true, scrollWheelZoom: true, preferCanvas: true });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 20,
  }).addTo(map);

  map.fitBounds(bounds, { padding: [24, 24] });

  // Marker กล้องจะอ่านตำแหน่งจาก planningCameraPoints ด้านบนเสมอ
  // ดังนั้นถ้าขยับ point ใน array แล้ว refresh หน้า map จุดแดงจะย้ายตามทันที
  drawCameraMarkers(map);

  const runtime = {
    animationFrame: null,
    densityIndex: 0,
    densityTimer: null,
    lastFrame: performance.now(),
    map,
    resizeObserver: null,
    selectedRouteLayer: null,
    selectedTrail: null,
    selectedVehicle: null,
    vehicles: [],
  };

  planningMapRuntime = runtime;

  function circleStyle(densityMode, isSelected) {
    return {
      radius: isSelected ? 10 : 7,
      color: isSelected ? "#1a73e8" : "#ffffff",
      fillColor: densityMode.color,
      fillOpacity: 0.92,
      weight: isSelected ? 3 : 1.5,
    };
  }

  function deselectVehicle() {
    if (!runtime.selectedVehicle) return;
    runtime.selectedVehicle.isSelected = false;
    runtime.selectedVehicle.marker.setStyle(circleStyle(planningDensityModes[runtime.densityIndex], false));
    runtime.selectedVehicle.marker.closePopup();
    runtime.selectedVehicle = null;
    if (runtime.selectedRouteLayer) { runtime.selectedRouteLayer.remove(); runtime.selectedRouteLayer = null; }
    if (runtime.selectedTrail) { runtime.selectedTrail.remove(); runtime.selectedTrail = null; }
  }

  function drawSelectedRoute(vehicle) {
    if (runtime.selectedRouteLayer) runtime.selectedRouteLayer.remove();

    const segments = cameraSegments(vehicle.cameraIds, vehicle.points);
    runtime.selectedRouteLayer = L.layerGroup(
      segments.map((segment) =>
        L.polyline(segment.points, {
          color: "#1a73e8",
          interactive: true,
          opacity: 0.88,
          weight: 7,
          lineCap: "round",
          lineJoin: "round",
        }).bindTooltip(`${segment.from} → ${segment.to}`, { direction: "center", sticky: true }),
      ),
    ).addTo(map);
  }

  function selectVehicle(vehicle) {
    if (vehicle.isSelected) { deselectVehicle(); return; }
    deselectVehicle();
    vehicle.isSelected = true;
    runtime.selectedVehicle = vehicle;
    vehicle.marker.setStyle(circleStyle(planningDensityModes[runtime.densityIndex], true));
    drawSelectedRoute(vehicle);
    runtime.selectedTrail = L.polyline(vehicle.historySegments, {
      color: "#1a73e8",
      weight: 9,
      opacity: 0.85,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);
    vehicle.marker.bindPopup(planningPopupHtml(vehicle, planningDensityModes[runtime.densityIndex])).openPopup();
  }

  function createVehicle(index) {
    const densityMode = planningDensityModes[runtime.densityIndex];
    const vehicle = {
      id: `NT-${String(index + 1).padStart(3, "0")}`,
      direction: Math.random() > 0.5 ? 1 : -1,
      historySegments: [[]],
      isSelected: false,
      marker: null,
      speedOffset: randomBetween(-4, 5),
    };
    assignVehicleRoute(vehicle);
    vehicle.marker = L.circleMarker(pointOnRoute(vehicle.points, vehicle.progress), circleStyle(densityMode, false)).addTo(map);
    vehicle.marker.on("click", () => selectVehicle(vehicle));
    return vehicle;
  }

  function syncVehicleFleet() {
    const densityMode = planningDensityModes[runtime.densityIndex];
    while (runtime.vehicles.length < densityMode.vehicles) runtime.vehicles.push(createVehicle(runtime.vehicles.length));
    while (runtime.vehicles.length > densityMode.vehicles) {
      const idx = runtime.vehicles.findIndex((v) => v !== runtime.selectedVehicle);
      const [v] = runtime.vehicles.splice(idx === -1 ? runtime.vehicles.length - 1 : idx, 1);
      v.marker.remove();
    }
  }

  function updateDensityUi() {
    const densityMode = planningDensityModes[runtime.densityIndex];
    document.querySelector("#planningDensityLabel").textContent = `${densityMode.th} (${densityMode.en})`;
    document.querySelector("#planningVehicleCount").textContent = `${formatNumber(densityMode.vehicles)} คัน`;
    document.querySelector("#planningAvgSpeed").textContent = `${densityMode.speed} กม./ชม.`;
    document.querySelectorAll("[data-density-pill]").forEach((pill) => {
      pill.classList.toggle("is-active", pill.dataset.densityPill === densityMode.id);
    });
    runtime.vehicles.forEach((v) => v.marker.setStyle(circleStyle(densityMode, v.isSelected)));
  }

  function cycleDensity() {
    runtime.densityIndex = (runtime.densityIndex + 1) % planningDensityModes.length;
    updateDensityUi();
    syncVehicleFleet();
    runtime.densityTimer = setTimeout(cycleDensity, planningDensityModes[runtime.densityIndex].duration);
  }

  document.querySelectorAll("[data-density-pill]").forEach((pill) => {
    pill.style.cursor = "pointer";
    pill.addEventListener("click", () => {
      const newIndex = planningDensityModes.findIndex((m) => m.id === pill.dataset.densityPill);
      if (newIndex !== -1 && newIndex !== runtime.densityIndex) {
        clearTimeout(runtime.densityTimer);
        runtime.densityIndex = newIndex;
        updateDensityUi();
        syncVehicleFleet();
        runtime.densityTimer = setTimeout(cycleDensity, planningDensityModes[runtime.densityIndex].duration);
      }
    });
  });

  function animate(now) {
    const delta = Math.min(now - runtime.lastFrame, 80);
    const densityMode = planningDensityModes[runtime.densityIndex];
    const speedFactor = 1 + runtime.densityIndex * 0.42;
    runtime.lastFrame = now;

    runtime.vehicles.forEach((vehicle) => {
      vehicle.progress += (delta / (vehicle.duration * speedFactor)) * vehicle.direction;

      if (vehicle.progress >= 1) {
        vehicle.progress = 1;
        vehicle.direction = -1;
        const next = findNextRoad(vehicle.routeName, vehicle.points[vehicle.points.length - 1]);
        if (next) {
          vehicle.routeName = next.name;
          vehicle.cameraIds = next.cameraIds;
          vehicle.points = next.points;
          vehicle.progress = 0;
          vehicle.direction = 1;
          if (vehicle.isSelected) drawSelectedRoute(vehicle);
        }
        vehicle.historySegments.push([]);
        if (vehicle.historySegments.length > 20) vehicle.historySegments.shift();
      } else if (vehicle.progress <= 0) {
        vehicle.progress = 0;
        vehicle.direction = 1;
        const next = findNextRoad(vehicle.routeName, vehicle.points[0]);
        if (next) {
          vehicle.routeName = next.name;
          vehicle.cameraIds = next.cameraIds;
          vehicle.points = next.points;
          vehicle.progress = 1;
          vehicle.direction = -1;
          if (vehicle.isSelected) drawSelectedRoute(vehicle);
        }
        vehicle.historySegments.push([]);
        if (vehicle.historySegments.length > 20) vehicle.historySegments.shift();
      }

      const position = pointOnRoute(vehicle.points, vehicle.progress);
      vehicle.marker.setLatLng(position);

      const seg = vehicle.historySegments[vehicle.historySegments.length - 1];
      seg.push(position);
      if (seg.length > 400) seg.shift();

      if (vehicle.isSelected) {
        if (runtime.selectedTrail) runtime.selectedTrail.setLatLngs(vehicle.historySegments);
        if (vehicle.marker.isPopupOpen()) vehicle.marker.setPopupContent(planningPopupHtml(vehicle, densityMode));
      }
    });

    runtime.animationFrame = requestAnimationFrame(animate);
  }

  syncVehicleFleet();
  updateDensityUi();
  runtime.densityTimer = setTimeout(cycleDensity, planningDensityModes[0].duration);
  runtime.animationFrame = requestAnimationFrame(animate);
  if (window.ResizeObserver) {
    runtime.resizeObserver = new ResizeObserver(() => map.invalidateSize());
    runtime.resizeObserver.observe(mapElement);
  }
  setTimeout(() => map.invalidateSize(), 100);
}

function bindTrafficDetailInteractions() {
  const backButton = document.querySelector("[data-back-to-search]");
  backButton?.addEventListener("click", () => setActivePage("trafficSearch"));

  const mapElement = document.querySelector("#trafficDetailMap");
  if (!mapElement) return;

  cleanupTrafficDetailMap();

  if (!window.L) {
    mapElement.innerHTML = `<div class="map-fallback">ไม่สามารถโหลด Leaflet ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</div>`;
    return;
  }

  const record = findTrafficRecord(selectedTrafficRecordKey) ?? trafficRecords[0];
  const route = routeForTrafficRecord(record);
  const selectedStop = cameraStop(record.camera);
  const routePoints = route?.points?.length ? route.points : planningCameraPoints.map((camera) => camera.point);
  const bounds = L.latLngBounds([...routePoints, ...(selectedStop ? [selectedStop.point] : [])]);
  const map = L.map(mapElement, { zoomControl: true, scrollWheelZoom: true, preferCanvas: true });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 20,
  }).addTo(map);

  map.fitBounds(bounds, { padding: [34, 34] });

  drawCameraMarkers(map, selectedStop?.id);

  cameraSegments(route.cameraIds, route.points).forEach((segment) => {
    L.polyline(segment.points, {
      color: "#1a73e8",
      interactive: true,
      opacity: 0.9,
      weight: 7,
      lineCap: "round",
      lineJoin: "round",
    })
      .bindTooltip(`${segment.from} → ${segment.to}`, { direction: "center", sticky: true })
      .addTo(map);
  });

  if (selectedStop) {
    L.circleMarker(selectedStop.point, {
      color: "#ffffff",
      fillColor: "#45B15B",
      fillOpacity: 0.96,
      radius: 6,
      weight: 2,
    })
      .bindPopup(`${record.plate}<br>${record.time}<br>${record.camera}`)
      .addTo(map)
      .openPopup();
  }

  trafficDetailMapRuntime = { map };
  setTimeout(() => map.invalidateSize(), 100);
}

