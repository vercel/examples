package main

import (
	_ "embed"
	"log"
	"net/http"
	"os"
)

//go:embed index.html
var indexHTML []byte

func main() {
	// Boot the virtual display + Doom engine once at startup.
	if err := startEngine(); err != nil {
		log.Fatalf("failed to start doom engine: %v", err)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/doom/ws", handleWS)

	mux.HandleFunc("/doom/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(indexHTML)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "80"
	}

	addr := ":" + port
	log.Printf("doom service listening on http://0.0.0.0%s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}
