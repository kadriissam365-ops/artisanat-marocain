import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*/checkout",
          "/*/profile",
          "/*/orders",
          "/*/wishlist",
          "/*/login",
          "/*/register",
          "/api/",
          "/admin/",
          "/_next/",
        ],
      },
    ],
    sitemap: "https://artisanat-marocain.ma/sitemap.xml",
  };
}
