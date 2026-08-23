import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  webpack(config) {
    // Allow importing .md files as raw text strings
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });
    return config;
  },
  async headers() {
    return [
      {
        // Force download for .md files in /resources/
        source: "/resources/:filename*.md",
        headers: [
          {
            key: "Content-Disposition",
            value: "attachment",
          },
          {
            key: "Content-Type",
            value: "text/markdown; charset=utf-8",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
