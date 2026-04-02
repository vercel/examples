package handler

import (
	"embed"
	"encoding/json"
	"io/fs"
	"net/http"
	"strings"
	"time"

	"vercel-go-starter/internal/model"
)

type Handler struct {
	assets embed.FS
}

func New(assets embed.FS) *Handler {
	return &Handler{assets: assets}
}

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	publicFS, _ := fs.Sub(h.assets, "public")
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.FS(publicFS))))

	mux.HandleFunc("/", h.handleIndex)
	mux.HandleFunc("/favicon.ico", h.handleFavicon)
	mux.HandleFunc("/api/data", h.handleGetData)
	mux.HandleFunc("/api/items/", h.handleGetItem)
}

func (h *Handler) handleIndex(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}
	data, err := h.assets.ReadFile("public/index.html")
	if err != nil {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write(data)
}

func (h *Handler) handleFavicon(w http.ResponseWriter, r *http.Request) {
	data, err := h.assets.ReadFile("public/favicon.ico")
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "image/x-icon")
	w.Write(data)
}

func (h *Handler) handleGetData(w http.ResponseWriter, r *http.Request) {
	items := []model.DataItem{
		{ID: 1, Name: "Sample Item 1", Value: 100},
		{ID: 2, Name: "Sample Item 2", Value: 200},
		{ID: 3, Name: "Sample Item 3", Value: 300},
	}

	writeJSON(w, http.StatusOK, model.DataResponse{
		Data:      items,
		Total:     len(items),
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	})
}

func (h *Handler) handleGetItem(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/items/")
	if id == "" {
		http.NotFound(w, r)
		return
	}

	writeJSON(w, http.StatusOK, model.ItemResponse{
		Item: model.DataItem{
			ID:    1,
			Name:  "Sample Item " + id,
			Value: 100,
		},
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
