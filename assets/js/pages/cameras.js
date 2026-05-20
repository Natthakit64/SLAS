function renderCameras() {
  return `
    <div class="page-stack">
      <section class="filter-bar camera-filter" aria-label="ตัวกรองกล้อง Camera filter">
        <div class="field"><label>โซนกล้อง Camera zone</label><select class="select"><option>All zones</option><option>Central</option><option>North</option><option>East</option></select></div>
        <div class="field"><label>ค้นหา Search</label><input class="input" type="search" placeholder="CAM-01, Gate A" /></div>
      </section>
      <section class="camera-grid">
        ${cameraFeeds
          .map(
            (camera) => `
              <article class="camera-tile" tabindex="0" style="--status:${camera.live ? "#45B15B" : "#D14B4B"}">
                <span class="camera-status" aria-label="${camera.live ? "Live" : "Offline"}"></span>
                <span class="camera-name">${camera.name}</span>
                <div class="camera-overlay">
                  <strong>${camera.id}</strong>
                  <span>${camera.location}</span>
                  <span>${camera.live ? "สด Live" : "ออฟไลน์ Offline"}</span>
                </div>
              </article>
            `,
          )
          .join("")}
      </section>
    </div>
  `;
}

