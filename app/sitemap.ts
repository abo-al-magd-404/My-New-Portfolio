import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
  }

  const routes = [
    "",
    "/about",
    "/education",
    "/projects",
    "/experience",
    "/contact",
  ];

  return routes.flatMap((route) =>
    (["en", "ar"] as const).map((locale) => ({
      url: `${siteUrl}/${locale}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
  );
}
