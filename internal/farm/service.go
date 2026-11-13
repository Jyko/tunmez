package farm

import (
	"context"
	"errors"
	"fmt"
)

// Service creates, opens, renames and deletes farms, and tracks the active one.
type Service struct {
	farms  Repository
	active ActiveRepository
}

// NewService returns a Service backed by farms and active.
func NewService(farms Repository, active ActiveRepository) *Service {
	return &Service{farms: farms, active: active}
}

// List returns the farms, most recently used first.
func (s *Service) List(ctx context.Context) ([]Farm, error) {
	farms, err := s.farms.List(ctx)
	if err != nil {
		return nil, fmt.Errorf("list farms: %w", err)
	}
	return farms, nil
}

// Active returns the active farm, or nil when no farm is active.
func (s *Service) Active(ctx context.Context) (*Farm, error) {
	id, err := s.active.Get(ctx)
	if err != nil || id == "" {
		return nil, err
	}
	f, err := s.farms.Get(ctx, id)
	if errors.Is(err, ErrNotFound) {
		// The farm was deleted but the active ID was not cleared.
		return nil, s.active.Clear(ctx)
	}
	if err != nil {
		return nil, err
	}
	return &f, nil
}

// Create creates a farm named name and makes it the active farm.
func (s *Service) Create(ctx context.Context, name string) (Farm, error) {
	name, err := normaliseName(name)
	if err != nil {
		return Farm{}, err
	}
	f, err := s.farms.Create(ctx, name)
	if err != nil {
		return Farm{}, err
	}
	return f, s.active.Set(ctx, f.ID)
}

// Select makes the farm with id the active farm and records its use.
func (s *Service) Select(ctx context.Context, id string) (Farm, error) {
	f, err := s.farms.Get(ctx, id)
	if err != nil {
		return Farm{}, err
	}
	if err := s.farms.Touch(ctx, id); err != nil {
		return Farm{}, err
	}
	return f, s.active.Set(ctx, id)
}

// Rename renames the farm with id.
func (s *Service) Rename(ctx context.Context, id, name string) (Farm, error) {
	name, err := normaliseName(name)
	if err != nil {
		return Farm{}, err
	}
	if err := s.farms.Rename(ctx, id, name); err != nil {
		return Farm{}, err
	}
	return Farm{ID: id, Name: name}, nil
}

// Delete deletes the farm with id and its data. Deleting the active farm
// leaves no farm active.
func (s *Service) Delete(ctx context.Context, id string) error {
	active, err := s.active.Get(ctx)
	if err != nil {
		return err
	}
	if err := s.farms.Delete(ctx, id); err != nil {
		return err
	}
	if active == id {
		return s.active.Clear(ctx)
	}
	return nil
}
