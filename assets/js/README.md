# TrafficOS JavaScript Structure

`index.html` loads these files with classic deferred script tags. Keep the include order because later files depend on shared globals declared earlier.

- `core.js`: navigation, page state, icons, and shared formatting helpers.
- `ui-components.js`: reusable cards, chart renderers, and donut/table visual helpers.
- `data.js`: demo datasets for vehicles, incidents, cameras, and traffic records.
- `traffic-utils.js`: traffic filtering helpers, labels, color mapping, and traffic table rows.
- `pages/*.js`: page renderers and page-specific behavior.
- `main.js`: page registry, common binders, render lifecycle, and app bootstrap.
- `schema-mapping.md`: current mapping from `schema.sql` to the frontend traffic fields.

Page files should stay focused on one product area. Shared behavior belongs in `core.js`, `ui-components.js`, or `traffic-utils.js` instead of being copied across pages.

Traffic Planning routes use `planningCameraPoints` for real camera locations and `planningRoadSegmentDefinitions` for editable road waypoints between camera pairs.
