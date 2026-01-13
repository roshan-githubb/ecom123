import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@medusajs/ui', '@medusajs/icons'],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    domains: ["saransa-marketplace-bucket-stage.s3.ap-south-1.amazonaws.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "mercur-connect.s3.eu-central-1.amazonaws.com",
      },
      { protocol: "https", hostname: "api.mercurjs.com" },
      { protocol: "http", hostname: "localhost" },
      {
        protocol: "https",
        hostname: "api-sandbox.mercurjs.com",
        pathname: "/static/**",
      },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "s3.eu-central-1.amazonaws.com" },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
    ],
  },
}

module.exports = nextConfig
