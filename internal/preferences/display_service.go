package preferences

import (
	"context"
	"fmt"
)

// DisplayService reads and updates the display preferences.
type DisplayService struct {
	entries EntryRepository
}

// NewDisplayService returns a DisplayService backed by entries.
func NewDisplayService(entries EntryRepository) *DisplayService {
	return &DisplayService{entries: entries}
}

// Get returns the display preferences, with defaults for unset keys.
func (s *DisplayService) Get(ctx context.Context) (Display, error) {
	entries, err := s.entries.List(ctx)
	if err != nil {
		return Display{}, fmt.Errorf("list preferences: %w", err)
	}
	d := DefaultDisplay()
	for _, e := range entries {
		if err := d.apply(e); err != nil {
			return Display{}, err
		}
	}
	return d, nil
}

// SetLocale sets the interface language. An empty locale follows the host.
func (s *DisplayService) SetLocale(ctx context.Context, locale string) error {
	if locale == "" {
		return s.entries.Delete(ctx, KeyLocale)
	}
	if err := validateLocale(locale); err != nil {
		return err
	}
	return s.entries.Upsert(ctx, stringEntry(KeyLocale, locale))
}

// SetTheme sets the colour theme. ThemeSystem follows the host.
func (s *DisplayService) SetTheme(ctx context.Context, theme Theme) error {
	if err := validateTheme(theme); err != nil {
		return err
	}
	if theme == ThemeSystem {
		return s.entries.Delete(ctx, KeyTheme)
	}
	return s.entries.Upsert(ctx, stringEntry(KeyTheme, string(theme)))
}

// SaveWindow records the main window geometry. When the window is maximised,
// only that state is recorded so the last normal size and position are kept.
func (s *DisplayService) SaveWindow(ctx context.Context, w Window) error {
	if err := validateWindow(w); err != nil {
		return err
	}
	if err := s.entries.Upsert(ctx, boolEntry(KeyWindowMaximised, w.Maximised)); err != nil {
		return err
	}
	if w.Maximised {
		return nil
	}
	for _, e := range []Entry{intEntry(KeyWindowWidth, w.Width), intEntry(KeyWindowHeight, w.Height)} {
		if err := s.entries.Upsert(ctx, e); err != nil {
			return err
		}
	}
	return s.savePosition(ctx, w.X, w.Y)
}

func (s *DisplayService) savePosition(ctx context.Context, x, y *int) error {
	if x == nil || y == nil {
		if err := s.entries.Delete(ctx, KeyWindowX); err != nil {
			return err
		}
		return s.entries.Delete(ctx, KeyWindowY)
	}
	if err := s.entries.Upsert(ctx, intEntry(KeyWindowX, *x)); err != nil {
		return err
	}
	return s.entries.Upsert(ctx, intEntry(KeyWindowY, *y))
}

// apply sets the field matching e, ignoring unknown keys left by other versions.
func (d *Display) apply(e Entry) error {
	if _, known := registry[e.Key]; !known {
		return nil
	}
	if err := checkType(e); err != nil {
		return err
	}
	var err error
	switch e.Key {
	case KeyLocale:
		d.Locale = e.Value
	case KeyTheme:
		d.Theme = Theme(e.Value)
	case KeyWindowWidth:
		d.Window.Width, err = e.int()
	case KeyWindowHeight:
		d.Window.Height, err = e.int()
	case KeyWindowX:
		d.Window.X, err = intPtr(e)
	case KeyWindowY:
		d.Window.Y, err = intPtr(e)
	case KeyWindowMaximised:
		d.Window.Maximised, err = e.bool()
	}
	return err
}

func intPtr(e Entry) (*int, error) {
	v, err := e.int()
	if err != nil {
		return nil, err
	}
	return new(v), nil
}
