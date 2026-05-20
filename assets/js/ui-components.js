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

