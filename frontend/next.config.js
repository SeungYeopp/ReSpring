/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["example.com"], // ✅ 외부 이미지 도메인 허용
  },
};

module.exports = nextConfig;
