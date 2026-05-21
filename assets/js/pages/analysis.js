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

const heatmapPeriods = [
  { id: "day", th: "วันนี้", en: "Day", multiplier: 1 },
  { id: "month", th: "เดือนนี้", en: "Month", multiplier: 24 },
  { id: "year", th: "ปีนี้", en: "Year", multiplier: 288 },
];

function heatmapPeriod(periodId = "day") {
  return heatmapPeriods.find((period) => period.id === periodId) ?? heatmapPeriods[0];
}

function heatmapIntensityColor(intensity) {
  if (intensity >= 82) return "#7f1d1d";
  if (intensity >= 62) return "#b91c1c";
  if (intensity >= 38) return "#dc2626";
  if (intensity > 0) return "#ef4444";
  return "#fca5a5";
}

function heatmapSegmentKey(from, to) {
  const direct = planningRoadSegments.find((segment) => segment.from === from && segment.to === to);
  if (direct) return direct.key;

  const reverse = planningRoadSegments.find((segment) => segment.from === to && segment.to === from);
  if (reverse) return reverse.key;

  return roadSegmentKey(from, to);
}

function heatmapRoadStats(periodId = "day") {
  const period = heatmapPeriod(periodId);
  const segmentCounts = new Map(planningRoadSegments.map((segment) => [segment.key, 0]));

  trafficRecords
    .filter((record) => record.event_type !== "route_debug")
    .forEach((record) => {
      const route = routeForTrafficRecord(record);
      route?.segments?.forEach((segment) => {
        const key = heatmapSegmentKey(segment.from, segment.to);
        segmentCounts.set(key, (segmentCounts.get(key) ?? 0) + 1);
      });
    });

  const rawCounts = planningRoadSegments.map((segment) => segmentCounts.get(segment.key) ?? 0);
  const maxCount = Math.max(...rawCounts, 1);

  return planningRoadSegments
    .map((segment) => {
      const baseCount = segmentCounts.get(segment.key) ?? 0;
      const intensity = baseCount ? Math.max(18, Math.round((baseCount / maxCount) * 100)) : 0;
      return {
        ...segment,
        label: `${segment.from} -> ${segment.to}`,
        count: baseCount * period.multiplier,
        intensity,
        period,
        color: heatmapIntensityColor(intensity),
        opacity: baseCount ? 0.36 + intensity * 0.0056 : 0.18,
        weight: baseCount ? 5 + intensity * 0.08 : 3,
      };
    })
    .sort((a, b) => b.count - a.count || b.intensity - a.intensity || a.label.localeCompare(b.label));
}

function renderHeatmapPeriodTabs(activePeriodId = "day") {
  return heatmapPeriods
    .map(
      (period) => `
        <button class="tab ${period.id === activePeriodId ? "is-active" : ""}" type="button" data-heatmap-period="${period.id}">
          ${period.th} <span>${period.en}</span>
        </button>
      `,
    )
    .join("");
}

function renderHeatmapSummary(periodId = "day") {
  const stats = heatmapRoadStats(periodId);
  const period = heatmapPeriod(periodId);
  const total = stats.reduce((sum, item) => sum + item.count, 0);
  const peak = stats[0];
  const activeSegments = stats.filter((item) => item.count > 0).length;

  return `
    <div class="heatmap-stat-list">
      <div class="heatmap-stat"><span>ช่วงข้อมูล</span><strong>${period.th} ${period.en}</strong></div>
      <div class="heatmap-stat"><span>จำนวนรวม</span><strong>${formatNumber(total)}</strong></div>
      <div class="heatmap-stat"><span>เส้นทางที่มีข้อมูล</span><strong>${activeSegments}/${stats.length}</strong></div>
      <div class="heatmap-stat"><span>ถนนหนาแน่นสุด</span><strong>${peak.label}</strong><small>${formatNumber(peak.count)} records</small></div>
    </div>
  `;
}

function renderHeatmapRows(periodId = "day") {
  return heatmapRoadStats(periodId)
    .map(
      (item) => `
        <tr>
          <td>${item.label}</td>
          <td>${item.from} &rarr; ${item.to}</td>
          <td>${formatNumber(item.count)}</td>
          <td><span class="heatmap-score" style="--heat:${item.color}">${item.intensity}</span></td>
        </tr>
      `,
    )
    .join("");
}

function renderHeatmaps() {
  return `
    <div class="page-stack">
      <section class="section-header">
        <div>
          <h2>แผนที่ฮีตแมป</h2>
          <p>Road intensity heatmap by day, month, and year</p>
        </div>
        <div class="tabs" role="tablist" aria-label="Heatmap period">
          ${renderHeatmapPeriodTabs("day")}
        </div>
      </section>
      <section class="heatmap-layout">
        <article class="panel heatmap-map-panel">
          <div id="analysisHeatmapMap" class="traffic-live-map analysis-heatmap-map" role="img" aria-label="แผนที่ฮีตแมปความเข้มบนถนน"></div>
          <div class="map-legend traffic-map-legend">
            <span class="legend-chip"><span class="status-dot" style="--dot:#ef4444"></span>Low</span>
            <span class="legend-chip"><span class="status-dot" style="--dot:#dc2626"></span>Medium</span>
            <span class="legend-chip"><span class="status-dot" style="--dot:#b91c1c"></span>High</span>
            <span class="legend-chip"><span class="status-dot" style="--dot:#7f1d1d"></span>Peak</span>
          </div>
        </article>
        <aside class="panel heatmap-control">
          <div class="panel-title">
            <h2>สรุปสถิติ</h2>
            <p>Heatmap summary</p>
          </div>
          <div id="heatmapSummary">${renderHeatmapSummary("day")}</div>
        </aside>
      </section>
      <section class="table-wrap">
        <div class="table-header">
          <div class="panel-title"><h2>สถิติตามเส้นถนน</h2><p>Road segment heatmap records</p></div>
        </div>
        <div class="table-scroll">
          <table>
            <thead><tr><th>เส้นถนน Segment</th><th>ช่วง Route</th><th>จำนวน Count</th><th>คะแนน Intensity</th></tr></thead>
            <tbody id="heatmapStatsBody">
              ${renderHeatmapRows("day")}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

const truckRoadLimits = [
  { road: "Bangna Inbound", dailyLimit: 2, loadFactor: 1.2, owner: "East corridor" },
  { road: "Ratchada Tunnel", dailyLimit: 2, loadFactor: 1.15, owner: "North corridor" },
  { road: "Asoke Junction", dailyLimit: 2, loadFactor: 1.05, owner: "Central junction" },
  { road: "Rama IV - Gate A", dailyLimit: 3, loadFactor: 1, owner: "Gate access" },
  { road: "Sathorn Ramp", dailyLimit: 3, loadFactor: 1, owner: "Ramp access" },
  { road: "Vibhavadi Main", dailyLimit: 3, loadFactor: 1.1, owner: "North main" },
  { road: "Phahon Yothin", dailyLimit: 3, loadFactor: 1, owner: "North outbound" },
  { road: "Rama IX Exit", dailyLimit: 3, loadFactor: 1, owner: "Central exit" },
];

function truckTrafficRecords() {
  return trafficRecords.filter((record) => record.vehicle_type === "รถบรรทุก");
}

function truckRiskLevel(score) {
  if (score >= 85) return { label: "เสี่ยงสูง", className: "risk-critical", color: "#a32d2d" };
  if (score >= 60) return { label: "เฝ้าระวัง", className: "risk-watch", color: "#ba7517" };
  if (score >= 35) return { label: "เริ่มสะสม", className: "risk-notice", color: "#185fa5" };
  return { label: "ปกติ", className: "risk-normal", color: "#3b6d11" };
}

function latestTruckTime(records) {
  if (!records.length) return "-";
  return trafficRecordTime(
    [...records].sort((a, b) => String(b.detected_at).localeCompare(String(a.detected_at)))[0],
  );
}

function truckRoadStats() {
  const trucks = truckTrafficRecords();
  return truckRoadLimits
    .map((road) => {
      const records = trucks.filter((record) => record.location === road.road);
      const equivalentLoad = Number((records.length * road.loadFactor).toFixed(1));
      const riskScore = Math.min(100, Math.round((equivalentLoad / road.dailyLimit) * 100));
      const risk = truckRiskLevel(riskScore);
      return {
        ...road,
        count: records.length,
        equivalentLoad,
        latest: latestTruckTime(records),
        risk,
        riskScore,
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore || b.count - a.count || a.road.localeCompare(b.road));
}

function renderTruckRiskCards(stats) {
  return stats
    .slice(0, 4)
    .map(
      (item) => `
        <article class="truck-risk-card">
          <div>
            <strong>${item.road}</strong>
            <span>${item.owner}</span>
          </div>
          <span class="road-risk-pill ${item.risk.className}" style="--risk:${item.risk.color}">${item.risk.label}</span>
          <div class="truck-risk-meter" aria-label="Road wear risk ${item.riskScore}%">
            <span style="width:${item.riskScore}%; --risk:${item.risk.color}"></span>
          </div>
          <small>${formatNumber(item.count)} รอบ · load index ${item.equivalentLoad}/${item.dailyLimit}</small>
        </article>
      `,
    )
    .join("");
}

function renderTruckRunRows(stats) {
  return stats
    .map(
      (item) => `
        <tr>
          <td>${item.road}</td>
          <td>${item.owner}</td>
          <td><strong>${formatNumber(item.count)}</strong></td>
          <td>${item.equivalentLoad}</td>
          <td>${item.dailyLimit}</td>
          <td><span class="road-risk-pill ${item.risk.className}" style="--risk:${item.risk.color}">${item.risk.label}</span></td>
          <td>${item.latest}</td>
        </tr>
      `,
    )
    .join("");
}

function renderTruckRuns() {
  const stats = truckRoadStats();
  const trucks = truckTrafficRecords();
  const activeRoads = stats.filter((item) => item.count > 0).length;
  const watchRoads = stats.filter((item) => item.riskScore >= 60).length;
  const topRoad = stats[0];
  const chartItems = stats
    .slice(0, 6)
    .map((item) => ({ label: item.road, value: item.count, color: item.risk.color }));

  return `
    <div class="page-stack truck-runs-page">
      <section class="report-header">
        <div>
          <h2>จำนวนรถบรรทุกวิ่ง</h2>
          <p>Truck runs by road and road wear risk</p>
        </div>
        <button class="button secondary" type="button">${iconSpan("export")}ส่งออก Export</button>
      </section>

      <section class="metric-grid">
        ${metricCard({ value: formatNumber(trucks.length), th: "รถบรรทุกทั้งหมด", en: "Truck runs today", iconName: "truck", color: "#A32D2D" })}
        ${metricCard({ value: formatNumber(activeRoads), th: "ถนนที่มีรถบรรทุก", en: "Active truck roads", iconName: "road", color: "#185FA5" })}
        ${metricCard({ value: formatNumber(watchRoads), th: "ถนนเฝ้าระวัง", en: "Roads at watch level", iconName: "alert-triangle", color: "#BA7517" })}
        ${metricCard({ value: topRoad.road, th: "ถนนเสี่ยงสูงสุด", en: "Highest wear risk", iconName: "speed", color: topRoad.risk.color })}
      </section>

      <section class="comparison-grid truck-runs-grid">
        <article class="panel">
          <div class="panel-header">
            <div class="panel-title">
              <h2>จำนวนรถบรรทุกตามถนน</h2>
              <p>Truck pass count by road</p>
            </div>
          </div>
          ${horizontalBarChart(chartItems)}
        </article>

        <aside class="panel truck-risk-panel">
          <div class="panel-title">
            <h2>ความเสี่ยงถนนพัง</h2>
            <p>Road wear watch list</p>
          </div>
          <div class="truck-risk-list">
            ${renderTruckRiskCards(stats)}
          </div>
        </aside>
      </section>

      <section class="table-wrap">
        <div class="table-header">
          <div class="panel-title">
            <h2>ตารางสถิติรถบรรทุก</h2>
            <p>Truck run records grouped by road</p>
          </div>
        </div>
        <div class="table-scroll">
          <table class="truck-runs-table">
            <thead>
              <tr>
                <th>ถนน Road</th>
                <th>กลุ่มเส้นทาง Corridor</th>
                <th>จำนวนรอบ Runs</th>
                <th>ดัชนีสะสม Load index</th>
                <th>เกณฑ์เฝ้าระวัง Watch limit</th>
                <th>ความเสี่ยง Risk</th>
                <th>ล่าสุด Latest</th>
              </tr>
            </thead>
            <tbody>${renderTruckRunRows(stats)}</tbody>
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
  return Math.atan2(ahead[1] - behind[1], ahead[0] - behind[0]) * (180 / Math.PI);
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
  trafficDetailMapRuntime.cleanup?.();
  cleanupTrafficRouteMapRuntime(trafficDetailMapRuntime.inline);
  cleanupTrafficRouteMapRuntime(trafficDetailMapRuntime.expanded);
  document.body.classList.remove("has-traffic-map-modal");
  trafficDetailMapRuntime = null;
}

function cleanupHeatmapMap() {
  if (!heatmapMapRuntime) return;
  heatmapMapRuntime.resizeObserver?.disconnect();
  heatmapMapRuntime.map.remove();
  heatmapMapRuntime = null;
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

function drawRoadSegmentGuides(map) {
  return L.layerGroup(
    planningRoadSegments.map((segment) =>
      L.polyline(segment.points, {
        color: "#2d5f8f",
        dashArray: "8 10",
        interactive: true,
        lineCap: "round",
        lineJoin: "round",
        opacity: 0.44,
        weight: 4,
      }).bindTooltip(`${segment.from} -> ${segment.to}`, { direction: "center", sticky: true }),
    ),
  ).addTo(map);
}

function routeDirectionIcon(heading, className = "") {
  return L.divIcon({
    className: `route-direction-arrow-icon ${className}`,
    html: `<span class="route-arrow-symbol" style="transform: rotate(${heading}deg)">${icon("arrowUp")}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function setRouteArrowHeading(marker, heading) {
  const arrow = marker.getElement()?.querySelector(".route-arrow-symbol");
  if (arrow) arrow.style.transform = `rotate(${heading}deg)`;
}

function drawRouteDirectionArrows(map, segments) {
  return L.layerGroup(
    segments.map((segment) => {
      const progress = 0.52;
      return L.marker(pointOnRoute(segment.points, progress), {
        icon: routeDirectionIcon(headingOnRoute(segment.points, progress)),
        interactive: false,
        keyboard: false,
      });
    }),
  ).addTo(map);
}

function createMovingRouteArrow(map, points) {
  if (!points?.length) return null;

  return L.marker(pointOnRoute(points, 0), {
    icon: routeDirectionIcon(headingOnRoute(points, 0), "route-moving-arrow-icon"),
    interactive: false,
    keyboard: false,
  }).addTo(map);
}

function cleanupTrafficRouteMapRuntime(runtime) {
  if (!runtime) return;
  cancelAnimationFrame(runtime.animationFrame);
  runtime.map.remove();
}

function createTrafficRouteMap(mapElement, route, selectedStop, record, options = {}) {
  const routePoints = route?.points?.length ? route.points : planningCameraPoints.map((camera) => camera.point);
  const bounds = L.latLngBounds([...routePoints, ...(selectedStop ? [selectedStop.point] : [])]);
  const map = L.map(mapElement, {
    zoomControl: true,
    scrollWheelZoom: true,
    preferCanvas: true,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 20,
  }).addTo(map);

  map.fitBounds(bounds, { padding: options.padding ?? [34, 34] });

  drawRoadSegmentGuides(map);
  drawCameraMarkers(map, selectedStop?.id);

  route.segments.forEach((segment) => {
    L.polyline(segment.points, {
      color: "#1a73e8",
      interactive: true,
      opacity: 0.9,
      weight: options.routeWeight ?? 7,
      lineCap: "round",
      lineJoin: "round",
    })
      .bindTooltip(`${segment.from} → ${segment.to}`, { direction: "center", sticky: true })
      .addTo(map);
  });
  drawRouteDirectionArrows(map, route.segments);

  if (selectedStop) {
    L.circleMarker(selectedStop.point, {
      color: "#ffffff",
      fillColor: "#45B15B",
      fillOpacity: 0.96,
      radius: options.selectedRadius ?? 6,
      weight: 2,
    })
      .bindPopup(`${record.plate}<br>${trafficRecordTime(record)}<br>${record.camera_id}`)
      .addTo(map)
      .openPopup();
  }

  const runtime = {
    animationFrame: null,
    map,
    movingArrow: createMovingRouteArrow(map, route.points),
  };
  const animationStart = performance.now();

  function animateRouteArrow(now) {
    if (!runtime.movingArrow || !route.points.length) return;
    const duration = Math.max(6500, routeLength(route.points) * 42);
    const progress = ((now - animationStart) % duration) / duration;
    runtime.movingArrow.setLatLng(pointOnRoute(route.points, progress));
    setRouteArrowHeading(runtime.movingArrow, headingOnRoute(route.points, progress));
    runtime.animationFrame = requestAnimationFrame(animateRouteArrow);
  }

  runtime.animationFrame = requestAnimationFrame(animateRouteArrow);
  setTimeout(() => map.invalidateSize(), 100);
  return runtime;
}

function drawHeatmapRoadSegments(map, periodId) {
  return L.layerGroup(
    heatmapRoadStats(periodId).flatMap((item) => [
      L.polyline(item.points, {
        className: "heatmap-road-glow",
        color: item.color,
        interactive: false,
        lineCap: "round",
        lineJoin: "round",
        opacity: Math.min(0.34, item.opacity * 0.42),
        weight: item.weight + 8,
      }),
      L.polyline(item.points, {
        className: "heatmap-road-segment",
        color: item.color,
        interactive: true,
        lineCap: "round",
        lineJoin: "round",
        opacity: item.opacity,
        weight: item.weight,
      }).bindTooltip(
        `${item.label}<br>${item.period.th}: ${formatNumber(item.count)} records<br>Intensity: ${item.intensity}`,
        { direction: "center", sticky: true },
      ),
    ]),
  ).addTo(map);
}

function bindHeatmapInteractions() {
  const mapElement = document.querySelector("#analysisHeatmapMap");
  if (!mapElement) return;

  cleanupHeatmapMap();

  if (!window.L) {
    mapElement.innerHTML = `<div class="map-fallback">ไม่สามารถโหลด Leaflet ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</div>`;
    return;
  }

  const roadSegmentPoints = planningRoadSegments.flatMap((segment) => segment.points);
  const cameraPoints = planningCameraPoints.map((camera) => camera.point);
  const bounds = L.latLngBounds([...planningBoundary, ...roadSegmentPoints, ...cameraPoints]);
  const map = L.map(mapElement, {
    attributionControl: false,
    boxZoom: false,
    doubleClickZoom: false,
    dragging: false,
    keyboard: false,
    preferCanvas: true,
    scrollWheelZoom: false,
    tap: false,
    touchZoom: false,
    zoomControl: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
  }).addTo(map);

  map.fitBounds(bounds, { padding: [24, 24] });
  map.setMaxBounds(bounds.pad(0.08));

  const runtime = {
    heatLayer: null,
    map,
    resizeObserver: null,
  };

  heatmapMapRuntime = runtime;

  function setPeriod(periodId) {
    if (runtime.heatLayer) runtime.heatLayer.remove();
    runtime.heatLayer = drawHeatmapRoadSegments(map, periodId);
    document.querySelector("#heatmapSummary").innerHTML = renderHeatmapSummary(periodId);
    document.querySelector("#heatmapStatsBody").innerHTML = renderHeatmapRows(periodId);
    document.querySelectorAll("[data-heatmap-period]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.heatmapPeriod === periodId);
    });
  }

  document.querySelectorAll("[data-heatmap-period]").forEach((button) => {
    button.addEventListener("click", () => setPeriod(button.dataset.heatmapPeriod));
  });

  setPeriod("day");

  if (window.ResizeObserver) {
    runtime.resizeObserver = new ResizeObserver(() => map.invalidateSize());
    runtime.resizeObserver.observe(mapElement);
  }
  setTimeout(() => map.invalidateSize(), 100);
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
  if (!best) return null;

  const cameraIds = bestReverse ? [...best.cameraIds].reverse() : best.cameraIds;
  return {
    cameraIds,
    points: bestReverse ? [...best.points].reverse() : best.points,
    segments: cameraSegments(cameraIds),
    name: best.name,
  };
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
  const roadSegmentPoints = planningRoadSegments.flatMap((segment) => segment.points);
  const cameraRoutePoints = planningCameraRoutes.flatMap((route) => route.points);
  const cameraPoints = planningCameraPoints.map((camera) => camera.point);
  const bounds = L.latLngBounds([...planningBoundary, ...routePoints, ...roadSegmentPoints, ...cameraRoutePoints, ...cameraPoints]);
  const map = L.map(mapElement, { zoomControl: true, scrollWheelZoom: true, preferCanvas: true });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 20,
  }).addTo(map);

  map.fitBounds(bounds, { padding: [24, 24] });

  // Marker กล้องจะอ่านตำแหน่งจาก planningCameraPoints ด้านบนเสมอ
  // ดังนั้นถ้าขยับ point ใน array แล้ว refresh หน้า map จุดแดงจะย้ายตามทันที
  drawRoadSegmentGuides(map);
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

    const segments = cameraSegments(vehicle.cameraIds);
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
  const selectedStop = cameraStop(record.camera_id);
  const expandButton = document.querySelector("[data-expand-traffic-map]");
  const modal = document.querySelector("[data-traffic-map-modal]");
  const expandedMapElement = document.querySelector("#trafficDetailMapExpanded");
  const runtime = {
    cleanup: null,
    expanded: null,
    inline: createTrafficRouteMap(mapElement, route, selectedStop, record),
  };

  trafficDetailMapRuntime = runtime;

  function closeExpandedMap() {
    modal.hidden = true;
    document.body.classList.remove("has-traffic-map-modal");
    cleanupTrafficRouteMapRuntime(runtime.expanded);
    runtime.expanded = null;
    expandButton?.focus();
  }

  function openExpandedMap() {
    modal.hidden = false;
    document.body.classList.add("has-traffic-map-modal");
    cleanupTrafficRouteMapRuntime(runtime.expanded);
    runtime.expanded = createTrafficRouteMap(expandedMapElement, route, selectedStop, record, {
      padding: [46, 46],
      routeWeight: 8,
      selectedRadius: 8,
    });
    modal.querySelector(".traffic-map-modal-close")?.focus();
  }

  function handleModalClick(event) {
    if (event.target.closest("[data-close-traffic-map]")) closeExpandedMap();
  }

  function handleModalKeydown(event) {
    if (event.key === "Escape" && !modal.hidden) closeExpandedMap();
  }

  expandButton?.addEventListener("click", openExpandedMap);
  modal?.addEventListener("click", handleModalClick);
  document.addEventListener("keydown", handleModalKeydown);

  runtime.cleanup = () => {
    expandButton?.removeEventListener("click", openExpandedMap);
    modal?.removeEventListener("click", handleModalClick);
    document.removeEventListener("keydown", handleModalKeydown);
  };
}
