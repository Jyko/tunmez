package preferences

import (
	"context"
	"errors"
)

// ActiveFarmRepository stores the ID of the active farm in the session state.
type ActiveFarmRepository struct {
	state StateRepository
}

// NewActiveFarmRepository returns an ActiveFarmRepository backed by state.
func NewActiveFarmRepository(state StateRepository) *ActiveFarmRepository {
	return &ActiveFarmRepository{state: state}
}

// Get returns the active farm ID, or an empty string when none is active.
// An invalid state file counts as no active farm.
func (r *ActiveFarmRepository) Get(context.Context) (string, error) {
	st, err := r.state.Load()
	var invalid *InvalidFileError
	if err != nil && !errors.As(err, &invalid) {
		return "", err
	}
	return st.ActiveFarm, nil
}

// Set makes id the active farm ID.
func (r *ActiveFarmRepository) Set(_ context.Context, id string) error {
	return r.state.Update(func(st *State) { st.ActiveFarm = id })
}

// Clear leaves no farm active.
func (r *ActiveFarmRepository) Clear(_ context.Context) error {
	return r.state.Update(func(st *State) { st.ActiveFarm = "" })
}
