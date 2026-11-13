//go:build linux

package database_test

import (
	"path/filepath"
	"testing"

	"github.com/Jyko/tunmez/internal/database"
)

func TestDefaultPathUsesXDGDataHome(t *testing.T) {
	t.Setenv("XDG_DATA_HOME", "/data")

	got, err := database.DefaultPath()
	if err != nil {
		t.Fatal(err)
	}
	if want := filepath.Join("/data", "tunmez", "tunmez.db"); got != want {
		t.Errorf("DefaultPath() = %q, want %q", got, want)
	}
}

func TestDefaultPathFallsBackToLocalShare(t *testing.T) {
	t.Setenv("XDG_DATA_HOME", "")
	t.Setenv("HOME", "/home/grower")

	got, err := database.DefaultPath()
	if err != nil {
		t.Fatal(err)
	}
	if want := filepath.Join("/home/grower", ".local", "share", "tunmez", "tunmez.db"); got != want {
		t.Errorf("DefaultPath() = %q, want %q", got, want)
	}
}
