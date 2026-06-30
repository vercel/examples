package main

import (
	"bufio"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type message struct {
	Type     string  `json:"type"`               // status | progress | result | error | done
	Message  string  `json:"message,omitempty"`  //
	Step     string  `json:"step,omitempty"`     //
	Percent  float64 `json:"percent,omitempty"`  // 0..100
	Data     string  `json:"data,omitempty"`     // base64 result
	MimeType string  `json:"mimeType,omitempty"` //
	Filename string  `json:"filename,omitempty"` //
}

type request struct {
	URL    string `json:"url"`
	Preset string `json:"preset"`
}

// preset describes an ffmpeg transform: output extension, mime, and the args
// builder (given input + output paths).
type preset struct {
	Label string
	Ext   string
	Mime  string
	Args  func(in, out string) []string
}

var presets = map[string]preset{
	"gif": {
		Label: "Video → GIF",
		Ext:   "gif",
		Mime:  "image/gif",
		Args: func(in, out string) []string {
			return []string{"-i", in, "-t", "6",
				"-vf", "fps=12,scale=480:-1:flags=lanczos", "-y", out}
		},
	},
	"thumbnail": {
		Label: "Thumbnail (first frame)",
		Ext:   "png",
		Mime:  "image/png",
		Args: func(in, out string) []string {
			return []string{"-i", in, "-vf", "scale=640:-1", "-frames:v", "1", "-y", out}
		},
	},
	"mp4": {
		Label: "Transcode → MP4 (H.264)",
		Ext:   "mp4",
		Mime:  "video/mp4",
		Args: func(in, out string) []string {
			return []string{"-i", in, "-t", "30",
				"-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
				"-c:a", "aac", "-movflags", "+faststart", "-y", out}
		},
	},
	"mp3": {
		Label: "Extract audio → MP3",
		Ext:   "mp3",
		Mime:  "audio/mpeg",
		Args: func(in, out string) []string {
			return []string{"-i", in, "-vn", "-b:a", "192k", "-y", out}
		},
	},
	"waveform": {
		Label: "Audio waveform (PNG)",
		Ext:   "png",
		Mime:  "image/png",
		Args: func(in, out string) []string {
			return []string{"-i", in,
				"-filter_complex", "showwavespic=s=900x250:colors=#3b82f6", "-y", out}
		},
	},
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
	// Allow large inbound frames if a client ever inlines data.
	ReadBufferSize:  1 << 16,
	WriteBufferSize: 1 << 16,
}

func handleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("ws upgrade error: %v", err)
		return
	}
	defer conn.Close()

	var writeMu sync.Mutex
	send := func(m message) {
		writeMu.Lock()
		defer writeMu.Unlock()
		_ = conn.WriteJSON(m)
	}

	for {
		_, raw, err := conn.ReadMessage()
		if err != nil {
			return
		}
		var req request
		if err := json.Unmarshal(raw, &req); err != nil {
			send(message{Type: "error", Message: "invalid request"})
			continue
		}
		runJob(req, send)
	}
}

func runJob(req request, send func(message)) {
	p, ok := presets[req.Preset]
	if !ok {
		send(message{Type: "error", Message: "unknown preset: " + req.Preset})
		return
	}
	if strings.TrimSpace(req.URL) == "" {
		send(message{Type: "error", Message: "please provide a source URL"})
		return
	}

	workDir, err := os.MkdirTemp("", "ffmpeg-*")
	if err != nil {
		send(message{Type: "error", Message: "could not create workspace"})
		return
	}
	defer os.RemoveAll(workDir)

	inPath := filepath.Join(workDir, "input")
	outPath := filepath.Join(workDir, "output."+p.Ext)

	// 1. Download the source.
	send(message{Type: "status", Step: "download", Message: "Downloading source…"})
	if err := download(req.URL, inPath); err != nil {
		send(message{Type: "error", Message: "download failed: " + err.Error()})
		return
	}

	// 2. Probe duration so we can compute a progress percentage.
	durationUs := probeDurationMicros(inPath)

	// 3. Run ffmpeg with machine-readable progress on stdout.
	send(message{Type: "status", Step: "encode", Message: "Running ffmpeg (" + p.Label + ")…"})
	if err := runFFmpeg(p.Args(inPath, outPath), durationUs, send); err != nil {
		send(message{Type: "error", Message: "ffmpeg failed: " + err.Error()})
		return
	}

	// 4. Read the result and stream it back.
	out, err := os.ReadFile(outPath)
	if err != nil {
		send(message{Type: "error", Message: "no output produced"})
		return
	}
	send(message{Type: "progress", Percent: 100})
	send(message{
		Type:     "result",
		MimeType: p.Mime,
		Filename: "output." + p.Ext,
		Data:     base64.StdEncoding.EncodeToString(out),
		Message:  fmt.Sprintf("%.0f KB", float64(len(out))/1024),
	})
	send(message{Type: "done", Message: "Done."})
}

func download(rawURL, dest string) error {
	if !strings.Contains(rawURL, "://") {
		rawURL = "https://" + rawURL
	}
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodGet, rawURL, nil)
	if err != nil {
		return err
	}
	resp, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("status %d", resp.StatusCode)
	}

	f, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer f.Close()

	// Cap downloads at 200 MB.
	_, err = io.Copy(f, io.LimitReader(resp.Body, 200<<20))
	return err
}

func probeDurationMicros(path string) int64 {
	out, err := exec.Command("ffprobe",
		"-v", "error", "-show_entries", "format=duration",
		"-of", "default=noprint_wrappers=1:nokey=1", path).Output()
	if err != nil {
		return 0
	}
	secs, err := strconv.ParseFloat(strings.TrimSpace(string(out)), 64)
	if err != nil {
		return 0
	}
	return int64(secs * 1_000_000)
}

func runFFmpeg(args []string, totalUs int64, send func(message)) error {
	ctx, cancel := context.WithTimeout(context.Background(), 120*time.Second)
	defer cancel()

	full := append([]string{"-hide_banner", "-nostats", "-progress", "pipe:1"}, args...)
	cmd := exec.CommandContext(ctx, "ffmpeg", full...)

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}
	cmd.Stderr = io.Discard

	if err := cmd.Start(); err != nil {
		return err
	}

	// Parse "out_time_us=..." lines to compute percent complete.
	scanner := bufio.NewScanner(stdout)
	lastPct := -1.0
	for scanner.Scan() {
		line := scanner.Text()
		if v, ok := strings.CutPrefix(line, "out_time_us="); ok && totalUs > 0 {
			if cur, err := strconv.ParseInt(strings.TrimSpace(v), 10, 64); err == nil {
				pct := float64(cur) / float64(totalUs) * 100
				if pct > 100 {
					pct = 100
				}
				if pct-lastPct >= 1 {
					lastPct = pct
					send(message{Type: "progress", Percent: pct})
				}
			}
		}
	}

	return cmd.Wait()
}
