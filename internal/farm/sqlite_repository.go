package farm

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
)

// SQLiteRepository stores farms in the farm table.
type SQLiteRepository struct {
	db *sql.DB
}

// NewSQLiteRepository returns a repository backed by db.
func NewSQLiteRepository(db *sql.DB) *SQLiteRepository {
	return &SQLiteRepository{db: db}
}

// now is the current time in the RFC 3339 format stored in the database.
const now = `strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`

// List returns the farms, most recently used first.
func (r *SQLiteRepository) List(ctx context.Context) ([]Farm, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT id, name FROM farm ORDER BY last_used_at DESC, id DESC`)
	if err != nil {
		return nil, fmt.Errorf("list farms: %w", err)
	}
	defer func() { _ = rows.Close() }()
	farms := []Farm{}
	for rows.Next() {
		var f Farm
		if err := rows.Scan(&f.ID, &f.Name); err != nil {
			return nil, fmt.Errorf("list farms: %w", err)
		}
		farms = append(farms, f)
	}
	return farms, rows.Err()
}

// Get returns the farm with id, or ErrNotFound.
func (r *SQLiteRepository) Get(ctx context.Context, id string) (Farm, error) {
	f := Farm{ID: id}
	err := r.db.QueryRowContext(ctx, `SELECT name FROM farm WHERE id = ?`, id).Scan(&f.Name)
	if errors.Is(err, sql.ErrNoRows) {
		return Farm{}, ErrNotFound
	}
	if err != nil {
		return Farm{}, fmt.Errorf("get farm %q: %w", id, err)
	}
	return f, nil
}

// Create stores a new farm, used now.
func (r *SQLiteRepository) Create(ctx context.Context, name string) (Farm, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return Farm{}, fmt.Errorf("generate farm id: %w", err)
	}
	_, err = r.db.ExecContext(ctx,
		`INSERT INTO farm (id, name, created_at, last_used_at) VALUES (?, ?, `+now+`, `+now+`)`,
		id.String(), name)
	if err != nil {
		return Farm{}, fmt.Errorf("create farm: %w", err)
	}
	return Farm{ID: id.String(), Name: name}, nil
}

// Rename changes the name of the farm with id.
func (r *SQLiteRepository) Rename(ctx context.Context, id, name string) error {
	return r.exec(ctx, "rename", `UPDATE farm SET name = ? WHERE id = ?`, name, id)
}

// Touch records that the farm with id is used now.
func (r *SQLiteRepository) Touch(ctx context.Context, id string) error {
	return r.exec(ctx, "touch", `UPDATE farm SET last_used_at = `+now+` WHERE id = ?`, id)
}

// Delete removes the farm with id. Farm-owned rows go with it through
// ON DELETE CASCADE.
func (r *SQLiteRepository) Delete(ctx context.Context, id string) error {
	return r.exec(ctx, "delete", `DELETE FROM farm WHERE id = ?`, id)
}

// exec runs a statement on one farm, the last argument being its ID, and
// returns ErrNotFound when no row matched.
func (r *SQLiteRepository) exec(ctx context.Context, op, query string, args ...any) error {
	res, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("%s farm: %w", op, err)
	}
	n, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("%s farm: %w", op, err)
	}
	if n == 0 {
		return ErrNotFound
	}
	return nil
}
