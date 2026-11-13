// Package preferences stores the user's preferences in YAML files in their
// profile: settings they may edit by hand, and the session state the
// application restores at startup.
package preferences

import (
	"fmt"
	"slices"
)

// Theme is the colour theme of the interface.
type Theme string

// Available themes. ThemeSystem follows the host setting. ThemeDarkDimmed
// is a dark theme with lower contrast (Primer's dark_dimmed).
const (
	ThemeSystem     Theme = "system"
	ThemeLight      Theme = "light"
	ThemeDark       Theme = "dark"
	ThemeDarkDimmed Theme = "dark-dimmed"
)

// Contrast is the contrast level of the theme.
type Contrast string

// Available contrast levels. ContrastHigh uses the high contrast variant of
// the theme.
const (
	ContrastStandard Contrast = "standard"
	ContrastHigh     Contrast = "high"
)

// supportedLocales lists the interface languages. An empty locale follows the host.
var supportedLocales = []string{"fr-FR", "en", "br"}

// Settings are the user's choices, stored in config.yaml.
type Settings struct {
	// Locale is the interface language, or empty to follow the host.
	Locale   string   `yaml:"locale,omitempty"`
	Theme    Theme    `yaml:"theme"`
	Contrast Contrast `yaml:"contrast"`
}

// DefaultSettings returns the settings used before any choice is saved.
func DefaultSettings() Settings {
	return Settings{Theme: ThemeSystem, Contrast: ContrastStandard}
}

func (s Settings) validate() error {
	if s.Locale != "" {
		if err := validateLocale(s.Locale); err != nil {
			return err
		}
	}
	if err := validateTheme(s.Theme); err != nil {
		return err
	}
	return validateContrast(s.Contrast)
}

func validateLocale(locale string) error {
	if !slices.Contains(supportedLocales, locale) {
		return fmt.Errorf("unsupported locale %q", locale)
	}
	return nil
}

func validateTheme(theme Theme) error {
	switch theme {
	case ThemeSystem, ThemeLight, ThemeDark, ThemeDarkDimmed:
		return nil
	}
	return fmt.Errorf("unsupported theme %q", theme)
}

func validateContrast(contrast Contrast) error {
	switch contrast {
	case ContrastStandard, ContrastHigh:
		return nil
	}
	return fmt.Errorf("unsupported contrast %q", contrast)
}
