package main

import (
	"net/http"
	"os"

	starter "vercel-go-starter"
	"vercel-go-starter/internal/handler"
)

func main() {
	mux := http.NewServeMux()

	h := handler.New(starter.StaticFiles)
	h.RegisterRoutes(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	http.ListenAndServe(":"+port, mux)
}
