# SLAS CSS Structure

`styles.css` is now a small manifest that imports the ordered CSS files below. Keep the import order because later files may override earlier shared styles.

- `base.css`: design tokens, reset, typography, and form font inheritance.
- `shell.css`: application shell, sidebar, topbar, content spacing, and navigation.
- `components/*.css`: reusable cards, panels, charts, tables, badges, filters, buttons, and form controls.
- `pages/page-grids.css`: shared page grid layouts.
- `pages/planning-map.css`: Traffic Planning map shell and density status UI.
- `pages/traffic-search.css`: Traffic Search summaries, table sizing, color dots, and empty state.
- `pages/map-controls.css`: planning controls, map placeholders, legends, camera/vehicle markers, and popups.
- `pages/traffic-detail.css`: Traffic Detail layout, map panel, detail list, and route summary.
- `pages/accidents.css`, `pages/cameras.css`, and `pages/reports-analysis.css`: page-specific styling.
- `responsive.css`: responsive overrides for tablet and mobile.

When adding a new page, place page-only styles in `pages/` and keep reusable styles in `components/` or `shell.css`.
