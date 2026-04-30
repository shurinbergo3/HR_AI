import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HR AI Assistant",
    short_name: "HR AI",
    description:
      "AI-powered resume screening and candidate analysis for recruiters and HR teams.",
    start_url: "/",
    display: "standalone",
    background_color: "#e0f0ff",
    theme_color: "#6366f1",
    orientation: "portrait",
    categories: ["business", "productivity", "human resources"],
    lang: "en",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
