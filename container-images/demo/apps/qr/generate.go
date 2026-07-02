package main

import (
	"image"
	"image/color"
	"image/png"
	"net/http"
	"strconv"
	"strings"

	qrcode "github.com/skip2/go-qrcode"
)

const (
	defaultSize = 512
	minSize     = 128
	maxSize     = 1024
)

// handleGenerate renders a QR code for the given data with an optional
// Vercel triangle drawn in the center.
//
//	GET /qr/generate?data=<text>&size=<px>&logo=<1|0>
func handleGenerate(w http.ResponseWriter, r *http.Request) {
	data := r.URL.Query().Get("data")
	if strings.TrimSpace(data) == "" {
		http.Error(w, "missing 'data' parameter", http.StatusBadRequest)
		return
	}
	if len(data) > 2048 {
		http.Error(w, "'data' too long (max 2048 chars)", http.StatusBadRequest)
		return
	}

	size := defaultSize
	if s := r.URL.Query().Get("size"); s != "" {
		if n, err := strconv.Atoi(s); err == nil {
			size = clamp(n, minSize, maxSize)
		}
	}

	withLogo := r.URL.Query().Get("logo") != "0"

	// Highest error correction so the centered logo doesn't break scanning.
	qr, err := qrcode.New(data, qrcode.Highest)
	if err != nil {
		http.Error(w, "failed to build QR: "+err.Error(), http.StatusInternalServerError)
		return
	}
	qr.DisableBorder = false

	img := qr.Image(size)

	// Convert to a mutable RGBA canvas.
	canvas := image.NewRGBA(img.Bounds())
	for y := img.Bounds().Min.Y; y < img.Bounds().Max.Y; y++ {
		for x := img.Bounds().Min.X; x < img.Bounds().Max.X; x++ {
			canvas.Set(x, y, img.At(x, y))
		}
	}

	if withLogo {
		drawVercelTriangle(canvas)
	}

	w.Header().Set("Content-Type", "image/png")
	w.Header().Set("Cache-Control", "public, max-age=300")
	_ = png.Encode(w, canvas)
}

// drawVercelTriangle draws a black, upward-pointing triangle centered in the
// image. To match the Vercel branding it is drawn directly over the center
// (no white knockout box); we clear a tight transparent-to-white margin only
// immediately around the triangle so its edges stay crisp against the modules.
func drawVercelTriangle(img *image.RGBA) {
	b := img.Bounds()
	w := b.Dx()
	cx := float64(b.Min.X) + float64(w)/2
	cy := float64(b.Min.Y) + float64(b.Dy())/2

	// The triangle occupies ~24% of the QR width.
	tri := float64(w) * 0.24
	half := tri / 2
	height := tri * 0.9
	apexY := cy - height/2
	baseY := cy + height/2

	// Clear a small white region directly under the triangle footprint so the
	// black mark reads cleanly, without a large obvious box.
	white := color.RGBA{255, 255, 255, 255}
	margin := tri * 0.12
	for y := int(apexY - margin); y <= int(baseY+margin); y++ {
		t := (float64(y) - apexY) / (baseY - apexY)
		if t < 0 {
			t = 0
		}
		if t > 1 {
			t = 1
		}
		hw := half*t + margin
		for x := int(cx - hw); x <= int(cx+hw); x++ {
			img.Set(x, y, white)
		}
	}

	black := color.RGBA{0, 0, 0, 255}
	for y := int(apexY); y <= int(baseY); y++ {
		t := (float64(y) - apexY) / (baseY - apexY)
		hw := half * t
		for x := int(cx - hw); x <= int(cx+hw); x++ {
			img.Set(x, y, black)
		}
	}
}

func clamp(v, lo, hi int) int {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}
