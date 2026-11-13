-- User preferences moved to YAML files in the user's profile.

-- +goose Up
DROP TABLE preference;

-- +goose Down
CREATE TABLE preference (
    id         TEXT PRIMARY KEY,
    key        TEXT NOT NULL UNIQUE,
    value      TEXT NOT NULL,
    type       TEXT NOT NULL CHECK (type IN ('string', 'int', 'bool')),
    updated_at TEXT NOT NULL
);
