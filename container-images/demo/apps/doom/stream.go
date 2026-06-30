package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin:     func(r *http.Request) bool { return true },
	WriteBufferSize: 1 << 16,
}

// keyMap translates browser key names into X keysyms understood by xdotool.
// We use explicit left-modifier keysyms (Control_L/Shift_L) so xdotool treats
// them as ordinary key presses rather than latching logical modifiers.
var keyMap = map[string]string{
	// Movement: arrows + WASD.
	"ArrowUp":    "Up",
	"ArrowDown":  "Down",
	"ArrowLeft":  "Left",
	"ArrowRight": "Right",
	"w":          "Up",
	"a":          "comma", // strafe left (Doom default)
	"s":          "Down",
	"d":          "period", // strafe right (Doom default)

	// Actions.
	"Control": "Control_L", // fire
	"Space":   "space",     // use / open doors
	"Shift":   "Shift_L",   // run
	"Alt":     "Alt_L",     // strafe modifier
	"Enter":   "Return",    // menu select
	"Escape":  "Escape",    // menu
	"Tab":     "Tab",       // map

	"y": "y",
	"n": "n",
	"1": "1", "2": "2", "3": "3", "4": "4",
	"5": "5", "6": "6", "7": "7",
}

type inbound struct {
	Type string  `json:"type"` // "key" | "mousemove" | "mousebutton"
	Key  string  `json:"key"`
	Down bool    `json:"down"`
	DX   float64 `json:"dx"`     // relative mouse movement
	DY   float64 `json:"dy"`     //
	Btn  int     `json:"button"` // 1 left, 2 middle, 3 right
}

func handleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("ws upgrade: %v", err)
		return
	}
	defer conn.Close()

	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()

	var writeMu sync.Mutex

	// Reader goroutine: handle input events from the browser.
	go func() {
		for {
			_, raw, err := conn.ReadMessage()
			if err != nil {
				cancel()
				return
			}
			var in inbound
			if err := json.Unmarshal(raw, &in); err != nil {
				continue
			}
			switch in.Type {
			case "key":
				injectKey(in.Key, in.Down)
			case "mousemove":
				injectMouseMove(in.DX, in.DY)
			case "mousebutton":
				injectMouseButton(in.Btn, in.Down)
			}
		}
	}()

	// Writer: stream JPEG frames grabbed from the X display.
	if err := streamFrames(ctx, func(frame []byte) error {
		writeMu.Lock()
		defer writeMu.Unlock()
		return conn.WriteMessage(websocket.BinaryMessage, frame)
	}); err != nil && ctx.Err() == nil {
		log.Printf("stream ended: %v", err)
	}
}

// streamFrames runs ffmpeg x11grab and emits each JPEG frame via send().
func streamFrames(ctx context.Context, send func([]byte) error) error {
	cmd := exec.CommandContext(ctx, "ffmpeg",
		"-loglevel", "error",
		"-f", "x11grab",
		"-framerate", "20",
		"-video_size", fmt.Sprintf("%dx%d", screenW, screenH),
		"-i", display,
		"-f", "mjpeg",
		"-q:v", "7",
		"pipe:1",
	)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}
	if err := cmd.Start(); err != nil {
		return err
	}
	defer func() { _ = cmd.Process.Kill() }()

	// MJPEG is a stream of JPEGs; split on SOI (FFD8) / EOI (FFD9) markers.
	reader := bufio.NewReaderSize(stdout, 1<<20)
	var frame []byte
	var prev byte
	inFrame := false

	for {
		b, err := reader.ReadByte()
		if err != nil {
			return err
		}
		if !inFrame {
			if prev == 0xFF && b == 0xD8 {
				inFrame = true
				frame = []byte{0xFF, 0xD8}
			}
			prev = b
			continue
		}
		frame = append(frame, b)
		if prev == 0xFF && b == 0xD9 {
			// Complete JPEG frame.
			cp := make([]byte, len(frame))
			copy(cp, frame)
			if err := send(cp); err != nil {
				return err
			}
			inFrame = false
			frame = nil
		}
		prev = b
	}
}

// injectKey sends a keydown or keyup to the Doom window via xdotool.
//
// We target the window explicitly and deliberately omit --clearmodifiers:
// that flag temporarily releases/re-presses modifiers, which desynchronizes
// held keys (e.g. fire/Ctrl) and was causing keys to get "stuck" down.
func injectKey(name string, down bool) {
	keysym, ok := keyMap[name]
	if !ok {
		return
	}
	action := "keyup"
	if down {
		action = "keydown"
	}
	args := []string{action}
	if doomWindow != "" {
		args = append(args, "--window", doomWindow)
	}
	args = append(args, keysym)

	cmd := exec.Command("xdotool", args...)
	cmd.Env = append(cmd.Environ(), "DISPLAY="+display)
	_ = cmd.Run()
}

// injectMouseMove turns the player by moving the pointer relative to its
// current position. Doom reads horizontal mouse motion as turning.
func injectMouseMove(dx, dy float64) {
	if dx == 0 && dy == 0 {
		return
	}
	cmd := exec.Command("xdotool", "mousemove_relative", "--",
		fmt.Sprintf("%d", int(dx)), fmt.Sprintf("%d", int(dy)))
	cmd.Env = append(cmd.Environ(), "DISPLAY="+display)
	_ = cmd.Run()
}

// injectMouseButton presses or releases a mouse button (1=fire by default).
func injectMouseButton(btn int, down bool) {
	if btn < 1 || btn > 5 {
		return
	}
	action := "mouseup"
	if down {
		action = "mousedown"
	}
	args := []string{action}
	if doomWindow != "" {
		args = append(args, "--window", doomWindow)
	}
	args = append(args, fmt.Sprintf("%d", btn))

	cmd := exec.Command("xdotool", args...)
	cmd.Env = append(cmd.Environ(), "DISPLAY="+display)
	_ = cmd.Run()
}
