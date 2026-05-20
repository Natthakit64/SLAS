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

function trafficRecordKey(record) {
  return encodeURIComponent(`${record.time}|${record.camera}|${record.plate}`);
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
          <td><strong>${record.time}</strong></td>
          <td>${record.location}</td>
          <td>${record.camera}</td>
          <td>${record.plate}</td>
          <td>${record.model}</td>
          <td><span class="badge ${vehicleTypeBadgeClass(record.type)}">${record.type}</span></td>
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

