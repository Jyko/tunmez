package preferences

import (
	"context"
	"errors"
	"log"
)

// Display holds the display preferences.
type Display struct {
	// Locale is the interface language, or empty to follow the host.
	Locale string `json:"locale"`
	Theme  Theme  `json:"theme"`
	Window Window `json:"window"`
	// InvalidConfig is the path of the settings file when it is invalid and
	// defaults are used instead, or empty.
	InvalidConfig string `json:"invalidConfig"`
}

// DisplayService reads and updates the display preferences.
type DisplayService struct {
	settings SettingsRepository
	state    StateRepository
}

// NewDisplayService returns a DisplayService backed by settings and state.
func NewDisplayService(settings SettingsRepository, state StateRepository) *DisplayService {
	return &DisplayService{settings: settings, state: state}
}

// Get returns the display preferences. Unreadable files are logged and
// replaced by defaults so the application always starts.
func (s *DisplayService) Get(context.Context) Display {
	var d Display
	settings, err := s.settings.Load()
	if err != nil {
		log.Printf("load settings: %v", err)
		var invalid *InvalidFileError
		if errors.As(err, &invalid) {
			d.InvalidConfig = invalid.Path
		}
	}
	state, err := s.state.Load()
	if err != nil {
		log.Printf("load session state: %v", err)
	}
	d.Locale, d.Theme, d.Window = settings.Locale, settings.Theme, state.Window
	return d
}

// SetLocale sets the interface language. An empty locale follows the host.
func (s *DisplayService) SetLocale(_ context.Context, locale string) error {
	if locale != "" {
		if err := validateLocale(locale); err != nil {
			return err
		}
	}
	return s.settings.Update(func(st *Settings) { st.Locale = locale })
}

// SetTheme sets the colour theme. ThemeSystem follows the host.
func (s *DisplayService) SetTheme(_ context.Context, theme Theme) error {
	if err := validateTheme(theme); err != nil {
		return err
	}
	return s.settings.Update(func(st *Settings) { st.Theme = theme })
}

// SaveWindow records the main window geometry. When the window is maximised,
// only that state is recorded so the last normal size and position are kept.
func (s *DisplayService) SaveWindow(_ context.Context, w Window) error {
	if err := validateWindow(w); err != nil {
		return err
	}
	return s.state.Update(func(st *State) {
		if w.Maximised {
			st.Window.Maximised = true
			return
		}
		st.Window = w
	})
}
