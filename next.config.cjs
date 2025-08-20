// next.config.cjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "unavatar.io" },
      { protocol: "https", hostname: "unavatar.vercel.app" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
};
module.exports = nextConfig;
