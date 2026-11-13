package preferences_test

import (
	"context"
	"testing"

	"github.com/Jyko/tunmez/internal/preferences"
)

func TestActiveFarmRepository(t *testing.T) {
	ctx := context.Background()
	repo := preferences.NewActiveFarmRepository(memoryRepository{})

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

func TestDisplayServiceIgnoresActiveFarm(t *testing.T) {
	ctx := context.Background()
	entries := memoryRepository{}
	if err := preferences.NewActiveFarmRepository(entries).Set(ctx, "farm-1"); err != nil {
		t.Fatal(err)
	}
	if _, err := preferences.NewDisplayService(entries).Get(ctx); err != nil {
		t.Errorf("Get() with an active farm entry: %v, want nil", err)
	}
}
