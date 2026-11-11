package database

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

// DefaultPath returns the location of the database file in the user's data
// directory: $XDG_DATA_HOME (or ~/.local/share) on Linux, and the user
// configuration directory on macOS and Windows.
func DefaultPath() (string, error) {
	dir, err := dataDir()
	if err != nil {
		return "", fmt.Errorf("locate data directory: %w", err)
	}
	return filepath.Join(dir, "tunmez", "tunmez.db"), nil
}

func dataDir() (string, error) {
	if runtime.GOOS != "linux" {
		return os.UserConfigDir()
	}
	if dir := os.Getenv("XDG_DATA_HOME"); dir != "" {
		return dir, nil
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, ".local", "share"), nil
}
