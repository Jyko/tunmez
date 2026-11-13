package farm

import "context"

// Repository persists farms.
type Repository interface {
	// List returns the farms, most recently used first.
	List(ctx context.Context) ([]Farm, error)
	// Get returns the farm with id, or ErrNotFound.
	Get(ctx context.Context, id string) (Farm, error)
	// Create stores a new farm, used now, and returns it with its ID.
	Create(ctx context.Context, name string) (Farm, error)
	// Rename changes the name of the farm with id, or returns ErrNotFound.
	Rename(ctx context.Context, id, name string) error
	// Touch records that the farm with id is used now, or returns ErrNotFound.
	Touch(ctx context.Context, id string) error
	// Delete removes the farm with id and its data, or returns ErrNotFound.
	Delete(ctx context.Context, id string) error
}

// ActiveRepository persists which farm is active.
type ActiveRepository interface {
	// Get returns the active farm ID, or an empty string when none is active.
	Get(ctx context.Context) (string, error)
	Set(ctx context.Context, id string) error
	Clear(ctx context.Context) error
}
