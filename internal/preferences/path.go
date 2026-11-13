package preferences

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

// ConfigPath returns the settings file: tunmez/config.yaml in the user
// configuration directory ($XDG_CONFIG_HOME or ~/.config on Linux,
// ~/Library/Application Support on macOS, %AppData% on Windows).
func ConfigPath() (string, error) {
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", fmt.Errorf("locate configuration directory: %w", err)
	}
	return filepath.Join(dir, "tunmez", "config.yaml"), nil
}

// StatePath returns the session state file: tunmez/state.yaml in
// $XDG_STATE_HOME (or ~/.local/state) on Linux, next to the settings file on
// macOS and Windows.
func StatePath() (string, error) {
	dir, err := stateDir()
	if err != nil {
		return "", fmt.Errorf("locate state directory: %w", err)
	}
	return filepath.Join(dir, "tunmez", "state.yaml"), nil
}

func stateDir() (string, error) {
	if runtime.GOOS != "linux" {
		return os.UserConfigDir()
	}
	if dir := os.Getenv("XDG_STATE_HOME"); dir != "" {
		return dir, nil
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, ".local", "state"), nil
}
