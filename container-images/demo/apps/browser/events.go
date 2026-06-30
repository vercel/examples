package main

import (
	"context"

	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
)

// registerLifecycleStatus forwards Chromium page lifecycle events to the UI as
// human-readable status updates (e.g. DOMContentLoaded, load, networkIdle).
func registerLifecycleStatus(ctx context.Context, send func(message)) {
	chromedp.ListenTarget(ctx, func(ev interface{}) {
		switch e := ev.(type) {
		case *page.EventLifecycleEvent:
			if msg, ok := lifecycleLabels[e.Name]; ok {
				send(message{Type: "status", Step: e.Name, Message: msg})
			}
		case *page.EventFrameNavigated:
			if e.Frame != nil && e.Frame.URL != "" {
				send(message{Type: "status", Step: "frame", Message: "Loaded frame: " + e.Frame.URL})
			}
		}
	})
}

// lifecycleLabels maps noisy CDP lifecycle names to friendly status text.
var lifecycleLabels = map[string]string{
	"init":                 "Initializing page…",
	"DOMContentLoaded":     "DOM content loaded",
	"load":                 "Page loaded",
	"networkAlmostIdle":    "Network almost idle",
	"networkIdle":          "Network idle",
	"firstContentfulPaint": "First contentful paint",
	"firstMeaningfulPaint": "First meaningful paint",
	"firstPaint":           "First paint",
}
