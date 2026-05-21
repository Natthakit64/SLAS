CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE vehicle_log (
    id          UUID        NOT NULL DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detected_at TIMESTAMPTZ NOT NULL,
    track_id    UUID        NOT NULL,
    camera_id   VARCHAR(6)  NOT NULL,
    last_seen   TIMESTAMPTZ,
    vehicle_type  VARCHAR(20),
    color         VARCHAR(20),
    brand         VARCHAR(30),
    plate         VARCHAR(10),
    position_x    REAL,
    position_y    REAL,
    bbox_width    REAL,
    bbox_height   REAL,
    event_type    VARCHAR(20),
    type_confidence   REAL,
    color_confidence  REAL,
    brand_confidence  REAL,
    PRIMARY KEY (id, detected_at)
);

SELECT create_hypertable('vehicle_log', by_range('detected_at', INTERVAL '1 day'), migrate_data => true);

-- ── Indexes ────────────────────────────────────────────────

CREATE INDEX idx_vehicle_log_camera     ON vehicle_log (camera_id);
CREATE INDEX idx_vehicle_log_track      ON vehicle_log (track_id);
CREATE INDEX idx_vehicle_log_event_type ON vehicle_log (event_type);
CREATE INDEX idx_vehicle_log_brand      ON vehicle_log (brand);

-- ── Auto update updated_at ────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON vehicle_log
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();