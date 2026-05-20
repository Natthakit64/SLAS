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

