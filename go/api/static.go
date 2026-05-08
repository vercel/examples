package starter

import "embed"

//go:embed public/*
var StaticFiles embed.FS
