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
    confirmed: "ยืนยันเหตุการณ์",
    assisting: "กำลังช่วยเหลือ",
    completed: "เสร็จสิ้น",
    open: "ยืนยันเหตุการณ์",
    Open: "ยืนยันเหตุการณ์",
    investigating: "กำลังช่วยเหลือ",
    Investigating: "กำลังช่วยเหลือ",
    resolved: "เสร็จสิ้น",
    Resolved: "เสร็จสิ้น",
  };
  return labels[status] ?? status;
}

function trafficRecordTime(record) {
  const detectedAt = String(record.detected_at ?? record.time ?? "");
  const timeMatch = detectedAt.match(/T(\d{2}:\d{2}:\d{2})/);
  return timeMatch?.[1] ?? detectedAt;
}

function uniqueTrafficValues(key) {
  return [...new Set(trafficRecords.map((record) => record[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "th"));
}

function trafficFilterOptions(key) {
  return uniqueTrafficValues(key)
    .map((value) => `<option value="${value}">${value}</option>`)
    .join("");
}

function trafficCameraOptions() {
  const cameras = [...new Map(trafficRecords.map((record) => [record.camera_id, `${record.camera_id} - ${record.location ?? record.camera_id}`])).entries()];
  return cameras
    .sort(([cameraA], [cameraB]) => cameraA.localeCompare(cameraB))
    .map(([camera, label]) => `<option value="${camera}">${label}</option>`)
    .join("");
}

function vehicleTypeBadgeClass(type) {
  const classes = {
    "Debug Route": "info",
    รถยนต์: "info",
    รถบรรทุก: "warning",
    จักรยานยนต์: "up",
    รถโดยสาร: "medium",
  };
  return classes[type] ?? "info";
}

function vehicleColorClass(color) {
  const classes = {
    "Debug Blue": "color-blue",
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

function trafficRecordKey(record) {
  return encodeURIComponent(record.id ?? `${record.detected_at}|${record.camera_id}|${record.plate}`);
}

function findTrafficRecord(key) {
  return trafficRecords.find((record) => trafficRecordKey(record) === key);
}

function renderTrafficRows(records) {
  if (!records.length) {
    return `
      <tr class="empty-row">
        <td colspan="10">ไม่พบรายการ Traffic ที่ตรงกับตัวกรอง No matching traffic records</td>
      </tr>
    `;
  }

  return records
    .map(
      (record) => `
        <tr>
          <td><strong>${trafficRecordTime(record)}</strong></td>
          <td>${record.location}</td>
          <td>${record.camera_id}</td>
          <td>${record.plate}</td>
          <td>${record.brand}</td>
          <td><span class="badge ${vehicleTypeBadgeClass(record.vehicle_type)}">${record.vehicle_type}</span></td>
          <td><span class="color-chip"><span class="vehicle-color-dot ${vehicleColorClass(record.color)}"></span>${record.color}</span></td>
          <td>${record.direction}</td>
          <td>${record.speed} km/h</td>
          <td>
            <button class="text-button" type="button" data-traffic-detail="${trafficRecordKey(record)}">
              ดูรายละเอียด
            </button>
          </td>
        </tr>
      `,
    )
    .join("");
}

