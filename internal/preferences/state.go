package preferences

import "fmt"

// State is the session state restored at startup, stored in state.yaml. The
// application writes it; it is not meant to be edited.
type State struct {
	Window     Window `yaml:"window"`
	ActiveFarm string `yaml:"active_farm,omitempty"`
}

// Window holds the main window geometry. X and Y are nil until a position
// has been saved.
type Window struct {
	Width     int  `json:"width" yaml:"width"`
	Height    int  `json:"height" yaml:"height"`
	X         *int `json:"x" yaml:"x,omitempty"`
	Y         *int `json:"y" yaml:"y,omitempty"`
	Maximised bool `json:"maximised" yaml:"maximised"`
}

// DefaultState returns the state used before anything is saved.
func DefaultState() State {
	return State{Window: Window{Width: 1280, Height: 800}}
}

func (s State) validate() error {
	return validateWindow(s.Window)
}

func validateWindow(w Window) error {
	if w.Width <= 0 || w.Height <= 0 {
		return fmt.Errorf("invalid window size %dx%d", w.Width, w.Height)
	}
	return nil
}
