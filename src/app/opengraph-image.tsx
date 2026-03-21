import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "BGU Archive — Board Game Union";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(155deg, #fffbeb 0%, #fde68a 35%, #d97706 92%)",
          fontFamily:
            'ui-sans-serif, system-ui, "Apple SD Gothic Neo", sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 88, lineHeight: 1 }}>🎲</span>
          <span style={{ fontSize: 72, lineHeight: 1 }}>🃏</span>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#451a03",
          }}
        >
          BGU Archive
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 30,
            fontWeight: 600,
            color: "#92400e",
            letterSpacing: "0.02em",
          }}
        >
          BGU
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            color: "#78350f",
            opacity: 0.92,
          }}
        >
          Board game club archive
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
