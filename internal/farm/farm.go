// Package farm manages the farms a user works on. Farm-owned data (settings,
// plots, beds, tasks…) references a farm and is deleted with it.
package farm

import (
	"errors"
	"fmt"
	"strings"
	"unicode/utf8"
)

// MaxNameLength is the maximum number of characters in a farm name.
const MaxNameLength = 255

// Farm is a market-gardening farm.
type Farm struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// Errors returned by the farm service and repositories.
var (
	ErrNotFound     = errors.New("farm not found")
	ErrNameRequired = errors.New("farm name is required")
	ErrNameTooLong  = fmt.Errorf("farm name exceeds %d characters", MaxNameLength)
)

// normaliseName trims name and checks it is a valid farm name.
func normaliseName(name string) (string, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return "", ErrNameRequired
	}
	if utf8.RuneCountInString(name) > MaxNameLength {
		return "", ErrNameTooLong
	}
	return name, nil
}
