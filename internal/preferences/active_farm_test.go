package preferences_test

import (
	"context"
	"testing"

	"github.com/Jyko/tunmez/internal/preferences"
)

func TestActiveFarmRepository(t *testing.T) {
	ctx := context.Background()
	f := newFiles(t)
	repo := preferences.NewActiveFarmRepository(preferences.NewStateRepository(f.state))

	if id, err := repo.Get(ctx); err != nil || id != "" {
		t.Errorf("Get() = %q, %v, want none", id, err)
	}
	if err := repo.Set(ctx, "farm-1"); err != nil {
		t.Fatal(err)
	}
	if id, _ := repo.Get(ctx); id != "farm-1" {
		t.Errorf("Get() = %q, want farm-1", id)
	}
	if err := repo.Clear(ctx); err != nil {
		t.Fatal(err)
	}
	if id, _ := repo.Get(ctx); id != "" {
		t.Errorf("Get() after Clear = %q, want none", id)
	}
}

func TestActiveFarmRepositoryKeepsWindow(t *testing.T) {
	ctx := context.Background()
	f := newFiles(t)
	state := preferences.NewStateRepository(f.state)
	window := preferences.Window{Width: 1024, Height: 700}
	if err := f.display().SaveWindow(ctx, window); err != nil {
		t.Fatal(err)
	}

	if err := preferences.NewActiveFarmRepository(state).Set(ctx, "farm-1"); err != nil {
		t.Fatal(err)
	}
	if got := f.display().Get(ctx); got.Window != window {
		t.Errorf("Window = %+v, want %+v", got.Window, window)
	}
}

func TestActiveFarmRepositoryInvalidStateMeansNone(t *testing.T) {
	f := newFiles(t)
	write(t, f.state, "active_farm: [\n")

	id, err := preferences.NewActiveFarmRepository(preferences.NewStateRepository(f.state)).Get(context.Background())
	if err != nil || id != "" {
		t.Errorf("Get() = %q, %v, want none", id, err)
	}
}
