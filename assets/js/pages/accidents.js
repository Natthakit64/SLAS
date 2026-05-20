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

