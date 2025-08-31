/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Allow common localhost ports used in development
      allowedOrigins: ["localhost:3000", "localhost:3001"],
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "res.cloudinary.com" }
    ]
  }
};

export default nextConfig;
