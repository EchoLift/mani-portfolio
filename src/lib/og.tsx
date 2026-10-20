import { ImageResponse } from "next/og";

export function createOgImage(title: string, subtitle: string) {
  return new ImageResponse(<div style={{ background: "#0B0B0B", color: "#F3F0E9", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px", border: "1px solid #C6AE83" }}>
    <div style={{ color: "#C6AE83", fontSize: 22, letterSpacing: 5 }}>VIDEO EDITING / COLOR GRADING</div>
    <div style={{ fontFamily: "serif", fontSize: 88, lineHeight: 1.05, whiteSpace: "pre-wrap" }}>{title}</div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 }}><span>{subtitle}</span><span style={{ color: "#C6AE83" }}>[ • ]</span></div>
  </div>, { width: 1200, height: 630 });
}
