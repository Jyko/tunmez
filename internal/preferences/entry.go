// Package preferences stores user preferences as typed key-value entries and
// exposes them to the application as domain values.
package preferences

import (
	"context"
	"errors"
	"time"
)

// Type is the type of an entry value.
type Type string

// Entry value types.
const (
	TypeString Type = "string"
	TypeInt    Type = "int"
	TypeBool   Type = "bool"
)

// Entry is a stored preference value. ID and UpdatedAt are set by the
// repository.
type Entry struct {
	ID        string
	Key       Key
	Value     string
	Type      Type
	UpdatedAt time.Time
}

// ErrEntryNotFound is returned when no entry exists for a key.
var ErrEntryNotFound = errors.New("preference entry not found")

// EntryRepository persists preference entries.
type EntryRepository interface {
	Get(ctx context.Context, key Key) (Entry, error)
	List(ctx context.Context) ([]Entry, error)
	Upsert(ctx context.Context, e Entry) error
	// Delete removes the entry for key. Deleting a missing key is not an error.
	Delete(ctx context.Context, key Key) error
}
