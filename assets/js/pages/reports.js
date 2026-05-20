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

