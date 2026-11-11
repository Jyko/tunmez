package preferences

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

// SQLiteEntryRepository stores preference entries in the preference table.
type SQLiteEntryRepository struct {
	db *sql.DB
}

// NewSQLiteEntryRepository returns a repository backed by db.
func NewSQLiteEntryRepository(db *sql.DB) *SQLiteEntryRepository {
	return &SQLiteEntryRepository{db: db}
}

const selectEntry = `SELECT id, key, value, type, updated_at FROM preference`

// Get returns the entry for key, or ErrEntryNotFound.
func (r *SQLiteEntryRepository) Get(ctx context.Context, key Key) (Entry, error) {
	e, err := scanEntry(r.db.QueryRowContext(ctx, selectEntry+` WHERE key = ?`, key))
	if errors.Is(err, sql.ErrNoRows) {
		return Entry{}, ErrEntryNotFound
	}
	if err != nil {
		return Entry{}, fmt.Errorf("get preference %q: %w", key, err)
	}
	return e, nil
}

// List returns all stored entries ordered by key.
func (r *SQLiteEntryRepository) List(ctx context.Context) ([]Entry, error) {
	rows, err := r.db.QueryContext(ctx, selectEntry+` ORDER BY key`)
	if err != nil {
		return nil, fmt.Errorf("list preferences: %w", err)
	}
	defer func() { _ = rows.Close() }()

	var entries []Entry
	for rows.Next() {
		e, err := scanEntry(rows)
		if err != nil {
			return nil, fmt.Errorf("list preferences: %w", err)
		}
		entries = append(entries, e)
	}
	return entries, rows.Err()
}

// Upsert inserts e or updates the entry with the same key, keeping its ID.
func (r *SQLiteEntryRepository) Upsert(ctx context.Context, e Entry) error {
	id, err := uuid.NewV7()
	if err != nil {
		return fmt.Errorf("generate preference id: %w", err)
	}
	_, err = r.db.ExecContext(ctx, `
		INSERT INTO preference (id, key, value, type, updated_at)
		VALUES (?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
		ON CONFLICT (key) DO UPDATE SET
			value = excluded.value,
			type = excluded.type,
			updated_at = excluded.updated_at`,
		id.String(), e.Key, e.Value, e.Type)
	if err != nil {
		return fmt.Errorf("save preference %q: %w", e.Key, err)
	}
	return nil
}

// Delete removes the entry for key.
func (r *SQLiteEntryRepository) Delete(ctx context.Context, key Key) error {
	if _, err := r.db.ExecContext(ctx, `DELETE FROM preference WHERE key = ?`, key); err != nil {
		return fmt.Errorf("delete preference %q: %w", key, err)
	}
	return nil
}

type scanner interface {
	Scan(dest ...any) error
}

func scanEntry(s scanner) (Entry, error) {
	var (
		e         Entry
		updatedAt string
	)
	if err := s.Scan(&e.ID, &e.Key, &e.Value, &e.Type, &updatedAt); err != nil {
		return Entry{}, err
	}
	t, err := time.Parse(time.RFC3339Nano, updatedAt)
	if err != nil {
		return Entry{}, fmt.Errorf("parse updated_at: %w", err)
	}
	e.UpdatedAt = t
	return e, nil
}
