package preferences_test

import (
	"context"
	"errors"
	"path/filepath"
	"testing"
	"time"

	"github.com/google/uuid"

	"github.com/Jyko/tunmez/internal/database"
	"github.com/Jyko/tunmez/internal/preferences"
)

func newSQLiteRepository(t *testing.T) *preferences.SQLiteEntryRepository {
	t.Helper()
	db, err := database.Open(context.Background(), filepath.Join(t.TempDir(), "tunmez.db"))
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = db.Close() })
	return preferences.NewSQLiteEntryRepository(db)
}

func TestSQLiteEntryRepositoryGetMissingKey(t *testing.T) {
	repo := newSQLiteRepository(t)

	_, err := repo.Get(context.Background(), preferences.KeyLocale)
	if !errors.Is(err, preferences.ErrEntryNotFound) {
		t.Errorf("Get missing key: err = %v, want ErrEntryNotFound", err)
	}
}

func TestSQLiteEntryRepositoryUpsert(t *testing.T) {
	ctx := context.Background()
	repo := newSQLiteRepository(t)

	if err := repo.Upsert(ctx, preferences.Entry{Key: preferences.KeyLocale, Value: "en", Type: preferences.TypeString}); err != nil {
		t.Fatal(err)
	}
	first, err := repo.Get(ctx, preferences.KeyLocale)
	if err != nil {
		t.Fatal(err)
	}
	id, err := uuid.Parse(first.ID)
	if err != nil || id.Version() != 7 {
		t.Errorf("ID = %q, want a UUIDv7", first.ID)
	}
	if first.Value != "en" || first.Type != preferences.TypeString {
		t.Errorf("entry = %+v, want value en of type string", first)
	}
	if time.Since(first.UpdatedAt) > time.Minute {
		t.Errorf("UpdatedAt = %v, want now", first.UpdatedAt)
	}

	if err := repo.Upsert(ctx, preferences.Entry{Key: preferences.KeyLocale, Value: "fr-FR", Type: preferences.TypeString}); err != nil {
		t.Fatal(err)
	}
	second, err := repo.Get(ctx, preferences.KeyLocale)
	if err != nil {
		t.Fatal(err)
	}
	if second.ID != first.ID {
		t.Errorf("ID changed on update: %q -> %q", first.ID, second.ID)
	}
	if second.Value != "fr-FR" {
		t.Errorf("Value = %q, want fr-FR", second.Value)
	}
	if second.UpdatedAt.Before(first.UpdatedAt) {
		t.Errorf("UpdatedAt went backwards: %v -> %v", first.UpdatedAt, second.UpdatedAt)
	}
}

func TestSQLiteEntryRepositoryListAndDelete(t *testing.T) {
	ctx := context.Background()
	repo := newSQLiteRepository(t)

	for _, e := range []preferences.Entry{
		{Key: preferences.KeyTheme, Value: "dark", Type: preferences.TypeString},
		{Key: preferences.KeyWindowWidth, Value: "1024", Type: preferences.TypeInt},
	} {
		if err := repo.Upsert(ctx, e); err != nil {
			t.Fatal(err)
		}
	}

	if err := repo.Delete(ctx, preferences.KeyTheme); err != nil {
		t.Fatal(err)
	}
	if err := repo.Delete(ctx, preferences.KeyTheme); err != nil {
		t.Errorf("Delete of a missing key: %v, want nil", err)
	}

	entries, err := repo.List(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if len(entries) != 1 || entries[0].Key != preferences.KeyWindowWidth {
		t.Errorf("List = %+v, want only %s", entries, preferences.KeyWindowWidth)
	}
}
