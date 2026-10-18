import { ImageResponse } from "next/og";

export const alt = "LaunchDesk - Employee onboarding without chaos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "flex-start",
        background: "linear-gradient(135deg, #121419 0%, #1c1f26 100%)",
        color: "#f2f2f2",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: 80,
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
        <div
          style={{
            background: "#f5c26b",
            borderRadius: 16,
            height: 56,
            width: 56,
          }}
        />
        <div style={{ fontSize: 40, fontWeight: 600 }}>LaunchDesk</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
          Onboarding without chaos
        </div>
        <div style={{ color: "#9a9ea6", fontSize: 34, lineHeight: 1.3, maxWidth: 960 }}>
          Tasks, documents, assignments and progress for every new hire, in one place.
        </div>
      </div>
    </div>,
    size,
  );
}
