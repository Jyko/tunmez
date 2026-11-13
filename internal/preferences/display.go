package preferences

import (
	"fmt"
	"slices"
)

// Theme is the colour theme of the interface.
type Theme string

// Available themes. ThemeSystem follows the host setting.
const (
	ThemeSystem Theme = "system"
	ThemeLight  Theme = "light"
	ThemeDark   Theme = "dark"
)

// supportedLocales lists the interface languages. An empty locale follows the host.
var supportedLocales = []string{"fr-FR", "en"}

// Display holds the display preferences.
type Display struct {
	// Locale is the interface language, or empty to follow the host.
	Locale string `json:"locale"`
	Theme  Theme  `json:"theme"`
	Window Window `json:"window"`
}

// Window holds the main window geometry. X and Y are nil until a position
// has been saved.
type Window struct {
	Width     int  `json:"width"`
	Height    int  `json:"height"`
	X         *int `json:"x"`
	Y         *int `json:"y"`
	Maximised bool `json:"maximised"`
}

// DefaultDisplay returns the display preferences used before any choice is saved.
func DefaultDisplay() Display {
	return Display{
		Theme:  ThemeSystem,
		Window: Window{Width: 1280, Height: 800},
	}
}

func validateLocale(locale string) error {
	if !slices.Contains(supportedLocales, locale) {
		return fmt.Errorf("unsupported locale %q", locale)
	}
	return nil
}

func validateTheme(theme Theme) error {
	switch theme {
	case ThemeSystem, ThemeLight, ThemeDark:
		return nil
	}
	return fmt.Errorf("unsupported theme %q", theme)
}

func validateWindow(w Window) error {
	if w.Width <= 0 || w.Height <= 0 {
		return fmt.Errorf("invalid window size %dx%d", w.Width, w.Height)
	}
	return nil
}
