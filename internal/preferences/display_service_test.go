package preferences_test

import (
	"context"
	"errors"
	"io/fs"
	"os"
	"reflect"
	"strings"
	"testing"

	"github.com/Jyko/tunmez/internal/preferences"
)

func TestDisplayServiceGetDefaults(t *testing.T) {
	got := newFiles(t).display().Get(context.Background())

	want := preferences.Display{Theme: preferences.ThemeSystem, Window: preferences.DefaultState().Window}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("Get() = %+v, want %+v", got, want)
	}
}

func TestDisplayServiceGetReportsInvalidConfig(t *testing.T) {
	f := newFiles(t)
	write(t, f.config, "theme: sepia\n")

	got := f.display().Get(context.Background())
	if got.InvalidConfig != f.config || got.Theme != preferences.ThemeSystem {
		t.Errorf("Get() = %+v, want defaults and InvalidConfig %s", got, f.config)
	}
}

func TestDisplayServiceGetIgnoresInvalidState(t *testing.T) {
	f := newFiles(t)
	write(t, f.state, "window: {width: 0, height: 0}\n")

	got := f.display().Get(context.Background())
	if got.Window != preferences.DefaultState().Window || got.InvalidConfig != "" {
		t.Errorf("Get() = %+v, want the default window and no config error", got)
	}
}

func TestDisplayServiceSetLocale(t *testing.T) {
	ctx := context.Background()
	f := newFiles(t)
	svc := f.display()

	if err := svc.SetLocale(ctx, "en"); err != nil {
		t.Fatal(err)
	}
	if got := svc.Get(ctx); got.Locale != "en" {
		t.Errorf("Locale = %q, want en", got.Locale)
	}
	if err := svc.SetLocale(ctx, ""); err != nil {
		t.Fatal(err)
	}
	if strings.Contains(read(t, f.config), "\nlocale:") {
		t.Error("empty locale kept a locale key, want it removed to follow the host")
	}
	if err := svc.SetLocale(ctx, "de-DE"); err == nil {
		t.Error("SetLocale(de-DE): err = nil, want an error")
	}
}

func TestDisplayServiceSetTheme(t *testing.T) {
	ctx := context.Background()
	svc := newFiles(t).display()

	if err := svc.SetTheme(ctx, preferences.ThemeDark); err != nil {
		t.Fatal(err)
	}
	if got := svc.Get(ctx); got.Theme != preferences.ThemeDark {
		t.Errorf("Theme = %q, want dark", got.Theme)
	}
	if err := svc.SetTheme(ctx, "sepia"); err == nil {
		t.Error("SetTheme(sepia): err = nil, want an error")
	}
}

func TestDisplayServiceSaveWindow(t *testing.T) {
	ctx := context.Background()
	f := newFiles(t)
	svc := f.display()

	normal := preferences.Window{Width: 1024, Height: 700, X: new(10), Y: new(20)}
	if err := svc.SaveWindow(ctx, normal); err != nil {
		t.Fatal(err)
	}
	if got := svc.Get(ctx); !reflect.DeepEqual(got.Window, normal) {
		t.Errorf("Window = %+v, want %+v", got.Window, normal)
	}

	// A maximised window keeps the last normal size and position.
	if err := svc.SaveWindow(ctx, preferences.Window{Width: 1920, Height: 1080, Maximised: true}); err != nil {
		t.Fatal(err)
	}
	want := normal
	want.Maximised = true
	if got := svc.Get(ctx); !reflect.DeepEqual(got.Window, want) {
		t.Errorf("Window = %+v, want %+v", got.Window, want)
	}
	if _, err := os.Stat(f.config); !errors.Is(err, fs.ErrNotExist) {
		t.Errorf("settings file written with the window geometry: %v, want it untouched", err)
	}

	if err := svc.SaveWindow(ctx, preferences.Window{Width: 0, Height: 700}); err == nil {
		t.Error("SaveWindow with zero width: err = nil, want an error")
	}
}
