const accidentEvidenceImages = {
  // Add more incident images here when evidence files are ready.
  "INC-2401": "212121.png",
  "INC-2402": "25452.png",
};

function accidentRecord(id) {
  return accidentCards.find((item) => item.id === id) ?? accidentCards[0];
}

function accidentEvidenceImage(id) {
  return accidentEvidenceImages[id] ?? "";
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
                  <button class="text-button" type="button" data-accident-detail="${item.id}">ดูรายละเอียด View Details</button>
                </footer>
              </article>
            `,
          )
          .join("")}
      </section>
    </div>
  `;
}

function renderAccidentDetail() {
  const item = accidentRecord(selectedAccidentId);
  const evidenceImage = accidentEvidenceImage(item.id);

  return `
    <div class="page-stack accident-detail-page">
      <section class="section-header accident-detail-header">
        <div>
          <button class="text-button back-link" type="button" data-back-to-accidents>${iconSpan("chevron")}กลับไปรายงานอุบัติเหตุ Back to Accident Report</button>
          <h2>${item.id}</h2>
          <p>${item.location} · ${item.type} · ${item.time}</p>
        </div>
        <div class="accident-detail-badges">
          <span class="badge ${item.severity}">${severityLabel(item.severity)}</span>
          <span class="badge ${item.status}">${statusLabel(item.status)}</span>
        </div>
      </section>

      <section class="accident-detail-layout">
        <article class="panel accident-evidence-panel">
          <div class="panel-header">
            <div class="panel-title">
              <h2>รูปเหตุการณ์</h2>
              <p>Incident evidence image</p>
            </div>
          </div>
          ${
            evidenceImage
              ? `<figure class="accident-evidence-frame">
                  <img src="${evidenceImage}" alt="ภาพหลักฐานเหตุการณ์ ${item.id}" />
                </figure>`
              : `<div class="accident-evidence-placeholder">
                  <strong>ยังไม่มีรูปเหตุการณ์</strong>
                  <span>เตรียมช่องไว้สำหรับแนบรูปของ ${item.id}</span>
                </div>`
          }
        </article>

        <aside class="panel accident-detail-side">
          <div class="panel-title">
            <h2>รายละเอียดเหตุการณ์</h2>
            <p>Incident detail</p>
          </div>
          <dl class="detail-list">
            <div><dt>รหัส Incident ID</dt><dd>${item.id}</dd></div>
            <div><dt>พื้นที่ Location</dt><dd>${item.location}</dd></div>
            <div><dt>เวลา Time</dt><dd>${item.time}</dd></div>
            <div><dt>ประเภท Type</dt><dd>${item.type}</dd></div>
            <div><dt>จำนวนรถ Vehicles involved</dt><dd>${item.vehicles}</dd></div>
            <div><dt>ระดับ Severity</dt><dd><span class="badge ${item.severity}">${severityLabel(item.severity)}</span></dd></div>
            <div><dt>สถานะ Status</dt><dd><span class="badge ${item.status}">${statusLabel(item.status)}</span></dd></div>
          </dl>
        </aside>
      </section>
    </div>
  `;
}
