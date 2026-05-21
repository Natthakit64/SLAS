# Vehicle Log Schema Mapping

Source schema: `schema.sql` table `vehicle_log`.

## Mapped In Traffic UI

- `detected_at` -> Traffic time filter, table time, detail time
- `camera_id` -> Camera filter, table camera, detail camera, route lookup
- `vehicle_type` -> Vehicle type filter, table type, detail type
- `color` -> Color filter, color dot, table color, detail color
- `brand` -> Vehicle brand filter, table brand, detail brand
- `plate` -> Plate search, table plate, detail plate
- `id` -> Traffic row/detail key
- `track_id` -> Preserved on each mock row for future vehicle tracking
- `last_seen` -> Preserved on each mock row for future tracking windows
- `position_x`, `position_y`, `bbox_width`, `bbox_height` -> Preserved on each mock row for future detection-box display
- `event_type`, `type_confidence`, `color_confidence`, `brand_confidence` -> Preserved on each mock row for future confidence/status UI

## Still Mock-Only

These fields are still kept in the mock rows because the current schema does not include them yet:

- `location` - human-readable location name; would usually come from a camera table joined by `camera_id`
- `model` - full vehicle model; schema has `brand` only
- `speed` - vehicle speed shown in Traffic Search and Detail
- `direction` - inbound/outbound direction shown in Traffic Search and Detail
- `routeId` - local route hook for mock Traffic detail maps; used to show varied routes until route history exists in the database

## Missing Tables Or Columns For Existing Screens

- Camera metadata table: camera name, zone, live/offline status, latitude, longitude
- Route/segment table: route id, from camera, to camera, waypoint coordinates
- Accident/incident tables: severity, status, incident type, vehicle count, location, report time
- Aggregation tables or queries: daily vehicle counts, vehicle-type percentages, density, heatmap/hotspot data
- Vehicle model column if the UI must filter by exact model instead of brand
