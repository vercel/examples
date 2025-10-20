package main

import (
    "fmt"
    "net/http"
    "os"
)

func main() {
    port := os.Getenv("PORT")
    if port == "" { port = "8080" }
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Hello from Go API")
    })
    fmt.Printf("Listening on :%s\n", port)
    _ = http.ListenAndServe(":"+port, nil)
}
