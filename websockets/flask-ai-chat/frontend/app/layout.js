import "./globals.css";

export const metadata = {
  title: "AI Chat — Flask + WebSocket",
  description: "Real-time AI chat with Flask, WebSocket, and the Python AI SDK",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
