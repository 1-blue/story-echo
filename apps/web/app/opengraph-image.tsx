import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "StoryEcho — 이야기해줘";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF7F2",
          padding: 48,
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#C4714A",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          StoryEcho
        </div>
        <div
          style={{
            fontSize: 64,
            color: "#2C2419",
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          이야기해줘
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#6B6258",
            marginTop: 24,
            textAlign: "center",
          }}
        >
          매일 하나의 질문. 오늘의 이야기, 나중에 다시 읽기.
        </div>
      </div>
    ),
    { ...size },
  );
}
