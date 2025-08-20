// next.config.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // If you ever switch to <Image>, these are allowed remote hosts.
    remotePatterns: [
      { protocol: "https", hostname: "unavatar.io" },
      { protocol: "https", hostname: "unavatar.vercel.app" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },

  webpack: (config) => {
    // Enable "@/..." imports to point to the repo root
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

export default nextConfig;
