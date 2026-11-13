package preferences_test

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/Jyko/tunmez/internal/preferences"
)

type files struct {
	config, state string
}

func newFiles(t *testing.T) files {
	t.Helper()
	dir := t.TempDir()
	return files{config: filepath.Join(dir, "config", "config.yaml"), state: filepath.Join(dir, "state", "state.yaml")}
}

func (f files) display() *preferences.DisplayService {
	return preferences.NewDisplayService(preferences.NewSettingsRepository(f.config), preferences.NewStateRepository(f.state))
}

func write(t *testing.T, path, content string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
}

func read(t *testing.T, path string) string {
	t.Helper()
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}
