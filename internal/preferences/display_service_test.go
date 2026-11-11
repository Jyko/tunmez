package preferences_test

import (
	"context"
	"reflect"
	"testing"

	"github.com/Jyko/tunmez/internal/preferences"
)

// memoryRepository is an in-memory EntryRepository for service tests.
type memoryRepository map[preferences.Key]preferences.Entry

func (m memoryRepository) Get(_ context.Context, key preferences.Key) (preferences.Entry, error) {
	e, ok := m[key]
	if !ok {
		return preferences.Entry{}, preferences.ErrEntryNotFound
	}
	return e, nil
}

func (m memoryRepository) List(context.Context) ([]preferences.Entry, error) {
	entries := make([]preferences.Entry, 0, len(m))
	for _, e := range m {
		entries = append(entries, e)
	}
	return entries, nil
}

func (m memoryRepository) Upsert(_ context.Context, e preferences.Entry) error {
	m[e.Key] = e
	return nil
}

func (m memoryRepository) Delete(_ context.Context, key preferences.Key) error {
	delete(m, key)
	return nil
}

func TestDisplayServiceGetDefaults(t *testing.T) {
	svc := preferences.NewDisplayService(memoryRepository{})

	got, err := svc.Get(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if want := preferences.DefaultDisplay(); !reflect.DeepEqual(got, want) {
		t.Errorf("Get() = %+v, want defaults %+v", got, want)
	}
}

func TestDisplayServiceGetRejectsTypeMismatch(t *testing.T) {
	repo := memoryRepository{preferences.KeyWindowWidth: {Key: preferences.KeyWindowWidth, Value: "1024", Type: preferences.TypeString}}
	svc := preferences.NewDisplayService(repo)

	if _, err := svc.Get(context.Background()); err == nil {
		t.Error("Get() with a mistyped entry: err = nil, want an error")
	}
}

func TestDisplayServiceSetLocale(t *testing.T) {
	ctx := context.Background()
	repo := memoryRepository{}
	svc := preferences.NewDisplayService(repo)

	if err := svc.SetLocale(ctx, "en"); err != nil {
		t.Fatal(err)
	}
	if got, _ := svc.Get(ctx); got.Locale != "en" {
		t.Errorf("Locale = %q, want en", got.Locale)
	}

	if err := svc.SetLocale(ctx, ""); err != nil {
		t.Fatal(err)
	}
	if _, ok := repo[preferences.KeyLocale]; ok {
		t.Error("empty locale kept an entry, want it deleted to follow the host")
	}

	if err := svc.SetLocale(ctx, "de-DE"); err == nil {
		t.Error("SetLocale(de-DE): err = nil, want an error")
	}
}

func TestDisplayServiceSetTheme(t *testing.T) {
	ctx := context.Background()
	repo := memoryRepository{}
	svc := preferences.NewDisplayService(repo)

	if err := svc.SetTheme(ctx, preferences.ThemeDark); err != nil {
		t.Fatal(err)
	}
	if got, _ := svc.Get(ctx); got.Theme != preferences.ThemeDark {
		t.Errorf("Theme = %q, want dark", got.Theme)
	}

	if err := svc.SetTheme(ctx, preferences.ThemeSystem); err != nil {
		t.Fatal(err)
	}
	if _, ok := repo[preferences.KeyTheme]; ok {
		t.Error("system theme kept an entry, want it deleted")
	}

	if err := svc.SetTheme(ctx, "sepia"); err == nil {
		t.Error("SetTheme(sepia): err = nil, want an error")
	}
}

func TestDisplayServiceSaveWindow(t *testing.T) {
	ctx := context.Background()
	svc := preferences.NewDisplayService(memoryRepository{})

	normal := preferences.Window{Width: 1024, Height: 700, X: new(10), Y: new(20)}
	if err := svc.SaveWindow(ctx, normal); err != nil {
		t.Fatal(err)
	}
	if got, _ := svc.Get(ctx); !reflect.DeepEqual(got.Window, normal) {
		t.Errorf("Window = %+v, want %+v", got.Window, normal)
	}

	// A maximised window keeps the last normal size and position.
	if err := svc.SaveWindow(ctx, preferences.Window{Width: 1920, Height: 1080, Maximised: true}); err != nil {
		t.Fatal(err)
	}
	want := normal
	want.Maximised = true
	if got, _ := svc.Get(ctx); !reflect.DeepEqual(got.Window, want) {
		t.Errorf("Window = %+v, want %+v", got.Window, want)
	}

	if err := svc.SaveWindow(ctx, preferences.Window{Width: 0, Height: 700}); err == nil {
		t.Error("SaveWindow with zero width: err = nil, want an error")
	}
}
