import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { getConfig } from "~lib/config";

async function loadFonts() {
  const [bold, regular] = await Promise.all([
    fetch(
      "https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/public/static/Pretendard-Bold.otf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/public/static/Pretendard-Regular.otf"
    ).then((res) => res.arrayBuffer()),
  ]);
  return { bold, regular };
}

function renderDots() {
  const dots = [];
  const cols = 24;
  const rows = 12;
  const spacingX = 50;
  const spacingY = 52;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      dots.push(
        <div
          key={`${row}-${col}`}
          style={{
            position: "absolute",
            left: col * spacingX + 25,
            top: row * spacingY + 15,
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.12)",
          }}
        />
      );
    }
  }
  return dots;
}

function renderTitle(title: string, highlightWords?: string) {
  if (!highlightWords) {
    return title;
  }

  const words = highlightWords.split(",").map((w) => w.trim()).filter(Boolean);
  const pattern = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${pattern})`, "g");
  const parts = title.split(regex);

  return parts.map((part, i) =>
    words.includes(part) ? (
      <span
        key={i}
        style={{
          background: "linear-gradient(90deg, #7b5ea7, #9f6ba0, #d47a8c)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {part}
      </span>
    ) : (
      <span key={i} style={{ color: "#1a1a1a" }}>{part}</span>
    )
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Title";
    const highlightWord = searchParams.get("highlightWord") || undefined;

    const fonts = await loadFonts();

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage:
              "linear-gradient(135deg, #f0f0f5, #e8e6f0, #f5f3fa)",
            position: "relative",
            fontFamily: "Pretendard",
          }}
        >
          {renderDots()}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.3,
              maxWidth: "1000px",
              padding: "0 60px",
              letterSpacing: "-1px",
              wordBreak: "keep-all",
            }}
          >
            {renderTitle(title, highlightWord)}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 40,
              right: 50,
              display: "flex",
              alignItems: "center",
              fontSize: 24,
              color: "#888888",
              fontWeight: 400,
            }}
          >
            {getConfig().author.name}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Pretendard",
            data: fonts.bold,
            weight: 700 as const,
            style: "normal" as const,
          },
          {
            name: "Pretendard",
            data: fonts.regular,
            weight: 400 as const,
            style: "normal" as const,
          },
        ],
      }
    );
  } catch (e) {
    console.error("OG image generation failed:", e);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
