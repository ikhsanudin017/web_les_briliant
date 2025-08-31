import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const now = new Date();
  const routes = [
    "",
    "/auth/login",
    "/auth/register",
  ];
  return routes.map((r) => ({ url: `${base}${r}`, lastModified: now, changeFrequency: "weekly", priority: r === "" ? 1 : 0.8 }));
}

