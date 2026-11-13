-- +goose Up
CREATE TABLE preference (
    id         TEXT PRIMARY KEY,                -- UUIDv7
    key        TEXT NOT NULL UNIQUE,
    value      TEXT NOT NULL,
    type       TEXT NOT NULL CHECK (type IN ('string', 'int', 'bool')),
    updated_at TEXT NOT NULL                    -- RFC 3339 UTC, last change
);

-- +goose Down
DROP TABLE preference;
