import type { ComponentType, SVGProps } from "react";
import {
  ChromeIcon,
  DoomIcon,
  FfmpegIcon,
  GoIcon,
  LaravelIcon,
  QrIcon,
  RustIcon,
  WasmIcon,
} from "./icons";

export type Service = {
  name: string;
  route: string;
  description: string;
  tags: string[];
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const services: Service[] = [
  {
    name: "Rust",
    route: "/rust",
    description:
      "A dynamic HTTP server built with axum and tokio, returning a server-rendered page.",
    tags: ["axum", "tokio", "dynamic"],
    Icon: RustIcon,
  },
  {
    name: "Go",
    route: "/go",
    description:
      "A lightweight server using the Go standard library net/http with an embedded page.",
    tags: ["net/http", "stdlib", "dynamic"],
    Icon: GoIcon,
  },
  {
    name: "WebAssembly",
    route: "/wasm",
    description:
      "A static site served by nginx that runs Rust-compiled WebAssembly directly in your browser.",
    tags: ["rust to wasm", "nginx", "static"],
    Icon: WasmIcon,
  },
  {
    name: "Browser",
    route: "/browser",
    description:
      "Headless Chromium in a container. Enter a URL and get a screenshot with live status over WebSocket.",
    tags: ["chromedp", "websocket", "chromium"],
    Icon: ChromeIcon,
  },
  {
    name: "FFmpeg",
    route: "/ffmpeg",
    description:
      "Paste a media URL, pick a transform (GIF, MP4, MP3, thumbnail, waveform) and watch ffmpeg run live.",
    tags: ["ffmpeg", "websocket", "media"],
    Icon: FfmpegIcon,
  },
  {
    name: "Doom",
    route: "/doom",
    description:
      "FreeDOOM running headless under Xvfb. Frames stream over WebSocket and your keystrokes drive the engine.",
    tags: ["xvfb", "websocket", "chocolate-doom"],
    Icon: DoomIcon,
  },
  {
    name: "QR",
    route: "/qr",
    description:
      "Generate Vercel-branded QR codes with the triangle in the center. Stateless, instant, cacheable.",
    tags: ["go-qrcode", "image", "stateless"],
    Icon: QrIcon,
  },
  {
    name: "PHP",
    route: "/php",
    description:
      "A Laravel app that renders Blade templates to PDF invoices with dompdf. Stateless render-and-return.",
    tags: ["laravel", "dompdf", "stateless"],
    Icon: LaravelIcon,
  },
];
