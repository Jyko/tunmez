//go:build linux

package preferences_test

import (
	"path/filepath"
	"testing"

	"github.com/Jyko/tunmez/internal/preferences"
)

func TestPathsUseXDGDirectories(t *testing.T) {
	t.Setenv("XDG_CONFIG_HOME", "/config")
	t.Setenv("XDG_STATE_HOME", "/state")

	if got, _ := preferences.ConfigPath(); got != filepath.Join("/config", "tunmez", "config.yaml") {
		t.Errorf("ConfigPath() = %q", got)
	}
	if got, _ := preferences.StatePath(); got != filepath.Join("/state", "tunmez", "state.yaml") {
		t.Errorf("StatePath() = %q", got)
	}
}

func TestPathsFallBackToHome(t *testing.T) {
	t.Setenv("XDG_CONFIG_HOME", "")
	t.Setenv("XDG_STATE_HOME", "")
	t.Setenv("HOME", "/home/grower")

	if got, _ := preferences.ConfigPath(); got != filepath.Join("/home/grower", ".config", "tunmez", "config.yaml") {
		t.Errorf("ConfigPath() = %q", got)
	}
	if got, _ := preferences.StatePath(); got != filepath.Join("/home/grower", ".local", "state", "tunmez", "state.yaml") {
		t.Errorf("StatePath() = %q", got)
	}
}
