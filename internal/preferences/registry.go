package preferences

import (
	"fmt"
	"strconv"
)

// Key identifies a preference.
type Key string

// Known preference keys. A missing display or window key takes its default
// from DefaultDisplay; a missing KeyActiveFarm means no farm is active.
const (
	KeyLocale          Key = "display.locale"
	KeyTheme           Key = "display.theme"
	KeyWindowWidth     Key = "window.width"
	KeyWindowHeight    Key = "window.height"
	KeyWindowX         Key = "window.x"
	KeyWindowY         Key = "window.y"
	KeyWindowMaximised Key = "window.maximised"
	KeyActiveFarm      Key = "farm.active"
)

// registry declares the value type of every known key.
var registry = map[Key]Type{
	KeyLocale:          TypeString,
	KeyTheme:           TypeString,
	KeyWindowWidth:     TypeInt,
	KeyWindowHeight:    TypeInt,
	KeyWindowX:         TypeInt,
	KeyWindowY:         TypeInt,
	KeyWindowMaximised: TypeBool,
	KeyActiveFarm:      TypeString,
}

func stringEntry(key Key, v string) Entry { return Entry{Key: key, Value: v, Type: TypeString} }

func intEntry(key Key, v int) Entry { return Entry{Key: key, Value: strconv.Itoa(v), Type: TypeInt} }

func boolEntry(key Key, v bool) Entry {
	return Entry{Key: key, Value: strconv.FormatBool(v), Type: TypeBool}
}

// checkType reports an error when e does not match its declared type.
func checkType(e Entry) error {
	want, ok := registry[e.Key]
	if !ok {
		return fmt.Errorf("unknown preference key %q", e.Key)
	}
	if e.Type != want {
		return fmt.Errorf("preference %q has type %q, want %q", e.Key, e.Type, want)
	}
	return nil
}

func (e Entry) int() (int, error) {
	v, err := strconv.Atoi(e.Value)
	if err != nil {
		return 0, fmt.Errorf("preference %q: %w", e.Key, err)
	}
	return v, nil
}

func (e Entry) bool() (bool, error) {
	v, err := strconv.ParseBool(e.Value)
	if err != nil {
		return false, fmt.Errorf("preference %q: %w", e.Key, err)
	}
	return v, nil
}
