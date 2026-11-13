package preferences

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sync"

	"github.com/goccy/go-yaml"
)

const settingsHeader = `# tunmez settings. Edit them while tunmez is closed.
# locale: fr-FR, en or br. Remove the line to follow the system language.
# theme: system, light, dark or dark-dimmed.
# contrast: standard or high.
`

const stateHeader = `# tunmez session state, written by the application. Do not edit.
`

// YAMLRepository stores a value of type T in an owner-only YAML file.
type YAMLRepository[T any] struct {
	path     string
	header   string
	defaults func() T
	validate func(T) error
	mu       sync.Mutex
}

// NewSettingsRepository returns a settings repository backed by the file at path.
func NewSettingsRepository(path string) *YAMLRepository[Settings] {
	return &YAMLRepository[Settings]{path: path, header: settingsHeader, defaults: DefaultSettings, validate: Settings.validate}
}

// NewStateRepository returns a state repository backed by the file at path.
func NewStateRepository(path string) *YAMLRepository[State] {
	return &YAMLRepository[State]{path: path, header: stateHeader, defaults: DefaultState, validate: State.validate}
}

// Load returns the stored value, or defaults when the file does not exist.
// On error it returns defaults with the error; an undecodable or invalid file
// gives an *InvalidFileError.
func (r *YAMLRepository[T]) Load() (T, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.load()
}

// Update applies fn to the stored value and saves it. An invalid file is
// replaced, starting from defaults.
func (r *YAMLRepository[T]) Update(fn func(*T)) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	v, err := r.load()
	var invalid *InvalidFileError
	if err != nil && !errors.As(err, &invalid) {
		return err
	}
	fn(&v)
	return r.save(v)
}

func (r *YAMLRepository[T]) load() (T, error) {
	v := r.defaults()
	data, err := os.ReadFile(r.path)
	if errors.Is(err, fs.ErrNotExist) {
		return v, nil
	}
	if err != nil {
		return v, fmt.Errorf("read %s: %w", r.path, err)
	}
	// An empty or comment-only file decodes to null, which would zero v.
	var doc any
	if err := yaml.Unmarshal(data, &doc); err != nil {
		return v, &InvalidFileError{Path: r.path, Err: err}
	}
	if doc == nil {
		return v, nil
	}
	// Keys missing from the file keep their default values.
	if err := yaml.Unmarshal(data, &v); err != nil {
		return r.defaults(), &InvalidFileError{Path: r.path, Err: err}
	}
	if err := r.validate(v); err != nil {
		return r.defaults(), &InvalidFileError{Path: r.path, Err: err}
	}
	return v, nil
}

// save writes v to a temporary file renamed over the target, so a crash never
// leaves a truncated file.
func (r *YAMLRepository[T]) save(v T) error {
	data, err := yaml.Marshal(v)
	if err != nil {
		return fmt.Errorf("encode %s: %w", r.path, err)
	}
	dir := filepath.Dir(r.path)
	if err := os.MkdirAll(dir, 0o700); err != nil {
		return fmt.Errorf("create %s: %w", dir, err)
	}
	f, err := os.CreateTemp(dir, "."+filepath.Base(r.path)+"-*") // owner-only (0600)
	if err != nil {
		return fmt.Errorf("save %s: %w", r.path, err)
	}
	defer func() { _ = os.Remove(f.Name()) }()
	_, err = f.WriteString(r.header)
	if err == nil {
		_, err = f.Write(data)
	}
	if err == nil {
		err = f.Sync()
	}
	if closeErr := f.Close(); err == nil {
		err = closeErr
	}
	if err == nil {
		err = os.Rename(f.Name(), r.path)
	}
	if err != nil {
		return fmt.Errorf("save %s: %w", r.path, err)
	}
	return nil
}
