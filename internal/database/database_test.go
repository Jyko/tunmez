package database_test

import (
	"context"
	"os"
	"path/filepath"
	"testing"

	"github.com/Jyko/tunmez/internal/database"
)

func TestOpen(t *testing.T) {
	path := filepath.Join(t.TempDir(), "nested", "tunmez.db")

	db, err := database.Open(context.Background(), path)
	if err != nil {
		t.Fatalf("Open: %v", err)
	}
	t.Cleanup(func() { _ = db.Close() })

	info, err := os.Stat(filepath.Dir(path))
	if err != nil {
		t.Fatalf("parent directory not created: %v", err)
	}
	if perm := info.Mode().Perm(); perm != 0o700 {
		t.Errorf("parent directory permissions = %o, want 700", perm)
	}
	info, err = os.Stat(path)
	if err != nil {
		t.Fatalf("database file not created: %v", err)
	}
	if perm := info.Mode().Perm(); perm != 0o600 {
		t.Errorf("database file permissions = %o, want 600", perm)
	}

	var foreignKeys int
	if err := db.QueryRow("PRAGMA foreign_keys").Scan(&foreignKeys); err != nil {
		t.Fatal(err)
	}
	if foreignKeys != 1 {
		t.Errorf("foreign_keys = %d, want 1", foreignKeys)
	}

	var table string
	err = db.QueryRow("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'preference'").Scan(&table)
	if err != nil {
		t.Errorf("migrations not applied: %v", err)
	}
}

func TestOpenIsIdempotent(t *testing.T) {
	path := filepath.Join(t.TempDir(), "tunmez.db")
	for range 2 {
		db, err := database.Open(context.Background(), path)
		if err != nil {
			t.Fatalf("Open: %v", err)
		}
		_ = db.Close()
	}
}
