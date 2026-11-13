package preferences

import (
	"context"
	"errors"
)

// ActiveFarmRepository stores the ID of the active farm as a preference entry.
type ActiveFarmRepository struct {
	entries EntryRepository
}

// NewActiveFarmRepository returns an ActiveFarmRepository backed by entries.
func NewActiveFarmRepository(entries EntryRepository) *ActiveFarmRepository {
	return &ActiveFarmRepository{entries: entries}
}

// Get returns the active farm ID, or an empty string when none is active.
func (r *ActiveFarmRepository) Get(ctx context.Context) (string, error) {
	e, err := r.entries.Get(ctx, KeyActiveFarm)
	if errors.Is(err, ErrEntryNotFound) {
		return "", nil
	}
	if err != nil {
		return "", err
	}
	if err := checkType(e); err != nil {
		return "", err
	}
	return e.Value, nil
}

// Set makes id the active farm ID.
func (r *ActiveFarmRepository) Set(ctx context.Context, id string) error {
	return r.entries.Upsert(ctx, stringEntry(KeyActiveFarm, id))
}

// Clear leaves no farm active.
func (r *ActiveFarmRepository) Clear(ctx context.Context) error {
	return r.entries.Delete(ctx, KeyActiveFarm)
}
