import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Fully static: deployable on any static host (GitHub Pages, Vercel, Netlify…)
  output: "export",
  // every page is a folder with an index.html (/work/nagiren/): clean URLs on any static host
  trailingSlash: true,
  // two root layouts (/ English, /it Italian) share one 404 page
  experimental: { globalNotFound: true },
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
