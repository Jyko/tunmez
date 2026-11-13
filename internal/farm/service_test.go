package farm_test

import (
	"context"
	"errors"
	"slices"
	"strings"
	"testing"

	"github.com/Jyko/tunmez/internal/farm"
)

// memoryRepository is an in-memory farm.Repository; farms are kept most
// recently used first.
type memoryRepository struct {
	farms  []farm.Farm
	nextID int
}

func (m *memoryRepository) List(context.Context) ([]farm.Farm, error) {
	return slices.Clone(m.farms), nil
}

func (m *memoryRepository) Get(_ context.Context, id string) (farm.Farm, error) {
	i := m.index(id)
	if i < 0 {
		return farm.Farm{}, farm.ErrNotFound
	}
	return m.farms[i], nil
}

func (m *memoryRepository) Create(_ context.Context, name string) (farm.Farm, error) {
	m.nextID++
	f := farm.Farm{ID: strings.Repeat("f", m.nextID), Name: name}
	m.farms = slices.Insert(m.farms, 0, f)
	return f, nil
}

func (m *memoryRepository) Rename(_ context.Context, id, name string) error {
	i := m.index(id)
	if i < 0 {
		return farm.ErrNotFound
	}
	m.farms[i].Name = name
	return nil
}

func (m *memoryRepository) Touch(_ context.Context, id string) error {
	i := m.index(id)
	if i < 0 {
		return farm.ErrNotFound
	}
	f := m.farms[i]
	m.farms = slices.Insert(slices.Delete(m.farms, i, i+1), 0, f)
	return nil
}

func (m *memoryRepository) Delete(_ context.Context, id string) error {
	i := m.index(id)
	if i < 0 {
		return farm.ErrNotFound
	}
	m.farms = slices.Delete(m.farms, i, i+1)
	return nil
}

func (m *memoryRepository) index(id string) int {
	return slices.IndexFunc(m.farms, func(f farm.Farm) bool { return f.ID == id })
}

// memoryActive is an in-memory farm.ActiveRepository.
type memoryActive struct{ id string }

func (m *memoryActive) Get(context.Context) (string, error)    { return m.id, nil }
func (m *memoryActive) Set(_ context.Context, id string) error { m.id = id; return nil }
func (m *memoryActive) Clear(context.Context) error            { m.id = ""; return nil }

func newService() (*farm.Service, *memoryRepository, *memoryActive) {
	repo, active := &memoryRepository{}, &memoryActive{}
	return farm.NewService(repo, active), repo, active
}

func names(t *testing.T, svc *farm.Service) []string {
	t.Helper()
	farms, err := svc.List(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	var out []string
	for _, f := range farms {
		out = append(out, f.Name)
	}
	return out
}

func TestServiceActiveWithoutFarm(t *testing.T) {
	svc, _, _ := newService()
	got, err := svc.Active(context.Background())
	if err != nil || got != nil {
		t.Errorf("Active() = %v, %v, want nil, nil", got, err)
	}
}

func TestServiceCreate(t *testing.T) {
	ctx := context.Background()
	svc, _, _ := newService()

	f, err := svc.Create(ctx, "  Les Jardins du Lac  ")
	if err != nil {
		t.Fatal(err)
	}
	if f.Name != "Les Jardins du Lac" {
		t.Errorf("Name = %q, want trimmed", f.Name)
	}
	active, err := svc.Active(ctx)
	if err != nil || active == nil || *active != f {
		t.Errorf("Active() = %v, %v, want %v", active, err, f)
	}
	// Names need not be unique.
	if _, err := svc.Create(ctx, "Les Jardins du Lac"); err != nil {
		t.Errorf("Create with a duplicate name: %v, want nil", err)
	}
}

func TestServiceRejectsInvalidNames(t *testing.T) {
	ctx := context.Background()
	svc, _, _ := newService()
	tests := []struct {
		name string
		want error
	}{
		{"", farm.ErrNameRequired},
		{"   ", farm.ErrNameRequired},
		{strings.Repeat("é", farm.MaxNameLength+1), farm.ErrNameTooLong},
	}
	for _, tt := range tests {
		if _, err := svc.Create(ctx, tt.name); !errors.Is(err, tt.want) {
			t.Errorf("Create(%q): err = %v, want %v", tt.name, err, tt.want)
		}
	}
	if _, err := svc.Create(ctx, strings.Repeat("é", farm.MaxNameLength)); err != nil {
		t.Errorf("Create with %d characters: %v, want nil", farm.MaxNameLength, err)
	}
}

func TestServiceSelect(t *testing.T) {
	ctx := context.Background()
	svc, _, active := newService()
	a, _ := svc.Create(ctx, "A")
	_, _ = svc.Create(ctx, "B")

	if _, err := svc.Select(ctx, a.ID); err != nil {
		t.Fatal(err)
	}
	if active.id != a.ID {
		t.Errorf("active = %q, want %q", active.id, a.ID)
	}
	if got := names(t, svc); !slices.Equal(got, []string{"A", "B"}) {
		t.Errorf("List = %v, want A first after use", got)
	}
	if _, err := svc.Select(ctx, "missing"); !errors.Is(err, farm.ErrNotFound) {
		t.Errorf("Select(missing): err = %v, want ErrNotFound", err)
	}
}

func TestServiceRename(t *testing.T) {
	ctx := context.Background()
	svc, _, _ := newService()
	f, _ := svc.Create(ctx, "A")

	got, err := svc.Rename(ctx, f.ID, " B ")
	if err != nil || got.Name != "B" {
		t.Errorf("Rename() = %v, %v, want B", got, err)
	}
	if _, err := svc.Rename(ctx, f.ID, ""); !errors.Is(err, farm.ErrNameRequired) {
		t.Errorf("Rename to empty: err = %v, want ErrNameRequired", err)
	}
	if _, err := svc.Rename(ctx, "missing", "C"); !errors.Is(err, farm.ErrNotFound) {
		t.Errorf("Rename(missing): err = %v, want ErrNotFound", err)
	}
}

func TestServiceDelete(t *testing.T) {
	ctx := context.Background()
	svc, _, active := newService()
	a, _ := svc.Create(ctx, "A")
	b, _ := svc.Create(ctx, "B")

	// Deleting another farm keeps the active one.
	if err := svc.Delete(ctx, a.ID); err != nil {
		t.Fatal(err)
	}
	if active.id != b.ID {
		t.Errorf("active = %q, want %q", active.id, b.ID)
	}
	// Deleting the active and last farm leaves none active.
	if err := svc.Delete(ctx, b.ID); err != nil {
		t.Fatal(err)
	}
	if active.id != "" {
		t.Errorf("active = %q, want none", active.id)
	}
	if got := names(t, svc); len(got) != 0 {
		t.Errorf("List = %v, want empty", got)
	}
}

func TestServiceActiveClearsStaleID(t *testing.T) {
	svc, _, active := newService()
	active.id = "deleted"

	got, err := svc.Active(context.Background())
	if err != nil || got != nil {
		t.Errorf("Active() = %v, %v, want nil, nil", got, err)
	}
	if active.id != "" {
		t.Errorf("stale active ID kept: %q", active.id)
	}
}
