import { ImageResponse } from "next/og";

export const alt = "HR AI Assistant — AI-powered resume screening for recruiters";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #e0f0ff 0%, #f0eaff 50%, #e8f8f0 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top — logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #3B82F6 0%, #6366F1 55%, #8B5CF6 100%)",
              borderRadius: 14,
              color: "white",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            H
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                background: "linear-gradient(90deg, #2563eb, #6366f1, #8b5cf6)",
                backgroundClip: "text",
                color: "transparent",
                letterSpacing: -1,
              }}
            >
              HR AI
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#9ca3af",
                letterSpacing: 3,
                marginTop: 6,
              }}
            >
              ASSISTANT
            </div>
          </div>
        </div>

        {/* Middle — headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 78,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: -3,
              lineHeight: 1.05,
              maxWidth: 1040,
            }}
          >
            <span>AI resume screening that thinks like a&nbsp;</span>
            <span
              style={{
                background: "linear-gradient(90deg, #2563eb, #6366f1, #8b5cf6)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              senior recruiter.
            </span>
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#475569",
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            Match scores, hiring recommendations & interview questions —
            streamed in seconds.
          </div>
        </div>

        {/* Bottom — pills */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {["Free", "GDPR / RODO", "EN + PL", "Powered by Groq"].map((p) => (
            <div
              key={p}
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.9)",
                color: "#334155",
                padding: "10px 20px",
                borderRadius: 999,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
