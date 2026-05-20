const fontAwesomeIcons = {
  "layout-dashboard": "fa-solid fa-gauge-high",
  route: "fa-solid fa-route",
  "alert-triangle": "fa-solid fa-triangle-exclamation",
  camera: "fa-solid fa-video",
  "file-bar-chart": "fa-solid fa-chart-column",
  car: "fa-solid fa-car-side",
  category: "fa-solid fa-table-cells-large",
  "chart-line": "fa-solid fa-chart-line",
  "chart-dots": "fa-solid fa-chart-pie",
  "stack-2": "fa-solid fa-layer-group",
  flame: "fa-solid fa-fire",
  settings: "fa-solid fa-gear",
  bell: "fa-solid fa-bell",
  chevron: "fa-solid fa-chevron-right",
  export: "fa-solid fa-download",
  filter: "fa-solid fa-filter",
  reset: "fa-solid fa-rotate-left",
  search: "fa-solid fa-magnifying-glass",
  clock: "fa-solid fa-clock",
  road: "fa-solid fa-road",
  speed: "fa-solid fa-gauge-high",
  activity: "fa-solid fa-chart-line",
  arrowUp: "fa-solid fa-arrow-up",
  arrowDown: "fa-solid fa-arrow-down",
  minus: "fa-solid fa-minus",
};

const navItems = [
  { id: "dashboard", th: "แดชบอร์ด", en: "Dashboard", icon: "layout-dashboard" },
  { id: "trafficSearch", th: "ค้นหารถ", en: "Traffic Search", icon: "search" },
  { id: "planning", th: "วางแผนจราจร", en: "Traffic Planning", icon: "route" },
  { id: "accidents", th: "รายงานอุบัติเหตุ", en: "Accident Report", icon: "alert-triangle" },
  { id: "cameras", th: "ภาพจากกล้อง", en: "Camera View", icon: "camera" },
  {
    id: "reports",
    th: "รายงาน",
    en: "Reports",
    icon: "file-bar-chart",
    children: [
      { id: "vehicleStats", th: "สถิติรถ", en: "Vehicle Stats", icon: "car" },
      { id: "vehicleTypes", th: "ประเภทรถ", en: "Vehicle Types", icon: "category" },
      { id: "accidentStats", th: "สถิติอุบัติเหตุ", en: "Accident Stats", icon: "chart-line" },
    ],
  },
  {
    id: "analysis",
    th: "วิเคราะห์", 
    en: "Analysis",
    icon: "chart-dots",
    children: [
      { id: "density", th: "ความหนาแน่น", en: "Density", icon: "stack-2" },
      { id: "heatmaps", th: "ฮีตแมป", en: "Heatmaps", icon: "flame" },
    ],
  },
];

const pageMeta = {
  dashboard: { th: "แดชบอร์ด", en: "Dashboard" },
  trafficSearch: { th: "ค้นหารถ", en: "Traffic Search" },
  planning: { th: "วางแผนจราจร", en: "Traffic Planning" },
  accidents: { th: "รายงานอุบัติเหตุล่าสุด", en: "Accident Report" },
  cameras: { th: "ภาพจากกล้อง", en: "Camera View" },
  vehicleStats: { th: "สถิติยานพาหนะ", en: "Vehicle Statistics" },
  vehicleTypes: { th: "สัดส่วนประเภทยานพาหนะ", en: "Vehicle Types" },
  accidentStats: { th: "สถิติอุบัติเหตุ", en: "Accident Statistics" },
  density: { th: "วิเคราะห์ความหนาแน่น", en: "Density Analysis" },
  heatmaps: { th: "ฮีตแมปจราจร", en: "Traffic Heatmaps" },
};

let activePage = "dashboard";
const expandedGroups = new Set();

const sidebarNav = document.querySelector("#sidebarNav");
const pageTitle = document.querySelector("#pageTitle");
const pageEyebrow = document.querySelector("#pageEyebrow");
const pageContent = document.querySelector("#pageContent");

function icon(name) {
  const iconClass = fontAwesomeIcons[name] ?? fontAwesomeIcons.category;
  return `<i class="${iconClass}" aria-hidden="true"></i>`;
}

function iconSpan(name, className = "button-icon") {
  return `<span class="${className}">${icon(name)}</span>`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getParentId(pageId) {
  return navItems.find((item) => item.children?.some((child) => child.id === pageId))?.id;
}

function navButton(item, isChild = false) {
  const isActive = activePage === item.id;
  return `
    <button class="nav-item ${isActive ? "is-active" : ""}" type="button" data-page="${item.id}" aria-current="${isActive ? "page" : "false"}">
      <span class="nav-icon">${icon(item.icon)}</span>
      <span class="nav-copy"><span>${item.th}</span><small>${item.en}</small></span>
    </button>
  `;
}

function renderNav() {
  sidebarNav.innerHTML = `
    <div class="nav-section">
      ${navItems
        .map((item) => {
          const parentActive = item.children?.some((child) => child.id === activePage);
          if (!item.children) return navButton(item);
          const expanded = expandedGroups.has(item.id);
          return `
            <div class="nav-group ${expanded ? "is-expanded" : ""}">
              <button class="nav-item ${parentActive ? "is-active" : ""}" type="button" data-group="${item.id}" aria-expanded="${expanded}">
                <span class="nav-icon">${icon(item.icon)}</span>
                <span class="nav-copy"><span>${item.th}</span><small>${item.en}</small></span>
                <span class="chevron">${icon("chevron")}</span>
              </button>
              <div class="submenu">
                ${item.children.map((child) => navButton(child, true)).join("")}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function setActivePage(pageId) {
  activePage = pageId;
  const parentId = getParentId(pageId);
  if (parentId) expandedGroups.add(parentId);
  renderNav();
  renderPage();
}

sidebarNav.addEventListener("click", (event) => {
  const groupButton = event.target.closest("[data-group]");
  const pageButton = event.target.closest("[data-page]");

  if (groupButton) {
    const groupId = groupButton.dataset.group;
    if (expandedGroups.has(groupId)) {
      expandedGroups.delete(groupId);
    } else {
      expandedGroups.add(groupId);
    }
    renderNav();
    return;
  }

  if (pageButton) {
    setActivePage(pageButton.dataset.page);
  }
});

function statCard({ value, th, en, iconName, color }) {
  return `
    <article class="card stat-card" style="--accent-color:${color}">
      <span class="card-icon">${icon(iconName)}</span>
      <span class="stat-value">${value}</span>
      <span class="stat-label"><strong>${th}</strong><span>${en}</span></span>
    </article>
  `;
}

function metricCard({ value, th, en, iconName, color }) {
  return `
    <article class="metric-card" style="--accent-color:${color}">
      <span class="card-icon">${icon(iconName)}</span>
      <span class="metric-value">${value}</span>
      <span class="metric-label"><strong>${th}</strong><span>${en}</span></span>
    </article>
  `;
}

function lineChart(data, labels, color = "#3B6D11") {
  const width = 720;
  const height = 280;
  const pad = { left: 48, right: 22, top: 24, bottom: 42 };
  const max = Math.max(...data) * 1.12;
  const min = Math.min(0, Math.min(...data) * 0.92);
  const xStep = (width - pad.left - pad.right) / (data.length - 1);
  const yScale = (value) => height - pad.bottom - ((value - min) / (max - min)) * (height - pad.top - pad.bottom);
  const points = data.map((value, index) => `${pad.left + index * xStep},${yScale(value)}`).join(" ");
  const area = `${pad.left},${height - pad.bottom} ${points} ${width - pad.right},${height - pad.bottom}`;
  const grid = [0.25, 0.5, 0.75, 1]
    .map((ratio) => {
      const y = pad.top + (height - pad.top - pad.bottom) * ratio;
      return `<line class="grid-line" x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}"></line>`;
    })
    .join("");
  const labelNodes = labels
    .map((label, index) => {
      if (index % 2 !== 0 && index !== labels.length - 1) return "";
      return `<text class="axis-label" x="${pad.left + index * xStep}" y="${height - 14}" text-anchor="middle">${label}</text>`;
    })
    .join("");
  const dots = data
    .map((value, index) => `<circle class="chart-dot" cx="${pad.left + index * xStep}" cy="${yScale(value)}" r="4"></circle>`)
    .join("");

  return `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Line chart">
      ${grid}
      <line class="axis" x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}"></line>
      <polygon class="chart-area" points="${area}" fill="${color}"></polygon>
      <polyline class="chart-line" points="${points}" style="stroke:${color}"></polyline>
      ${dots.replaceAll('class="chart-dot"', `class="chart-dot" style="stroke:${color}"`)}
      ${labelNodes}
    </svg>
  `;
}

function multiLineChart(series, labels) {
  const width = 720;
  const height = 300;
  const pad = { left: 48, right: 24, top: 24, bottom: 42 };
  const allValues = series.flatMap((item) => item.values);
  const max = Math.max(...allValues) * 1.16;
  const xStep = (width - pad.left - pad.right) / (labels.length - 1);
  const yScale = (value) => height - pad.bottom - (value / max) * (height - pad.top - pad.bottom);
  const grid = [0.25, 0.5, 0.75, 1]
    .map((ratio) => `<line class="grid-line" x1="${pad.left}" y1="${pad.top + (height - pad.top - pad.bottom) * ratio}" x2="${width - pad.right}" y2="${pad.top + (height - pad.top - pad.bottom) * ratio}"></line>`)
    .join("");
  const lines = series
    .map((item) => {
      const points = item.values.map((value, index) => `${pad.left + index * xStep},${yScale(value)}`).join(" ");
      const area = `${pad.left},${height - pad.bottom} ${points} ${width - pad.right},${height - pad.bottom}`;
      return `<polygon class="chart-area" points="${area}" fill="${item.color}"></polygon><polyline class="chart-line" points="${points}" style="stroke:${item.color}"></polyline>`;
    })
    .join("");
  const labelNodes = labels
    .map((label, index) => {
      if (index % 3 !== 0 && index !== labels.length - 1) return "";
      return `<text class="axis-label" x="${pad.left + index * xStep}" y="${height - 14}" text-anchor="middle">${label}</text>`;
    })
    .join("");
  const legend = series
    .map((item, index) => `<text class="axis-label" x="${pad.left + index * 150}" y="16"><tspan fill="${item.color}">●</tspan> ${item.name}</text>`)
    .join("");

  return `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Area chart">
      ${grid}
      <line class="axis" x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}"></line>
      ${legend}
      ${lines}
      ${labelNodes}
    </svg>
  `;
}

function barChart(items, color = "#3B6D11") {
  const width = 720;
  const height = 300;
  const pad = { left: 54, right: 24, top: 26, bottom: 56 };
  const max = Math.max(...items.map((item) => item.value)) * 1.18;
  const slot = (width - pad.left - pad.right) / items.length;
  const barWidth = Math.min(48, slot * 0.52);
  const bars = items
    .map((item, index) => {
      const barHeight = (item.value / max) * (height - pad.top - pad.bottom);
      const x = pad.left + index * slot + (slot - barWidth) / 2;
      const y = height - pad.bottom - barHeight;
      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="5" fill="${item.color ?? color}"></rect>
        <text class="bar-label" x="${x + barWidth / 2}" y="${height - 28}" text-anchor="middle">${item.label}</text>
        <text class="axis-label" x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle">${formatNumber(item.value)}</text>
      `;
    })
    .join("");
  return `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart">
      <line class="axis" x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}"></line>
      ${bars}
    </svg>
  `;
}

function groupedBarChart(roads, days) {
  const width = 760;
  const height = 320;
  const pad = { left: 48, right: 24, top: 28, bottom: 64 };
  const colors = ["#3B6D11", "#5E8C2B", "#8BAE4C", "#BA7517", "#185FA5", "#6B7280", "#A32D2D"];
  const max = Math.max(...roads.flatMap((road) => road.values)) * 1.16;
  const groupWidth = (width - pad.left - pad.right) / roads.length;
  const barWidth = Math.max(7, Math.min(12, groupWidth / 10));
  const groups = roads
    .map((road, groupIndex) => {
      const start = pad.left + groupIndex * groupWidth + groupWidth * 0.14;
      const bars = road.values
        .map((value, index) => {
          const barHeight = (value / max) * (height - pad.top - pad.bottom);
          const x = start + index * (barWidth + 3);
          const y = height - pad.bottom - barHeight;
          return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="3" fill="${colors[index]}"></rect>`;
        })
        .join("");
      return `${bars}<text class="bar-label" x="${pad.left + groupIndex * groupWidth + groupWidth / 2}" y="${height - 30}" text-anchor="middle">${road.name}</text>`;
    })
    .join("");
  const legend = days
    .map((day, index) => `<text class="axis-label" x="${pad.left + index * 86}" y="16"><tspan fill="${colors[index]}">●</tspan> ${day}</text>`)
    .join("");
  return `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Grouped bar chart">
      ${legend}
      <line class="axis" x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}"></line>
      ${groups}
    </svg>
  `;
}

function horizontalBarChart(items) {
  const width = 720;
  const height = 290;
  const pad = { left: 148, right: 34, top: 24, bottom: 24 };
  const max = Math.max(...items.map((item) => item.value));
  const rowHeight = (height - pad.top - pad.bottom) / items.length;
  const rows = items
    .map((item, index) => {
      const y = pad.top + index * rowHeight + 8;
      const barWidth = (item.value / max) * (width - pad.left - pad.right);
      return `
        <text class="bar-label" x="${pad.left - 12}" y="${y + 15}" text-anchor="end">${item.label}</text>
        <rect x="${pad.left}" y="${y}" width="${barWidth}" height="20" rx="5" fill="${item.color ?? "#3B6D11"}"></rect>
        <text class="axis-label" x="${pad.left + barWidth + 8}" y="${y + 15}">${item.value}</text>
      `;
    })
    .join("");
  return `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Horizontal bar chart">${rows}</svg>`;
}

function donutChart(segments, center = "100%") {
  let current = 0;
  const stops = segments
    .map((segment) => {
      const start = current;
      current += segment.value;
      return `${segment.color} ${start}% ${current}%`;
    })
    .join(", ");
  return `
    <div class="donut-wrap">
      <div class="donut" style="--donut-stops:${stops}" data-center="${center}" role="img" aria-label="Donut chart"></div>
      <ul class="legend">
        ${segments
          .map(
            (segment) => `
              <li>
                <span class="legend-label"><span class="swatch" style="--swatch:${segment.color}"></span>${segment.th}<small>${segment.en}</small></span>
                <strong>${segment.value}%</strong>
              </li>
            `,
          )
          .join("")}
      </ul>
    </div>
  `;
}

const vehicleTypeSegments = [
  { th: "รถยนต์", en: "Car", value: 58, color: "#3B6D11" },
  { th: "รถบรรทุก", en: "Truck", value: 22, color: "#BA7517" },
  { th: "จักรยานยนต์", en: "Motorcycle", value: 14, color: "#185FA5" },
  { th: "รถโดยสาร", en: "Bus", value: 6, color: "#A32D2D" },
];

const incidents = [
  { time: "08:20", location: "Rama IV - Gate A", type: "Rear-end", severity: "medium", status: "Investigating" },
  { time: "09:05", location: "Sathorn North", type: "Blocked lane", severity: "high", status: "Open" },
  { time: "11:40", location: "Asoke Junction", type: "Minor crash", severity: "low", status: "Resolved" },
  { time: "14:15", location: "Ratchada Tunnel", type: "Stalled truck", severity: "medium", status: "Open" },
  { time: "17:35", location: "Phahon Yothin", type: "Side collision", severity: "high", status: "Investigating" },
];

const accidentCards = [
  { id: "INC-2401", severity: "high", location: "Sathorn North", time: "08:45", type: "Multi-vehicle collision", vehicles: "4", status: "open" },
  { id: "INC-2402", severity: "medium", location: "Rama IV - Gate A", time: "09:20", type: "Rear-end", vehicles: "2", status: "investigating" },
  { id: "INC-2403", severity: "low", location: "Asoke Junction", time: "10:05", type: "Minor crash", vehicles: "2", status: "resolved" },
  { id: "INC-2404", severity: "high", location: "Ratchada Tunnel", time: "12:30", type: "Blocked lane", vehicles: "3", status: "open" },
  { id: "INC-2405", severity: "medium", location: "Bangna Inbound", time: "15:10", type: "Side collision", vehicles: "2", status: "investigating" },
  { id: "INC-2406", severity: "low", location: "Vibhavadi Main", time: "18:05", type: "Stalled vehicle", vehicles: "1", status: "resolved" },
];

const cameraFeeds = [
  { id: "CAM-01", name: "Gate A North", location: "Rama IV - Entrance", zone: "Central", live: true },
  { id: "CAM-02", name: "Sathorn Ramp", location: "Sathorn North", zone: "Central", live: true },
  { id: "CAM-03", name: "Asoke Junction", location: "Asoke - Sukhumvit", zone: "East", live: true },
  { id: "CAM-04", name: "Ratchada Tunnel", location: "Ratchadaphisek", zone: "North", live: false },
  { id: "CAM-05", name: "Bangna Inbound", location: "Bangna-Trad", zone: "East", live: true },
  { id: "CAM-06", name: "Vibhavadi Main", location: "Vibhavadi Road", zone: "North", live: true },
  { id: "CAM-07", name: "Rama IX Exit", location: "Rama IX", zone: "Central", live: true },
  { id: "CAM-08", name: "Phahon Yothin", location: "Phahon Yothin", zone: "North", live: false },
];

const trafficRecords = [
  { time: "06:12:14", location: "Rama IV - Gate A", camera: "CAM-01", plate: "1กข-4821", model: "Toyota Yaris", type: "รถยนต์", color: "ขาว", speed: 42, direction: "Inbound" },
  { time: "06:45:39", location: "Sathorn Ramp", camera: "CAM-02", plate: "8กท-1407", model: "Honda City", type: "รถยนต์", color: "ดำ", speed: 36, direction: "Outbound" },
  { time: "07:08:22", location: "Asoke Junction", camera: "CAM-03", plate: "2ขว-7815", model: "Yamaha NMAX", type: "จักรยานยนต์", color: "น้ำเงิน", speed: 48, direction: "Inbound" },
  { time: "07:31:05", location: "Bangna Inbound", camera: "CAM-05", plate: "70-9182", model: "Isuzu N-Series", type: "รถบรรทุก", color: "ขาว", speed: 31, direction: "Inbound" },
  { time: "08:16:47", location: "Rama IV - Gate A", camera: "CAM-01", plate: "3กน-2260", model: "Toyota Fortuner", type: "รถยนต์", color: "เทา", speed: 29, direction: "Inbound" },
  { time: "08:52:18", location: "Ratchada Tunnel", camera: "CAM-04", plate: "10-5524", model: "Hino 500", type: "รถบรรทุก", color: "แดง", speed: 24, direction: "Outbound" },
  { time: "09:24:31", location: "Phahon Yothin", camera: "CAM-08", plate: "5ขล-9031", model: "Honda Civic", type: "รถยนต์", color: "ดำ", speed: 44, direction: "Inbound" },
  { time: "10:03:56", location: "Vibhavadi Main", camera: "CAM-06", plate: "กท-7781", model: "Mercedes-Benz C-Class", type: "รถยนต์", color: "เงิน", speed: 52, direction: "Outbound" },
  { time: "11:18:09", location: "Asoke Junction", camera: "CAM-03", plate: "4กม-6508", model: "Toyota Hiace", type: "รถโดยสาร", color: "ขาว", speed: 38, direction: "Inbound" },
  { time: "12:41:22", location: "Rama IX Exit", camera: "CAM-07", plate: "6ขจ-3145", model: "Mazda 2", type: "รถยนต์", color: "แดง", speed: 46, direction: "Outbound" },
  { time: "13:07:15", location: "Sathorn Ramp", camera: "CAM-02", plate: "1ขบ-7189", model: "Honda Wave", type: "จักรยานยนต์", color: "ดำ", speed: 41, direction: "Inbound" },
  { time: "14:35:42", location: "Bangna Inbound", camera: "CAM-05", plate: "72-4061", model: "Isuzu D-Max", type: "รถบรรทุก", color: "เทา", speed: 34, direction: "Inbound" },
  { time: "15:22:08", location: "Ratchada Tunnel", camera: "CAM-04", plate: "7กพ-5092", model: "Nissan Almera", type: "รถยนต์", color: "ขาว", speed: 33, direction: "Outbound" },
  { time: "16:04:27", location: "Rama IV - Gate A", camera: "CAM-01", plate: "3ขธ-8820", model: "Toyota Corolla Cross", type: "รถยนต์", color: "เทา", speed: 28, direction: "Inbound" },
  { time: "16:49:11", location: "Asoke Junction", camera: "CAM-03", plate: "11-7804", model: "Mitsubishi Fuso", type: "รถบรรทุก", color: "น้ำเงิน", speed: 22, direction: "Outbound" },
  { time: "17:12:50", location: "Sathorn Ramp", camera: "CAM-02", plate: "2กต-4426", model: "Honda City", type: "รถยนต์", color: "ขาว", speed: 27, direction: "Inbound" },
  { time: "18:36:33", location: "Phahon Yothin", camera: "CAM-08", plate: "9กศ-1358", model: "Kawasaki Ninja", type: "จักรยานยนต์", color: "เขียว", speed: 54, direction: "Outbound" },
  { time: "19:20:06", location: "Vibhavadi Main", camera: "CAM-06", plate: "30-2256", model: "Toyota Commuter", type: "รถโดยสาร", color: "ขาว", speed: 35, direction: "Inbound" },
  { time: "20:08:44", location: "Rama IX Exit", camera: "CAM-07", plate: "8ขม-7710", model: "Tesla Model 3", type: "รถยนต์", color: "ดำ", speed: 49, direction: "Outbound" },
  { time: "21:46:19", location: "Bangna Inbound", camera: "CAM-05", plate: "4กฮ-6127", model: "Ford Ranger", type: "รถยนต์", color: "น้ำเงิน", speed: 45, direction: "Inbound" },
];

function severityLabel(severity) {
  const labels = {
    low: "ต่ำ Low",
    medium: "กลาง Medium",
    high: "สูง High",
  };
  return labels[severity] ?? severity;
}

function statusLabel(status) {
  const labels = {
    open: "เปิด Open",
    resolved: "เสร็จสิ้น Resolved",
    investigating: "ตรวจสอบ Investigating",
  };
  return labels[status] ?? status;
}

function uniqueTrafficValues(key) {
  return [...new Set(trafficRecords.map((record) => record[key]))].sort((a, b) => a.localeCompare(b, "th"));
}

function trafficFilterOptions(key) {
  return uniqueTrafficValues(key)
    .map((value) => `<option value="${value}">${value}</option>`)
    .join("");
}

function trafficCameraOptions() {
  const cameras = [...new Map(trafficRecords.map((record) => [record.camera, `${record.camera} - ${record.location}`])).entries()];
  return cameras
    .sort(([cameraA], [cameraB]) => cameraA.localeCompare(cameraB))
    .map(([camera, label]) => `<option value="${camera}">${label}</option>`)
    .join("");
}

function vehicleTypeBadgeClass(type) {
  const classes = {
    รถยนต์: "info",
    รถบรรทุก: "warning",
    จักรยานยนต์: "up",
    รถโดยสาร: "medium",
  };
  return classes[type] ?? "info";
}

function vehicleColorClass(color) {
  const classes = {
    ขาว: "color-white",
    ดำ: "color-black",
    น้ำเงิน: "color-blue",
    เทา: "color-gray",
    แดง: "color-red",
    เงิน: "color-silver",
    เขียว: "color-green",
  };
  return classes[color] ?? "color-gray";
}

function renderColorDropdownOptions() {
  return uniqueTrafficValues("color")
    .map(
      (color) => `
        <button class="color-option" type="button" role="option" data-color-value="${color}">
          <span class="vehicle-color-dot ${vehicleColorClass(color)}"></span>
          <span>${color}</span>
        </button>
      `,
    )
    .join("");
}

function renderTrafficRows(records) {
  if (!records.length) {
    return `
      <tr class="empty-row">
        <td colspan="9">ไม่พบรายการ Traffic ที่ตรงกับตัวกรอง No matching traffic records</td>
      </tr>
    `;
  }

  return records
    .map(
      (record) => `
        <tr>
          <td><strong>${record.time}</strong></td>
          <td>${record.location}</td>
          <td>${record.camera}</td>
          <td>${record.plate}</td>
          <td>${record.model}</td>
          <td><span class="badge ${vehicleTypeBadgeClass(record.type)}">${record.type}</span></td>
          <td><span class="color-chip"><span class="vehicle-color-dot ${vehicleColorClass(record.color)}"></span>${record.color}</span></td>
          <td>${record.direction}</td>
          <td>${record.speed} km/h</td>
        </tr>
      `,
    )
    .join("");
}

function renderDashboard() {
  const hours = ["6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM"];
  const flow = [420, 680, 1040, 1180, 960, 850, 910, 1020, 980, 1120, 1350, 1680, 1850, 1420, 1180, 910, 620];
  return `
    <div class="page-stack">
      <section class="stat-grid" aria-label="ตัวชี้วัดหลัก Key metrics">
        ${statCard({ value: "14,823", th: "ยานพาหนะวันนี้", en: "Total vehicles today", iconName: "car", color: "#3B6D11" })}
        ${statCard({ value: "3", th: "เหตุการณ์ที่ยังเปิดอยู่", en: "Active incidents", iconName: "alert-triangle", color: "#A32D2D" })}
        ${statCard({ value: "48 / 52", th: "กล้องที่ใช้งาน", en: "Active cameras", iconName: "camera", color: "#185FA5" })}
        ${statCard({ value: "42 km/h", th: "ความเร็วเฉลี่ย", en: "Avg speed", iconName: "speed", color: "#BA7517" })}
      </section>

      <section class="dashboard-grid">
        <article class="panel">
          <div class="panel-header">
            <div class="panel-title">
              <h2>ปริมาณรถวันนี้</h2>
              <p>Vehicle Flow Today</p>
            </div>
          </div>
          ${lineChart(flow, hours)}
        </article>

        <article class="panel">
          <div class="panel-header">
            <div class="panel-title">
              <h2>ประเภทยานพาหนะ</h2>
              <p>Vehicle Types</p>
            </div>
          </div>
          ${donutChart(vehicleTypeSegments, "14,823")}
        </article>
      </section>

      <section class="table-wrap">
        <div class="table-header">
          <div class="panel-title">
            <h2>เหตุการณ์ล่าสุด</h2>
            <p>Recent Incidents</p>
          </div>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr><th>เวลา Time</th><th>พื้นที่ Location</th><th>ประเภท Type</th><th>ระดับ Severity</th><th>สถานะ Status</th></tr>
            </thead>
            <tbody>
              ${incidents
                .map(
                  (item) => `
                    <tr>
                      <td>${item.time}</td>
                      <td>${item.location}</td>
                      <td>${item.type}</td>
                      <td><span class="badge ${item.severity}">${severityLabel(item.severity)}</span></td>
                      <td>${item.status}</td>
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

function renderTrafficSearch() {
  return `
    <div class="page-stack">
      <form class="filter-bar traffic-search-filters" id="trafficSearchForm" aria-label="ตัวกรองค้นหารถ Vehicle search filters">
        <div class="field">
          <label for="trafficStartTime">เวลาเริ่ม Start time</label>
          <input class="input" id="trafficStartTime" name="startTime" type="time" step="1" value="00:00:00" />
        </div>
        <div class="field">
          <label for="trafficEndTime">เวลาสิ้นสุด End time</label>
          <input class="input" id="trafficEndTime" name="endTime" type="time" step="1" value="23:59:59" />
        </div>
        <div class="field">
          <label for="trafficModel">รุ่นรถ Vehicle model</label>
          <select class="select" id="trafficModel" name="model">
            <option value="">ทุกรุ่น All models</option>
            ${trafficFilterOptions("model")}
          </select>
        </div>
        <div class="field">
          <label for="trafficType">ประเภทรถ Vehicle type</label>
          <select class="select" id="trafficType" name="type">
            <option value="">ทุกประเภท All types</option>
            ${trafficFilterOptions("type")}
          </select>
        </div>
        <div class="field">
          <label for="trafficCamera">กล้อง Camera</label>
          <select class="select" id="trafficCamera" name="camera">
            <option value="">ทุกกล้อง All cameras</option>
            ${trafficCameraOptions()}
          </select>
        </div>
        <div class="field">
          <label id="trafficColorLabel" for="trafficColorButton">สีรถ Vehicle color</label>
          <input id="trafficColor" name="color" type="hidden" value="" />
          <div class="color-select" data-color-select>
            <button class="select color-select-button" id="trafficColorButton" type="button" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="trafficColorLabel trafficColorText">
              <span class="color-chip" id="trafficColorText"><span class="vehicle-color-dot color-any"></span>ทุกสี All colors</span>
              <span class="select-chevron" aria-hidden="true">${icon("chevron")}</span>
            </button>
            <div class="color-options" role="listbox" aria-labelledby="trafficColorLabel">
              <button class="color-option is-selected" type="button" role="option" aria-selected="true" data-color-value="">
                <span class="vehicle-color-dot color-any"></span>
                <span>ทุกสี All colors</span>
              </button>
              ${renderColorDropdownOptions()}
            </div>
          </div>
        </div>
        <div class="field">
          <label for="trafficPlate">ทะเบียนรถ License plate</label>
          <input class="input" id="trafficPlate" name="plate" type="search" placeholder="เช่น 1กข-4821" autocomplete="off" />
        </div>
        <div class="field filter-actions">
          <label>&nbsp;</label>
          <div class="button-row">
            <button class="button primary" id="applyTrafficFilters" type="submit">${iconSpan("filter")}ค้นหา Search</button>
            <button class="button secondary" id="resetTrafficFilters" type="button">${iconSpan("reset")}ล้าง Clear</button>
          </div>
        </div>
      </form>

      <section class="traffic-summary-grid" aria-live="polite">
        <article class="metric-card search-result-card" style="--accent-color:#3B6D11">
          <span class="card-icon">${icon("search")}</span>
          <span class="metric-value" id="trafficResultCount">${trafficRecords.length}</span>
          <span class="metric-label"><strong>จำนวนที่พบ</strong><span>Matching traffic records</span></span>
        </article>
        <article class="metric-card search-result-card" style="--accent-color:#185FA5">
          <span class="card-icon">${icon("clock")}</span>
          <span class="metric-value compact-value" id="trafficTimeWindow">00:00:00 - 23:59:59</span>
          <span class="metric-label"><strong>ช่วงเวลาที่ค้นหา</strong><span>Selected time window</span></span>
        </article>
        <article class="metric-card search-result-card" style="--accent-color:#BA7517">
          <span class="card-icon">${icon("filter")}</span>
          <span class="metric-value compact-value" id="trafficFilterState">ทั้งหมด</span>
          <span class="metric-label"><strong>ตัวกรองที่ใช้งาน</strong><span>Active filters</span></span>
        </article>
      </section>

      <section class="table-wrap">
        <div class="table-header">
          <div class="panel-title">
            <h2>รายการ Traffic</h2>
            <p id="trafficTableSummary">${trafficRecords.length} records found</p>
          </div>
        </div>
        <div class="table-scroll">
          <table class="traffic-table">
            <thead>
              <tr>
                <th>เวลา Time</th>
                <th>พื้นที่ Location</th>
                <th>กล้อง Camera</th>
                <th>ทะเบียน Plate</th>
                <th>รุ่น Model</th>
                <th>ประเภท Type</th>
                <th>สี Color</th>
                <th>ทิศทาง Direction</th>
                <th>ความเร็ว Speed</th>
              </tr>
            </thead>
            <tbody id="trafficResultsBody">
              ${renderTrafficRows(trafficRecords)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

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

const planningDensityModes = [
  { id: "low", th: "เบาบาง", en: "Low", vehicles: 10, speed: 42, color: "#3b6d11", duration: 10000 },
  { id: "moderate", th: "ปานกลาง", en: "Moderate", vehicles: 22, speed: 34, color: "#185fa5", duration: 10000 },
  { id: "heavy", th: "หนาแน่น", en: "Heavy", vehicles: 38, speed: 24, color: "#ba7517", duration: 10000 },
  { id: "severe", th: "หนาแน่นมาก", en: "Severe", vehicles: 58, speed: 15, color: "#a32d2d", duration: 10000 },
];

let planningMapRuntime = null;

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
          <div class="traffic-map-hint">แตะรถเพื่อดูเส้นทางย้อนหลัง</div>
          <div class="map-legend traffic-map-legend">
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

function renderAccidents() {
  return `
    <div class="page-stack">
      <section class="filter-bar" aria-label="ตัวกรอง Filter bar">
        <div class="field"><label>วันเริ่ม Start date</label><input class="input" type="date" value="2026-05-20" /></div>
        <div class="field"><label>วันสิ้นสุด End date</label><input class="input" type="date" value="2026-05-20" /></div>
        <div class="field"><label>ถนน Road</label><select class="select"><option>All roads</option><option>Sathorn North</option><option>Rama IV</option></select></div>
        <div class="field"><label>ระดับ Severity</label><select class="select"><option>All severity</option><option>High</option><option>Medium</option><option>Low</option></select></div>
        <div class="field"><label>ค้นหา Search</label><input class="input" type="search" placeholder="INC-2401" /></div>
        <div class="field"><label>&nbsp;</label><button class="button secondary" type="button">${iconSpan("export")}ส่งออก Export</button></div>
      </section>
      <section class="accident-grid">
        ${accidentCards
          .map(
            (item) => `
              <article class="accident-card">
                <header>
                  <span class="badge ${item.severity}">${severityLabel(item.severity)}</span>
                  <span class="incident-id">${item.id}</span>
                </header>
                <dl>
                  <div><dt>พื้นที่ Location</dt><dd>${item.location}</dd></div>
                  <div><dt>เวลา Time</dt><dd>${item.time}</dd></div>
                  <div><dt>ประเภท Type</dt><dd>${item.type}</dd></div>
                  <div><dt>จำนวนรถ Vehicles involved</dt><dd>${item.vehicles}</dd></div>
                </dl>
                <footer>
                  <span class="badge ${item.status}">${statusLabel(item.status)}</span>
                  <a class="text-link" href="#">ดูรายละเอียด View Details</a>
                </footer>
              </article>
            `,
          )
          .join("")}
      </section>
    </div>
  `;
}

function renderCameras() {
  return `
    <div class="page-stack">
      <section class="filter-bar camera-filter" aria-label="ตัวกรองกล้อง Camera filter">
        <div class="field"><label>โซนกล้อง Camera zone</label><select class="select"><option>All zones</option><option>Central</option><option>North</option><option>East</option></select></div>
        <div class="field"><label>ค้นหา Search</label><input class="input" type="search" placeholder="CAM-01, Gate A" /></div>
      </section>
      <section class="camera-grid">
        ${cameraFeeds
          .map(
            (camera) => `
              <article class="camera-tile" tabindex="0" style="--status:${camera.live ? "#45B15B" : "#D14B4B"}">
                <span class="camera-status" aria-label="${camera.live ? "Live" : "Offline"}"></span>
                <span class="camera-name">${camera.name}</span>
                <div class="camera-overlay">
                  <strong>${camera.id}</strong>
                  <span>${camera.location}</span>
                  <span>${camera.live ? "สด Live" : "ออฟไลน์ Offline"}</span>
                </div>
              </article>
            `,
          )
          .join("")}
      </section>
    </div>
  `;
}

function renderVehicleStats() {
  const roads = [
    { name: "Rama IV", values: [1080, 1220, 1380, 1520, 1490, 1620, 1740] },
    { name: "Sathorn", values: [860, 920, 1010, 1150, 1190, 1280, 1390] },
    { name: "Asoke", values: [740, 810, 850, 980, 1020, 1110, 1240] },
    { name: "Ratchada", values: [680, 720, 760, 840, 910, 960, 1040] },
    { name: "Bangna", values: [580, 650, 710, 790, 840, 900, 980] },
  ];
  const table = [
    ["Rama IV", "Inbound", "3,280", "3,010", "up", "+9%"],
    ["Sathorn", "Outbound", "2,940", "3,120", "down", "-6%"],
    ["Asoke", "Inbound", "2,310", "2,080", "up", "+11%"],
    ["Ratchada", "Outbound", "1,880", "1,910", "flat", "-1%"],
    ["Bangna", "Inbound", "1,540", "1,420", "up", "+8%"],
  ];
  return `
    <div class="page-stack">
      <section class="report-header">
        <div>
          <h2>สถิติยานพาหนะ</h2>
          <p>Vehicle Statistics</p>
        </div>
        <button class="button secondary" type="button">${iconSpan("export")}ส่งออก Export</button>
      </section>
      <section class="metric-grid">
        ${metricCard({ value: "14,823", th: "รวมวันนี้", en: "Total Today", iconName: "car", color: "#3B6D11" })}
        ${metricCard({ value: "13,420", th: "เฉลี่ยรายสัปดาห์", en: "Weekly Average", iconName: "activity", color: "#185FA5" })}
        ${metricCard({ value: "5PM", th: "ชั่วโมงเร่งด่วน", en: "Peak Hour", iconName: "clock", color: "#BA7517" })}
      </section>
      <article class="panel">
        <div class="panel-header"><div class="panel-title"><h2>จำนวนรถรายวันตามถนน</h2><p>Daily Vehicle Count by Road</p></div></div>
        ${groupedBarChart(roads, ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])}
      </article>
      <section class="table-wrap">
        <div class="table-scroll">
          <table>
            <thead><tr><th>ถนน Road name</th><th>ทิศทาง Direction</th><th>วันนี้ Today</th><th>เมื่อวาน Yesterday</th><th>เปลี่ยนแปลง WoW change</th></tr></thead>
            <tbody>
              ${table
                .map(
                  ([road, direction, today, yesterday, trend, value]) => `
                    <tr>
                      <td>${road}</td><td>${direction}</td><td>${today}</td><td>${yesterday}</td>
                      <td><span class="trend ${trend}">${icon(trend === "up" ? "arrowUp" : trend === "down" ? "arrowDown" : "minus")}${value}</span></td>
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

function renderVehicleTypes() {
  const bars = [
    { label: "Car", value: 58, color: "#3B6D11" },
    { label: "Truck", value: 22, color: "#BA7517" },
    { label: "Moto", value: 14, color: "#185FA5" },
    { label: "Bus", value: 6, color: "#A32D2D" },
  ];
  const table = [
    ["Car", "8,599", "58%", "46 km/h"],
    ["Truck", "3,261", "22%", "35 km/h"],
    ["Motorcycle", "2,075", "14%", "49 km/h"],
    ["Bus", "888", "6%", "38 km/h"],
  ];
  return `
    <div class="page-stack">
      <article class="panel large-donut">
        <div class="panel-header"><div class="panel-title"><h2>สัดส่วนประเภทยานพาหนะ</h2><p>Vehicle Type Breakdown</p></div></div>
        ${donutChart(vehicleTypeSegments, "100%")}
      </article>
      <article class="panel">
        <div class="panel-header"><div class="panel-title"><h2>เปรียบเทียบตามถนน</h2><p>Vehicle Types across Roads</p></div></div>
        ${barChart(bars)}
      </article>
      <section class="table-wrap">
        <div class="table-scroll">
          <table>
            <thead><tr><th>ประเภทรถ Vehicle Type</th><th>จำนวน Count</th><th>%</th><th>ความเร็วเฉลี่ย Avg Speed</th></tr></thead>
            <tbody>${table.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function renderAccidentStats() {
  const daily = [2, 1, 3, 5, 4, 2, 6, 3, 2, 4, 5, 7, 3, 4, 2, 1, 4, 6, 5, 3, 2, 4, 6, 8, 5, 4, 3, 5, 2, 4];
  const labels = Array.from({ length: 30 }, (_, index) => `${index + 1}`);
  return `
    <div class="page-stack">
      <article class="panel">
        <div class="panel-header"><div class="panel-title"><h2>อุบัติเหตุต่อวัน</h2><p>Accidents per day, last 30 days</p></div></div>
        ${lineChart(daily, labels, "#A32D2D")}
      </article>
      <section class="chart-pair">
        <article class="panel">
          <div class="panel-header"><div class="panel-title"><h2>ตามช่วงเวลา</h2><p>Accidents by time of day</p></div></div>
          ${barChart([
            { label: "00-04", value: 8 },
            { label: "04-08", value: 12 },
            { label: "08-12", value: 24 },
            { label: "12-16", value: 18 },
            { label: "16-20", value: 31 },
            { label: "20-24", value: 14 },
          ], "#BA7517")}
        </article>
        <article class="panel">
          <div class="panel-header"><div class="panel-title"><h2>ถนนเสี่ยงสูง</h2><p>Accidents by road</p></div></div>
          ${horizontalBarChart([
            { label: "Sathorn", value: 28, color: "#A32D2D" },
            { label: "Rama IV", value: 24, color: "#BA7517" },
            { label: "Asoke", value: 18, color: "#185FA5" },
            { label: "Ratchada", value: 15, color: "#3B6D11" },
            { label: "Bangna", value: 11, color: "#6B7280" },
          ])}
        </article>
      </section>
    </div>
  `;
}

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

function routeLength(points) {
  return points.slice(1).reduce((total, point, index) => {
    const previous = points[index];
    return total + Math.hypot(point[0] - previous[0], point[1] - previous[1]);
  }, 0);
}

function pointOnRoute(points, progress) {
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  const totalLength = routeLength(points);
  let walked = 0;

  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const segmentLength = Math.hypot(end[0] - start[0], end[1] - start[1]);
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
  const route = planningRoads[Math.floor(Math.random() * planningRoads.length)];
  const reverse = Math.random() > 0.5;
  vehicle.routeName = route.name;
  vehicle.points = reverse ? [...route.points].reverse() : route.points;
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

function findNextRoad(currentName, endPoint) {
  let best = null;
  let bestDist = Infinity;
  let bestReverse = false;
  planningRoads.forEach((road) => {
    if (road.name === currentName) return;
    const s = Math.hypot(road.points[0][0] - endPoint[0], road.points[0][1] - endPoint[1]);
    const e = Math.hypot(road.points[road.points.length - 1][0] - endPoint[0], road.points[road.points.length - 1][1] - endPoint[1]);
    if (s < bestDist) { bestDist = s; best = road; bestReverse = false; }
    if (e < bestDist) { bestDist = e; best = road; bestReverse = true; }
  });
  return best ? { points: bestReverse ? [...best.points].reverse() : best.points, name: best.name } : null;
}

function bindPlanningMapInteractions() {
  const mapElement = document.querySelector("#planningTrafficMap");
  if (!mapElement) return;

  cleanupPlanningMap();

  if (!window.L) {
    mapElement.innerHTML = `<div class="map-fallback">ไม่สามารถโหลด Leaflet ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</div>`;
    return;
  }

  const bounds = L.latLngBounds(planningBoundary);
  const map = L.map(mapElement, { zoomControl: true, scrollWheelZoom: true, preferCanvas: true });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 20,
  }).addTo(map);

  map.fitBounds(bounds, { padding: [24, 24] });

  planningRoads.forEach((road) => L.polyline(road.points, { opacity: 0, weight: 0 }).addTo(map));

  const runtime = {
    animationFrame: null,
    densityIndex: 0,
    densityTimer: null,
    lastFrame: performance.now(),
    map,
    resizeObserver: null,
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
    if (runtime.selectedTrail) { runtime.selectedTrail.remove(); runtime.selectedTrail = null; }
  }

  function selectVehicle(vehicle) {
    if (vehicle.isSelected) { deselectVehicle(); return; }
    deselectVehicle();
    vehicle.isSelected = true;
    runtime.selectedVehicle = vehicle;
    vehicle.marker.setStyle(circleStyle(planningDensityModes[runtime.densityIndex], true));
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
        if (next) { vehicle.routeName = next.name; vehicle.points = next.points; vehicle.progress = 0; vehicle.direction = 1; }
        vehicle.historySegments.push([]);
        if (vehicle.historySegments.length > 20) vehicle.historySegments.shift();
      } else if (vehicle.progress <= 0) {
        vehicle.progress = 0;
        vehicle.direction = 1;
        const next = findNextRoad(vehicle.routeName, vehicle.points[0]);
        if (next) { vehicle.routeName = next.name; vehicle.points = next.points; vehicle.progress = 1; vehicle.direction = -1; }
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

const pageRenderers = {
  dashboard: renderDashboard,
  trafficSearch: renderTrafficSearch,
  planning: renderPlanning,
  accidents: renderAccidents,
  cameras: renderCameras,
  vehicleStats: renderVehicleStats,
  vehicleTypes: renderVehicleTypes,
  accidentStats: renderAccidentStats,
  density: renderDensity,
  heatmaps: renderHeatmaps,
};

function timeToSeconds(value, fallback) {
  if (!value) return fallback;
  const [hours = 0, minutes = 0, seconds = 0] = value.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

function isTimeInRange(recordTime, startTime, endTime) {
  const current = timeToSeconds(recordTime, 0);
  const start = timeToSeconds(startTime, 0);
  const end = timeToSeconds(endTime, 86399);

  if (start <= end) return current >= start && current <= end;
  return current >= start || current <= end;
}

function normalizePlate(value) {
  return value.trim().toLowerCase().replace(/[\s-]/g, "");
}

function bindTrafficSearchInteractions() {
  const form = document.querySelector("#trafficSearchForm");
  if (!form) return;

  const startTime = form.elements.startTime;
  const endTime = form.elements.endTime;
  const model = form.elements.model;
  const type = form.elements.type;
  const camera = form.elements.camera;
  const color = form.elements.color;
  const plate = form.elements.plate;
  const rowsBody = document.querySelector("#trafficResultsBody");
  const countLabel = document.querySelector("#trafficResultCount");
  const timeWindowLabel = document.querySelector("#trafficTimeWindow");
  const filterStateLabel = document.querySelector("#trafficFilterState");
  const tableSummary = document.querySelector("#trafficTableSummary");
  const colorSelect = document.querySelector("[data-color-select]");
  const colorButton = colorSelect?.querySelector(".color-select-button");
  const colorText = document.querySelector("#trafficColorText");
  const colorOptions = [...(colorSelect?.querySelectorAll(".color-option") ?? [])];

  function activeFilterText() {
    const active = [];
    if (model.value) active.push(model.value);
    if (type.value) active.push(type.value);
    if (camera.value) active.push(camera.value);
    if (color.value) active.push(color.value);
    if (plate.value.trim()) active.push("ทะเบียน");
    return active.length ? active.join(", ") : "ทั้งหมด";
  }

  function applyFilters() {
    const plateQuery = normalizePlate(plate.value);
    const filtered = trafficRecords.filter((record) => {
      const matchesTime = isTimeInRange(record.time, startTime.value, endTime.value);
      const matchesModel = !model.value || record.model === model.value;
      const matchesType = !type.value || record.type === type.value;
      const matchesCamera = !camera.value || record.camera === camera.value;
      const matchesColor = !color.value || record.color === color.value;
      const matchesPlate = !plateQuery || normalizePlate(record.plate).includes(plateQuery);
      return matchesTime && matchesModel && matchesType && matchesCamera && matchesColor && matchesPlate;
    });

    rowsBody.innerHTML = renderTrafficRows(filtered);
    countLabel.textContent = formatNumber(filtered.length);
    timeWindowLabel.textContent = `${startTime.value || "00:00:00"} - ${endTime.value || "23:59:59"}`;
    filterStateLabel.textContent = activeFilterText();
    tableSummary.textContent = `${formatNumber(filtered.length)} records found`;
  }

  function closeColorOptions() {
    colorSelect?.classList.remove("is-open");
    colorButton?.setAttribute("aria-expanded", "false");
  }

  function setSelectedColor(value, shouldApply = true) {
    color.value = value;
    const selectedOption = colorOptions.find((option) => option.dataset.colorValue === value) ?? colorOptions[0];
    const selectedText = selectedOption?.querySelector("span:last-child")?.textContent ?? "ทุกสี All colors";
    const dotClass = value ? vehicleColorClass(value) : "color-any";
    colorText.innerHTML = `<span class="vehicle-color-dot ${dotClass}"></span>${selectedText}`;

    colorOptions.forEach((option) => {
      const isSelected = option.dataset.colorValue === value;
      option.classList.toggle("is-selected", isSelected);
      option.setAttribute("aria-selected", String(isSelected));
    });

    closeColorOptions();
    if (shouldApply) applyFilters();
  }

  colorButton?.addEventListener("click", () => {
    const isOpen = colorSelect.classList.toggle("is-open");
    colorButton.setAttribute("aria-expanded", String(isOpen));
  });

  colorButton?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeColorOptions();
      colorButton.focus();
    }
  });

  colorOptions.forEach((option) => {
    option.addEventListener("click", () => {
      setSelectedColor(option.dataset.colorValue);
    });
  });

  document.addEventListener("click", (event) => {
    if (!colorSelect?.contains(event.target)) closeColorOptions();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilters();
  });

  form.querySelectorAll("input, select").forEach((control) => {
    control.addEventListener("input", applyFilters);
    control.addEventListener("change", applyFilters);
  });

  document.querySelector("#resetTrafficFilters").addEventListener("click", () => {
    form.reset();
    setSelectedColor("", false);
    applyFilters();
  });

  setSelectedColor(color.value, false);
  applyFilters();
}

function bindPageInteractions() {
  document.querySelectorAll(".timing-slider").forEach((slider) => {
    const valueLabel = slider.parentElement.querySelector(".range-value");
    const suffix = slider.id === "intensitySlider" ? "" : "s";
    slider.addEventListener("input", () => {
      valueLabel.textContent = `${slider.value}${suffix}`;
    });
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("is-active"));
      tab.classList.add("is-active");
    });
  });

  bindTrafficSearchInteractions();
  bindPlanningMapInteractions();
}

function renderPage() {
  cleanupPlanningMap();
  const meta = pageMeta[activePage];
  pageTitle.textContent = meta.th;
  pageEyebrow.textContent = meta.en;
  document.title = `${meta.en} | TrafficOS`;
  pageContent.innerHTML = pageRenderers[activePage]();
  bindPageInteractions();
}

document.querySelectorAll("[data-icon]").forEach((element) => {
  element.innerHTML = icon(element.dataset.icon);
});

renderNav();
renderPage();
