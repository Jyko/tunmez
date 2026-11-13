package preferences

import "fmt"

// SettingsRepository persists the settings.
type SettingsRepository interface {
	// Load returns the stored settings, or defaults when none are stored.
	// On error it still returns defaults; an unreadable or invalid file is
	// reported as an *InvalidFileError.
	Load() (Settings, error)
	// Update applies fn to the stored settings and saves them. Invalid stored
	// settings are replaced by defaults first.
	Update(fn func(*Settings)) error
}

// StateRepository persists the session state, like SettingsRepository.
type StateRepository interface {
	Load() (State, error)
	Update(fn func(*State)) error
}

// InvalidFileError reports a preferences file that cannot be decoded or
// holds invalid values.
type InvalidFileError struct {
	Path string
	Err  error
}

func (e *InvalidFileError) Error() string {
	return fmt.Sprintf("invalid preferences file %s: %v", e.Path, e.Err)
}

func (e *InvalidFileError) Unwrap() error { return e.Err }
