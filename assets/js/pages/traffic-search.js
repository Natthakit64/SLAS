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
          <label for="trafficBrand">ยี่ห้อรถ Vehicle brand</label>
          <select class="select" id="trafficBrand" name="brand">
            <option value="">ทุกยี่ห้อ All brands</option>
            ${trafficFilterOptions("brand")}
          </select>
        </div>
        <div class="field">
          <label for="trafficType">ประเภทรถ Vehicle type</label>
          <select class="select" id="trafficType" name="type">
            <option value="">ทุกประเภท All types</option>
            ${trafficFilterOptions("vehicle_type")}
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
                <th>ยี่ห้อ Brand</th>
                <th>ประเภท Type</th>
                <th>สี Color</th>
                <th>ทิศทาง Direction</th>
                <th>ความเร็ว Speed</th>
                <th>รายละเอียด Detail</th>
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

function renderTrafficDetail() {
  const record = findTrafficRecord(selectedTrafficRecordKey) ?? trafficRecords[0];
  const route = routeForTrafficRecord(record);
  const routeStops = route?.cameraIds?.join(" → ") ?? "-";
  const selectedStop = cameraStop(record.camera_id);

  return `
    <div class="page-stack traffic-detail-page">
      <section class="section-header traffic-detail-header">
        <div>
          <button class="text-button back-link" type="button" data-back-to-search>${iconSpan("chevron")}กลับไปค้นหา Back to Search</button>
          <h2>${record.plate}</h2>
          <p>${record.brand} · ${record.vehicle_type} · ${record.color} · ${trafficRecordTime(record)}</p>
        </div>
        <span class="badge info">${record.camera_id}</span>
      </section>

      <section class="traffic-detail-layout">
        <article class="panel traffic-detail-map-panel">
          <div class="panel-header">
            <div class="panel-title">
              <h2>เส้นทางจากกล้อง</h2>
              <p>Camera route segments</p>
            </div>
          </div>
          <div class="traffic-detail-map-shell">
            <div id="trafficDetailMap" class="traffic-live-map traffic-detail-map" role="img" aria-label="แผนที่เส้นทางรถจากรายการ Traffic"></div>
            <button class="traffic-map-expand-button" type="button" data-expand-traffic-map aria-label="ขยายแผนที่เส้นทางรถ">
              ${icon("expand")}
            </button>
          </div>
          <div class="route-summary traffic-detail-route-summary">
            <strong>Route</strong>
            <span>${route?.name ?? "ไม่พบเส้นทาง"}</span>
            <small>${routeStops}</small>
            ${selectedStop ? `<small>จุดที่ตรวจพบ: ${selectedStop.id} ${selectedStop.name}</small>` : `<small>กล้องนี้ยังไม่มีพิกัดใน planningCameraPoints</small>`}
          </div>
        </article>

        <aside class="panel traffic-detail-side">
          <div class="panel-title">
            <h2>รายละเอียด Traffic</h2>
            <p>Traffic record detail</p>
          </div>
          <dl class="detail-list">
            <div><dt>ทะเบียน Plate</dt><dd>${record.plate}</dd></div>
            <div><dt>เวลา Time</dt><dd>${trafficRecordTime(record)}</dd></div>
            <div><dt>กล้องที่ตรวจพบ Camera</dt><dd>${record.camera_id}</dd></div>
            <div><dt>พื้นที่ Location</dt><dd>${record.location}</dd></div>
            <div><dt>ยี่ห้อ Brand</dt><dd>${record.brand}</dd></div>
            <div><dt>ประเภท Type</dt><dd>${record.vehicle_type}</dd></div>
            <div><dt>สี Color</dt><dd><span class="color-chip"><span class="vehicle-color-dot ${vehicleColorClass(record.color)}"></span>${record.color}</span></dd></div>
            <div><dt>ทิศทาง Direction</dt><dd>${record.direction}</dd></div>
            <div><dt>ความเร็ว Speed</dt><dd>${record.speed} km/h</dd></div>
          </dl>
        </aside>
      </section>
      <div class="traffic-map-modal" data-traffic-map-modal role="dialog" aria-modal="true" aria-labelledby="trafficMapModalTitle" hidden>
        <div class="traffic-map-modal-backdrop" data-close-traffic-map></div>
        <div class="traffic-map-modal-dialog">
          <div class="traffic-map-modal-header">
            <div class="panel-title">
              <h2 id="trafficMapModalTitle">แผนที่เส้นทางรถ</h2>
              <p>${record.plate} · ${route?.name ?? "ไม่พบเส้นทาง"}</p>
            </div>
            <button class="icon-button traffic-map-modal-close" type="button" data-close-traffic-map aria-label="ปิดแผนที่ขยาย">
              <span>${icon("close")}</span>
            </button>
          </div>
          <div id="trafficDetailMapExpanded" class="traffic-live-map traffic-detail-map-expanded" role="img" aria-label="แผนที่เส้นทางรถแบบขยาย"></div>
        </div>
      </div>
    </div>
  `;
}
