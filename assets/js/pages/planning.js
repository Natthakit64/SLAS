const planningBoundary = [
  [13.888053, 100.574482],
  [13.885553, 100.573101],
  [13.882373, 100.574206],
  [13.883734, 100.577719],
];

const planningRoads = [
  {
    name: "Chaeng Watthana Road",
    points: [
      [13.88672, 100.57318],
      [13.88638, 100.57392],
      [13.88605, 100.57472],
      [13.88572, 100.5755],
      [13.88542, 100.57638],
      [13.88516, 100.57756],
    ],
  },
  {
    name: "NT Frontage Road",
    points: [
      [13.88794, 100.57446],
      [13.88728, 100.57454],
      [13.88666, 100.57475],
      [13.8861, 100.5751],
      [13.88552, 100.57568],
    ],
  },
  {
    name: "NT Campus Connector",
    points: [
      [13.88608, 100.57432],
      [13.88548, 100.57462],
      [13.88488, 100.57504],
      [13.88426, 100.57562],
      [13.88374, 100.57642],
    ],
  },
  {
    name: "Soi Link East",
    points: [
      [13.88554, 100.57318],
      [13.88508, 100.57394],
      [13.88468, 100.57476],
      [13.88426, 100.57572],
      [13.88384, 100.57754],
    ],
  },
  {
    name: "North Access",
    points: [
      [13.88798, 100.57448],
      [13.88736, 100.57494],
      [13.88674, 100.5755],
      [13.88608, 100.57624],
      [13.88536, 100.5771],
    ],
  },
  {
    name: "South Access Road",
    points: [
      [13.88248, 100.57432],
      [13.88338, 100.57482],
      [13.88405, 100.57534],
      [13.88482, 100.57606],
      [13.88518, 100.57746],
    ],
  },
];

const planningCameraPoints = [
  // ตำแหน่งกล้องบนหน้า Traffic Planning
  // ถ้าต้องการย้ายจุดกล้อง ให้แก้ค่า point ของ CAM นั้น ๆ โดยใช้รูปแบบ [latitude, longitude]
  // ตัวอย่างจาก Google Maps: ถ้าได้ 13.887125, 100.575243 ให้ใส่เป็น point: [13.887125, 100.575243]
  // เพิ่มกล้องใหม่ได้โดยเพิ่ม object ใหม่ใน array นี้ และลบกล้องได้โดยลบ object ของ CAM นั้นออก
  { id: "CAM-01", name: "Camera 01", point: [13.887563, 100.575002] },
  { id: "Gate-3", name: "Gate 3", point: [13.886358, 100.573681] },
  { id: "CAM-03", name: "Camera 03", point: [13.885888, 100.574640] },
  { id: "CAM-04", name: "Camera 04", point: [13.883571, 100.573986] },
  { id: "soi5", name: "soi 05", point: [13.882888, 100.577165] },
  { id: "CAM-07", name: "Camera 07", point: [13.882945, 100.576977] },
  { id: "CAM-08", name: "Camera 08", point: [13.884138, 100.57643] },
  { id: "CAM-09", name: "Camera 09", point: [13.885965,100.576237] },
  { id: "CAM-10", name: "Camera 10", point: [13.886903,100.576351] },
];

function cameraStop(cameraId) {
  const exactMatch = planningCameraPoints.find((camera) => camera.id === cameraId);
  if (exactMatch) return exactMatch;

  const paddedCamId = cameraId.replace(/^CAM-(\d)$/i, "CAM-0$1").toUpperCase();
  return planningCameraPoints.find((camera) => camera.id.toUpperCase() === paddedCamId);
}

function cameraPoint(cameraId) {
  return cameraStop(cameraId)?.point;
}

const planningRoadSegmentDefinitions = [
  // Road segment waypoints are only guide points for bending the route along the road.
  // Move the points inside `waypoints`; the camera endpoints are read from planningCameraPoints.
  // Segment: Camera 01 -> Camera 03
  { from: "CAM-01", to: "CAM-03", waypoints: [[13.887574, 100.575087], [13.887424, 100.575095], [13.886828, 100.574870], [13.88618, 100.57468]] },

  // Segment: Gate 3 -> Camera 03
  { from: "Gate-3", to: "CAM-03", waypoints: [[13.886460, 100.573694], [13.886175, 100.574646]] },

  // Segment: Camera 03 -> Camera 04
  { from: "CAM-03", to: "CAM-04", waypoints: [[13.885680, 100.574554], [13.883908, 100.573994], [13.883713, 100.574065]] },

  // Segment: Camera 04 -> Camera 07
  { from: "CAM-04", to: "CAM-07", waypoints: [[13.883687, 100.574111], [13.883065, 100.576004], [13.882878, 100.576825]] },

  // Segment: Camera 07 -> Soi 5
  { from: "CAM-07", to: "soi5", waypoints: [[13.88291, 100.57707]] },

  // Segment: Camera 08 -> Camera 07
  { from: "CAM-08", to: "CAM-07", waypoints: [[13.883948, 100.576291], [13.883136, 100.576070], [13.882885, 100.576904]] },

  // Segment: Camera 08 -> Camera 04
  { from: "CAM-08", to: "CAM-04", waypoints: [[13.883752, 100.576238],[13.883183, 100.575970],[13.883670, 100.574195]] },

  // Segment: Camera 10 -> Camera 09
  { from: "CAM-10", to: "CAM-09", waypoints: [[13.88664, 100.57631], [13.88628, 100.57626]] },

  // Segment: Camera 09 -> Camera 08
  { from: "CAM-09", to: "CAM-08", waypoints: [[13.885888, 100.576176], [13.885737, 100.576452], [13.885262, 100.576332], [13.885157, 100.576314],[13.885054, 100.576626], [13.884328, 100.576404]] },

  // Segment: Camera 09 -> Camera 03
  { from: "CAM-09", to: "CAM-03", waypoints: [[13.885879, 100.576078],[13.886199, 100.574859]] },
];

function roadSegmentKey(from, to) {
  return `${from}__${to}`;
}

function roadSegmentPoints(from, to, waypoints = []) {
  return [cameraPoint(from), ...waypoints, cameraPoint(to)].filter(Boolean);
}

const planningRoadSegments = planningRoadSegmentDefinitions
  .map((segment) => ({
    ...segment,
    key: roadSegmentKey(segment.from, segment.to),
    points: roadSegmentPoints(segment.from, segment.to, segment.waypoints),
  }))
  .filter((segment) => segment.points.length > 1);

function roadSegmentBetween(from, to) {
  const direct = planningRoadSegments.find((segment) => segment.from === from && segment.to === to);
  if (direct) return direct.points;

  const reverse = planningRoadSegments.find((segment) => segment.from === to && segment.to === from);
  if (reverse) return [...reverse.points].reverse();

  return roadSegmentPoints(from, to);
}

function cameraSegments(cameraIds) {
  return cameraIds.slice(1).map((to, index) => {
    const from = cameraIds[index];
    return {
      from,
      to,
      points: roadSegmentBetween(from, to),
    };
  }).filter((segment) => segment.points.length > 1);
}

function routePointsFromSegments(segments) {
  return segments.flatMap((segment, index) => (index === 0 ? segment.points : segment.points.slice(1)));
}

function cameraRoute(name, cameraIds, id = "") {
  const stops = cameraIds
    .map(cameraStop)
    .filter(Boolean);

  const routeCameraIds = stops.map((stop) => stop.id);
  const routeSegments = cameraSegments(routeCameraIds);
  const routePoints = routePointsFromSegments(routeSegments);

  return {
    id,
    name,
    cameraIds: routeCameraIds,
    points: routePoints,
    segments: routeSegments,
  };
}

const planningCameraRoutes = [
  // รถจำลองจะวิ่งตามลำดับกล้องในชุดนี้ โดยระบบจะแยกเป็น segment ย่อยแบบ 1->2, 2->3, 3->4 ให้อัตโนมัติ
  // ถ้าต้องการปรับเส้นทาง ให้ย้าย/เพิ่ม/ลบ camera id ใน cameraIds ของ route ที่ต้องการ
  // ถ้าย้ายพิกัดใน planningCameraPoints เส้นทางเหล่านี้จะขยับตามตำแหน่งกล้องอัตโนมัติ
  cameraRoute("Camera Route 01-03", ["CAM-01", "CAM-03"], "route-01-03"),
  cameraRoute("Camera Route North-East", ["CAM-10", "CAM-09", "CAM-08"], "route-north-east"),
  cameraRoute("Camera Route West-South", ["Gate-3", "CAM-03", "CAM-04", "CAM-07", "soi5"], "route-west-south"),
  cameraRoute("Camera Route East-Cross", ["CAM-10", "CAM-09", "CAM-03", "CAM-04"], "route-east-cross"),
  cameraRoute("Camera Route Lower Link", ["CAM-08", "CAM-04", "CAM-07", "soi5"], "route-lower-link"),

  // Debug route for plate ALL-SEG: runs through every defined segment so the whole guide line can be checked.
  cameraRoute("Camera Route All Segments", ["CAM-01", "CAM-03", "Gate-3", "CAM-03", "CAM-04", "CAM-08", "CAM-07", "CAM-04", "CAM-07", "soi5", "CAM-07", "CAM-08", "CAM-09", "CAM-10", "CAM-09", "CAM-03"], "all-segments"),
].filter((route) => route.points.length > 1);

function routeForTrafficRecord(record) {
  if (record.routeId) {
    const route = planningCameraRoutes.find((item) => item.id === record.routeId);
    if (route) return route;
  }

  const stop = cameraStop(record.camera_id);
  if (!stop) return planningCameraRoutes[0];
  return planningCameraRoutes.find((route) => route.cameraIds.includes(stop.id)) ?? planningCameraRoutes[0];
}

const planningDensityModes = [
  { id: "low", th: "เบาบาง", en: "Low", vehicles: 10, speed: 42, color: "#3b6d11", duration: 10000 },
  { id: "moderate", th: "ปานกลาง", en: "Moderate", vehicles: 22, speed: 34, color: "#185fa5", duration: 10000 },
  { id: "heavy", th: "หนาแน่น", en: "Heavy", vehicles: 38, speed: 24, color: "#ba7517", duration: 10000 },
  { id: "severe", th: "หนาแน่นมาก", en: "Severe", vehicles: 58, speed: 15, color: "#a32d2d", duration: 10000 },
];

const routeConnectionMaxMeters = 25;

let planningMapRuntime = null;
let trafficDetailMapRuntime = null;
let heatmapMapRuntime = null;

function renderPlanning() {
  return `
    <section class="planning-map-page">
      <article class="panel planning-map-panel">
        <div class="planning-map-header">
          <div class="panel-title">
            <h2>แผนที่จราจร NT แจ้งวัฒนะ</h2>
            <p>Live traffic simulation around 13.888053, 100.574482</p>
          </div>
          <div class="traffic-density-strip" aria-label="สถานะความหนาแน่น Traffic density status">
            <span class="density-pill is-active" data-density-pill="low">เบาบาง</span>
            <span class="density-pill" data-density-pill="moderate">ปานกลาง</span>
            <span class="density-pill" data-density-pill="heavy">หนาแน่น</span>
            <span class="density-pill" data-density-pill="severe">หนาแน่นมาก</span>
          </div>
        </div>

        <div class="traffic-map-stats" aria-live="polite">
          <div class="traffic-stat">
            <span>ระดับความหนาแน่น</span>
            <strong id="planningDensityLabel">เบาบาง</strong>
          </div>
          <div class="traffic-stat">
            <span>รถที่แสดง</span>
            <strong id="planningVehicleCount">10 คัน</strong>
          </div>
          <div class="traffic-stat">
            <span>ความเร็วเฉลี่ย</span>
            <strong id="planningAvgSpeed">42 กม./ชม.</strong>
          </div>
        </div>

        <div class="traffic-map-wrap">
          <div id="planningTrafficMap" class="traffic-live-map" role="img" aria-label="แผนที่จราจรจำลองพื้นที่ NT แจ้งวัฒนะ"></div>
          <div class="traffic-map-hint">แตะรถเพื่อดูเส้นทางกล้องของรถคันนั้น</div>
          <div class="map-legend traffic-map-legend">
            <span class="legend-chip"><span class="status-dot route-guide-dot"></span>Segment guide</span>
            <span class="legend-chip"><span class="status-dot camera-dot"></span>กล้อง Camera</span>
            <span class="legend-chip"><span class="status-dot selected-route-dot"></span>เส้นทางที่เลือก</span>
            <span class="legend-chip"><span class="status-dot" style="--dot:#3b6d11"></span>เบาบาง</span>
            <span class="legend-chip"><span class="status-dot" style="--dot:#185fa5"></span>ปานกลาง</span>
            <span class="legend-chip"><span class="status-dot" style="--dot:#ba7517"></span>หนาแน่น</span>
            <span class="legend-chip"><span class="status-dot" style="--dot:#a32d2d"></span>หนาแน่นมาก</span>
          </div>
        </div>
      </article>
    </section>
  `;
}

