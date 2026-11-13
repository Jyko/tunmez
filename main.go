// Command tunmez is a crop rotation planner for market-gardening farms.
package main

import (
	"context"
	"embed"
	"log"

	"github.com/wailsapp/wails/v3/pkg/application"
	"github.com/wailsapp/wails/v3/pkg/events"

	"github.com/Jyko/tunmez/internal/database"
	"github.com/Jyko/tunmez/internal/farm"
	"github.com/Jyko/tunmez/internal/preferences"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	if err := run(context.Background()); err != nil {
		log.Fatal(err)
	}
}

func run(ctx context.Context) error {
	path, err := database.DefaultPath()
	if err != nil {
		return err
	}
	db, err := database.Open(ctx, path)
	if err != nil {
		return err
	}
	defer func() { _ = db.Close() }()

	configPath, err := preferences.ConfigPath()
	if err != nil {
		return err
	}
	statePath, err := preferences.StatePath()
	if err != nil {
		return err
	}
	state := preferences.NewStateRepository(statePath)
	display := preferences.NewDisplayService(preferences.NewSettingsRepository(configPath), state)
	farms := farm.NewService(farm.NewSQLiteRepository(db), preferences.NewActiveFarmRepository(state))
	prefs := display.Get(ctx)

	app := application.New(application.Options{
		Name:        "tunmez",
		Description: "Crop rotation planner for market-gardening farms",
		Services: []application.Service{
			application.NewService(display),
			application.NewService(farms),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	window := app.Window.NewWithOptions(windowOptions(prefs.Window))
	window.RegisterHook(events.Common.WindowClosing, func(*application.WindowEvent) {
		if err := display.SaveWindow(ctx, currentWindow(window)); err != nil {
			log.Printf("save window preferences: %v", err)
		}
	})

	return app.Run()
}

// windowOptions builds the main window options from the saved geometry.
func windowOptions(w preferences.Window) application.WebviewWindowOptions {
	opts := application.WebviewWindowOptions{
		Title:  "tunmez",
		Width:  w.Width,
		Height: w.Height,
		URL:    "/",
	}
	if w.X != nil && w.Y != nil {
		opts.InitialPosition = application.WindowXY
		opts.X, opts.Y = *w.X, *w.Y
	}
	if w.Maximised {
		opts.StartState = application.WindowStateMaximised
	}
	return opts
}

// currentWindow reads the geometry of window.
func currentWindow(window *application.WebviewWindow) preferences.Window {
	width, height := window.Size()
	x, y := window.RelativePosition()
	return preferences.Window{
		Width:     width,
		Height:    height,
		X:         &x,
		Y:         &y,
		Maximised: window.IsMaximised(),
	}
}
