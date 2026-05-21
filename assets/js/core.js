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
  truck: "fa-solid fa-truck-moving",
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
  expand: "fa-solid fa-up-right-and-down-left-from-center",
  close: "fa-solid fa-xmark",
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
      { id: "truckRuns", th: "จำนวนรถบรรทุกวิ่ง", en: "Truck Runs", icon: "truck" },
    ],
  },
];

const pageMeta = {
  dashboard: { th: "แดชบอร์ด", en: "Dashboard" },
  trafficSearch: { th: "ค้นหารถ", en: "Traffic Search" },
  trafficDetail: { th: "รายละเอียด Traffic", en: "Traffic Detail" },
  planning: { th: "วางแผนจราจร", en: "Traffic Planning" },
  accidents: { th: "รายงานอุบัติเหตุล่าสุด", en: "Accident Report" },
  accidentDetail: { th: "รายละเอียดอุบัติเหตุ", en: "Accident Detail" },
  cameras: { th: "ภาพจากกล้อง", en: "Camera View" },
  vehicleStats: { th: "สถิติยานพาหนะ", en: "Vehicle Statistics" },
  vehicleTypes: { th: "สัดส่วนประเภทยานพาหนะ", en: "Vehicle Types" },
  accidentStats: { th: "สถิติอุบัติเหตุ", en: "Accident Statistics" },
  density: { th: "วิเคราะห์ความหนาแน่น", en: "Density Analysis" },
  heatmaps: { th: "ฮีตแมปจราจร", en: "Traffic Heatmaps" },
  truckRuns: { th: "จำนวนรถบรรทุกวิ่ง", en: "Truck Runs" },
};

let activePage = "dashboard";
let selectedTrafficRecordKey = null;
let selectedAccidentId = null;
const expandedGroups = new Set();
const detailParentPages = {
  trafficDetail: "trafficSearch",
  accidentDetail: "accidents",
};

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
  if (detailParentPages[pageId]) return detailParentPages[pageId];
  return navItems.find((item) => item.children?.some((child) => child.id === pageId))?.id;
}

function navButton(item, isChild = false) {
  const isActive = activePage === item.id || detailParentPages[activePage] === item.id;
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

