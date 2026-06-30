package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"time"
)

const (
	display = ":99"
	// Classic Doom renders at a 4:3 aspect ratio. Using a 4:3 framebuffer
	// (640x480) avoids the pillarbox black bars chocolate-doom would otherwise
	// add when given a 16:10 window.
	screenW = 640
	screenH = 480
)

// doomWindow holds the X window id of the Doom window, used to target input.
var doomWindow string

// startEngine boots a virtual X server and launches the Doom engine inside it.
// Both processes live for the lifetime of the container.
func startEngine() error {
	_ = os.Setenv("DISPLAY", display)

	// 1. Virtual framebuffer X server.
	xvfb := exec.Command("Xvfb", display,
		"-screen", "0", fmt.Sprintf("%dx%dx24", screenW, screenH),
		"-nolisten", "tcp")
	xvfb.Stderr = os.Stderr
	if err := xvfb.Start(); err != nil {
		return fmt.Errorf("Xvfb: %w", err)
	}
	go func() { _ = xvfb.Wait() }()

	// Give Xvfb a moment to create the display socket.
	if err := waitForDisplay(5 * time.Second); err != nil {
		return err
	}

	// 2. Launch chocolate-doom with the FreeDOOM IWAD, windowed at full screen.
	wad := os.Getenv("DOOM_WAD")
	if wad == "" {
		wad = "/usr/share/games/doom/freedoom1.wad"
	}
	// The Debian package installs the binary under /usr/games, which is not on
	// the default PATH for the Go process.
	doomBin := os.Getenv("DOOM_BIN")
	if doomBin == "" {
		doomBin = "/usr/games/chocolate-doom"
	}
	doom := exec.Command(doomBin,
		"-iwad", wad,
		"-window",
		"-geometry", fmt.Sprintf("%dx%d", screenW, screenH),
		"-grabmouse",
		"-nomusic",
	)
	doom.Env = append(os.Environ(),
		"DISPLAY="+display,
		// SDL audio off; there is no sound card in the container.
		"SDL_AUDIODRIVER=dummy",
	)
	doom.Stderr = os.Stderr
	if err := doom.Start(); err != nil {
		return fmt.Errorf("chocolate-doom: %w", err)
	}
	go func() {
		if err := doom.Wait(); err != nil {
			log.Printf("doom exited: %v", err)
		}
	}()

	// Let Doom create its window before we start grabbing frames.
	time.Sleep(2 * time.Second)

	// Resolve and focus the Doom window so injected input is delivered to it.
	doomWindow = findDoomWindow()
	if doomWindow != "" {
		_ = run("xdotool", "windowactivate", "--sync", doomWindow)
		_ = run("xdotool", "windowfocus", doomWindow)
		log.Printf("doom window id: %s", doomWindow)
	} else {
		log.Printf("warning: could not resolve doom window id; input may not focus")
	}

	log.Printf("doom engine running on display %s (%dx%d)", display, screenW, screenH)
	return nil
}

// findDoomWindow searches for the chocolate-doom window by class/name.
func findDoomWindow() string {
	// Try a few search strategies; chocolate-doom titles its window "Chocolate Doom".
	for _, args := range [][]string{
		{"search", "--name", "Chocolate Doom"},
		{"search", "--class", "chocolate-doom"},
		{"search", "--name", "Doom"},
	} {
		out, err := output("xdotool", args...)
		if err == nil {
			if id := firstLine(out); id != "" {
				return id
			}
		}
	}
	return ""
}

// run executes a command on the Doom display, ignoring stdout.
func run(name string, args ...string) error {
	cmd := exec.Command(name, args...)
	cmd.Env = append(os.Environ(), "DISPLAY="+display)
	return cmd.Run()
}

// output executes a command on the Doom display and returns trimmed stdout.
func output(name string, args ...string) (string, error) {
	cmd := exec.Command(name, args...)
	cmd.Env = append(os.Environ(), "DISPLAY="+display)
	b, err := cmd.Output()
	return string(b), err
}

func firstLine(s string) string {
	for _, line := range splitLines(s) {
		if line != "" {
			return line
		}
	}
	return ""
}

func splitLines(s string) []string {
	var out []string
	cur := ""
	for _, r := range s {
		if r == '\n' || r == '\r' {
			out = append(out, cur)
			cur = ""
			continue
		}
		cur += string(r)
	}
	out = append(out, cur)
	return out
}

// waitForDisplay blocks until the X11 socket for the display exists.
func waitForDisplay(timeout time.Duration) error {
	deadline := time.Now().Add(timeout)
	sock := "/tmp/.X11-unix/X99"
	for time.Now().Before(deadline) {
		if _, err := os.Stat(sock); err == nil {
			return nil
		}
		time.Sleep(100 * time.Millisecond)
	}
	return fmt.Errorf("X display %s did not become ready", display)
}
