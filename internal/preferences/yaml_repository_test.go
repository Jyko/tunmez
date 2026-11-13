package preferences_test

import (
	"errors"
	"os"
	"strings"
	"testing"

	"github.com/Jyko/tunmez/internal/preferences"
)

func TestYAMLRepositoryMissingFileGivesDefaults(t *testing.T) {
	repo := preferences.NewSettingsRepository(newFiles(t).config)

	got, err := repo.Load()
	if err != nil || got != preferences.DefaultSettings() {
		t.Errorf("Load() = %+v, %v, want defaults", got, err)
	}
}

func TestYAMLRepositoryWritesReadableOwnerOnlyFile(t *testing.T) {
	path := newFiles(t).config
	repo := preferences.NewSettingsRepository(path)

	if err := repo.Update(func(s *preferences.Settings) { s.Locale, s.Theme = "en", preferences.ThemeDark }); err != nil {
		t.Fatal(err)
	}

	content := read(t, path)
	for _, want := range []string{"# tunmez settings.", "locale: en\n", "theme: dark\n"} {
		if !strings.Contains(content, want) {
			t.Errorf("file does not contain %q:\n%s", want, content)
		}
	}
	info, err := os.Stat(path)
	if err != nil {
		t.Fatal(err)
	}
	if mode := info.Mode().Perm(); mode != 0o600 {
		t.Errorf("file mode = %o, want 600", mode)
	}
	if got, _ := repo.Load(); got.Locale != "en" || got.Theme != preferences.ThemeDark {
		t.Errorf("Load() = %+v, want en and dark", got)
	}
}

func TestYAMLRepositoryKeepsDefaultsForMissingKeys(t *testing.T) {
	path := newFiles(t).config
	write(t, path, "locale: fr-FR\n")

	got, err := preferences.NewSettingsRepository(path).Load()
	if err != nil || got != (preferences.Settings{Locale: "fr-FR", Theme: preferences.ThemeSystem, Contrast: preferences.ContrastStandard}) {
		t.Errorf("Load() = %+v, %v, want fr-FR with the system theme and standard contrast", got, err)
	}
}

func TestYAMLRepositoryReportsInvalidFiles(t *testing.T) {
	for name, content := range map[string]string{
		"syntax":         "theme: [dark\n",
		"wrong value":    "theme: sepia\n",
		"wrong contrast": "contrast: extreme\n",
		"wrong type":     "locale: [en]\n",
	} {
		t.Run(name, func(t *testing.T) {
			path := newFiles(t).config
			write(t, path, content)

			got, err := preferences.NewSettingsRepository(path).Load()
			var invalid *preferences.InvalidFileError
			if !errors.As(err, &invalid) || invalid.Path != path {
				t.Errorf("Load(): err = %v, want an InvalidFileError for %s", err, path)
			}
			if got != preferences.DefaultSettings() {
				t.Errorf("Load() = %+v, want defaults", got)
			}
			if read(t, path) != content {
				t.Error("Load() changed an invalid file")
			}
		})
	}
}

func TestYAMLRepositoryUpdateReplacesInvalidFile(t *testing.T) {
	path := newFiles(t).config
	write(t, path, "theme: sepia\nlocale: en\n")
	repo := preferences.NewSettingsRepository(path)

	if err := repo.Update(func(s *preferences.Settings) { s.Theme = preferences.ThemeLight }); err != nil {
		t.Fatal(err)
	}
	if got, err := repo.Load(); err != nil || got != (preferences.Settings{Theme: preferences.ThemeLight, Contrast: preferences.ContrastStandard}) {
		t.Errorf("Load() = %+v, %v, want defaults with the light theme", got, err)
	}
}

func TestYAMLRepositoryEmptyFileGivesDefaults(t *testing.T) {
	path := newFiles(t).state
	write(t, path, "")

	got, err := preferences.NewStateRepository(path).Load()
	if err != nil || got.Window != preferences.DefaultState().Window {
		t.Errorf("Load() = %+v, %v, want defaults", got, err)
	}
}

func TestYAMLRepositoryCommentOnlyFileGivesDefaults(t *testing.T) {
	path := newFiles(t).config
	write(t, path, "# theme: dark\n")

	got, err := preferences.NewSettingsRepository(path).Load()
	if err != nil || got != preferences.DefaultSettings() {
		t.Errorf("Load() = %+v, %v, want defaults", got, err)
	}
}
