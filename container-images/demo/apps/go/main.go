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
	mux := http.NewServeMux()

	mux.HandleFunc("/go/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})

	// Serve the landing page for "/go", "/" and anything else forwarded.
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(indexHTML)
	})

	// Vercel routes traffic to port 80 by default; PORT overrides it.
	port := os.Getenv("PORT")
	if port == "" {
		port = "80"
	}

	addr := ":" + port
	log.Printf("listening on http://0.0.0.0%s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}
