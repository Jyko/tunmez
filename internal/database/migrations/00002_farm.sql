-- +goose Up
CREATE TABLE farm (
    id           TEXT PRIMARY KEY,              -- UUIDv7
    name         TEXT NOT NULL CHECK (length(trim(name)) > 0 AND length(name) <= 255),
    created_at   TEXT NOT NULL,                 -- RFC 3339 UTC
    last_used_at TEXT NOT NULL                  -- RFC 3339 UTC, last time the farm was opened
);

CREATE INDEX farm_last_used_at ON farm (last_used_at);

-- +goose Down
DROP TABLE farm;
