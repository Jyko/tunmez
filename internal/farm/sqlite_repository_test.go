package farm_test

import (
	"context"
	"errors"
	"path/filepath"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/Jyko/tunmez/internal/database"
	"github.com/Jyko/tunmez/internal/farm"
)

func newSQLiteRepository(t *testing.T) *farm.SQLiteRepository {
	t.Helper()
	db, err := database.Open(context.Background(), filepath.Join(t.TempDir(), "tunmez.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = db.Close() })
	return farm.NewSQLiteRepository(db)
}

// tick makes the next timestamp strictly later than the previous one.
func tick() { time.Sleep(2 * time.Millisecond) }

func listIDs(t *testing.T, repo *farm.SQLiteRepository) []string {
	t.Helper()
	farms, err := repo.List(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	ids := []string{}
	for _, f := range farms {
		ids = append(ids, f.ID)
	}
	return ids
}

func TestSQLiteRepositoryCreateAndGet(t *testing.T) {
	ctx := context.Background()
	repo := newSQLiteRepository(t)

	created, err := repo.Create(ctx, "Les Jardins du Lac")
	if err != nil {
		t.Fatal(err)
	}
	if id, err := uuid.Parse(created.ID); err != nil || id.Version() != 7 {
		t.Errorf("ID = %q, want a UUIDv7", created.ID)
	}
	got, err := repo.Get(ctx, created.ID)
	if err != nil || got != created {
		t.Errorf("Get() = %v, %v, want %v", got, err, created)
	}
	if _, err := repo.Get(ctx, "missing"); !errors.Is(err, farm.ErrNotFound) {
		t.Errorf("Get(missing): err = %v, want ErrNotFound", err)
	}
}

func TestSQLiteRepositoryListMostRecentlyUsedFirst(t *testing.T) {
	ctx := context.Background()
	repo := newSQLiteRepository(t)
	if got := listIDs(t, repo); len(got) != 0 {
		t.Fatalf("List on an empty database = %v", got)
	}

	a, _ := repo.Create(ctx, "A")
	tick()
	b, _ := repo.Create(ctx, "B")
	if got := listIDs(t, repo); got[0] != b.ID {
		t.Errorf("List = %v, want the newest farm first", got)
	}
	tick()
	if err := repo.Touch(ctx, a.ID); err != nil {
		t.Fatal(err)
	}
	if got := listIDs(t, repo); got[0] != a.ID {
		t.Errorf("List = %v, want the touched farm first", got)
	}
}

func TestSQLiteRepositoryRenameAndDelete(t *testing.T) {
	ctx := context.Background()
	repo := newSQLiteRepository(t)
	f, _ := repo.Create(ctx, "A")

	if err := repo.Rename(ctx, f.ID, "B"); err != nil {
		t.Fatal(err)
	}
	if got, _ := repo.Get(ctx, f.ID); got.Name != "B" {
		t.Errorf("Name = %q, want B", got.Name)
	}
	if err := repo.Delete(ctx, f.ID); err != nil {
		t.Fatal(err)
	}
	for op, err := range map[string]error{
		"Rename": repo.Rename(ctx, f.ID, "C"),
		"Touch":  repo.Touch(ctx, f.ID),
		"Delete": repo.Delete(ctx, f.ID),
	} {
		if !errors.Is(err, farm.ErrNotFound) {
			t.Errorf("%s of a deleted farm: err = %v, want ErrNotFound", op, err)
		}
	}
}

func TestSQLiteRepositoryRejectsBlankName(t *testing.T) {
	if _, err := newSQLiteRepository(t).Create(context.Background(), " "); err == nil {
		t.Error("Create with a blank name: err = nil, want a constraint error")
	}
}
