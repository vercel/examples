package main

import (
	"context"
	_ "embed"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
	"github.com/gorilla/websocket"
)

//go:embed index.html
var indexHTML []byte

// allocCtx is a long-lived browser allocator shared across requests so we don't
// spawn a fresh Chromium process for every screenshot.
var (
	allocCtx    context.Context
	allocCancel context.CancelFunc
	allocOnce   sync.Once
)

// message is the JSON envelope sent over the WebSocket to the UI.
type message struct {
	Type    string `json:"type"`              // "status" | "error" | "screenshot" | "done"
	Message string `json:"message,omitempty"` // human-readable status text
	Step    string `json:"step,omitempty"`    // machine-readable step id
	Data    string `json:"data,omitempty"`    // base64 PNG for "screenshot"
	URL     string `json:"url,omitempty"`     // the resolved URL being captured
}

var upgrader = websocket.Upgrader{
	// The UI is served from the same origin behind the /browser prefix, but
	// Vercel may rewrite paths; allow all origins for simplicity here.
	CheckOrigin: func(r *http.Request) bool { return true },
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/browser/ws", handleWS)

	mux.HandleFunc("/browser/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})

	// Serve the UI for the bare prefix and any non-API path.
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(indexHTML)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "80"
	}

	addr := ":" + port
	log.Printf("browser service listening on http://0.0.0.0%s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}

// browserAllocator lazily creates a shared Chromium allocator context.
func browserAllocator() context.Context {
	allocOnce.Do(func() {
		opts := append(chromedp.DefaultExecAllocatorOptions[:],
			chromedp.NoSandbox,
			chromedp.Flag("headless", true),
			chromedp.Flag("disable-gpu", true),
			chromedp.Flag("disable-dev-shm-usage", true),
			chromedp.Flag("hide-scrollbars", true),
		)
		// CHROME_BIN lets us point chromedp at the system Chromium installed in
		// the container; otherwise chromedp searches the PATH.
		if bin := os.Getenv("CHROME_BIN"); bin != "" {
			opts = append(opts, chromedp.ExecPath(bin))
		}
		allocCtx, allocCancel = chromedp.NewExecAllocator(context.Background(), opts...)
		_ = allocCancel // kept for symmetry; process lifetime == container lifetime
	})
	return allocCtx
}

func handleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("ws upgrade error: %v", err)
		return
	}
	defer conn.Close()

	// Serialize writes; chromedp callbacks may fire from goroutines.
	var writeMu sync.Mutex
	send := func(m message) {
		writeMu.Lock()
		defer writeMu.Unlock()
		_ = conn.WriteJSON(m)
	}

	for {
		_, raw, err := conn.ReadMessage()
		if err != nil {
			return // client disconnected
		}

		var req struct {
			URL string `json:"url"`
		}
		if err := json.Unmarshal(raw, &req); err != nil {
			send(message{Type: "error", Message: "invalid request payload"})
			continue
		}

		target, err := normalizeURL(req.URL)
		if err != nil {
			send(message{Type: "error", Message: err.Error()})
			continue
		}

		capture(target, send)
	}
}

// capture drives Chromium to load the URL and stream status + the final PNG.
func capture(target string, send func(message)) {
	send(message{Type: "status", Step: "starting", Message: "Spinning up browser tab…", URL: target})

	tabCtx, cancelTab := chromedp.NewContext(browserAllocator())
	defer cancelTab()

	// Overall timeout for a single capture.
	ctx, cancel := context.WithTimeout(tabCtx, 45*time.Second)
	defer cancel()

	// Subscribe to lifecycle events for live status updates.
	registerLifecycleStatus(ctx, send)

	send(message{Type: "status", Step: "navigating", Message: "Navigating to " + target, URL: target})

	var buf []byte
	err := chromedp.Run(ctx,
		page.SetLifecycleEventsEnabled(true),
		chromedp.EmulateViewport(1280, 800),
		chromedp.Navigate(target),
		statusAction(send, "waiting", "Waiting for the page to settle…"),
		chromedp.Sleep(750*time.Millisecond),
		statusAction(send, "capturing", "Capturing screenshot…"),
		chromedp.CaptureScreenshot(&buf),
	)
	if err != nil {
		send(message{Type: "error", Message: "capture failed: " + err.Error(), URL: target})
		return
	}

	send(message{
		Type: "screenshot",
		URL:  target,
		Data: base64.StdEncoding.EncodeToString(buf),
	})
	send(message{Type: "done", Step: "done", Message: "Done.", URL: target})
}

// statusAction emits a status message as part of a chromedp task sequence.
func statusAction(send func(message), step, msg string) chromedp.Action {
	return chromedp.ActionFunc(func(ctx context.Context) error {
		send(message{Type: "status", Step: step, Message: msg})
		return nil
	})
}

// normalizeURL validates and defaults the scheme to https.
func normalizeURL(raw string) (string, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return "", errInvalid("please enter a URL")
	}
	if !strings.Contains(raw, "://") {
		raw = "https://" + raw
	}
	u, err := url.Parse(raw)
	if err != nil || u.Host == "" {
		return "", errInvalid("that doesn't look like a valid URL")
	}
	if u.Scheme != "http" && u.Scheme != "https" {
		return "", errInvalid("only http and https URLs are supported")
	}
	return u.String(), nil
}

type errInvalid string

func (e errInvalid) Error() string { return string(e) }
