import "./globals.css";

export const metadata = {
  title: "AI Chat — FastAPI + WebSocket",
  description:
    "Real-time AI chat with FastAPI, WebSocket, and the Python AI SDK",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
