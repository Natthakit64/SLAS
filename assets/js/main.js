const pageRenderers = {
  dashboard: renderDashboard,
  trafficSearch: renderTrafficSearch,
  trafficDetail: renderTrafficDetail,
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

  rowsBody.addEventListener("click", (event) => {
    const detailButton = event.target.closest("[data-traffic-detail]");
    if (!detailButton) return;
    selectedTrafficRecordKey = detailButton.dataset.trafficDetail;
    setActivePage("trafficDetail");
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
  bindTrafficDetailInteractions();
}

function renderPage() {
  cleanupPlanningMap();
  cleanupTrafficDetailMap();
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
