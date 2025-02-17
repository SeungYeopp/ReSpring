/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["respring-s3-bucket.s3.ap-northeast-2.amazonaws.com"],
  },
  async redirects() {
    return [
      {
        source: "/", // 기존 메인 페이지
        destination: "/today", // 이동할 경로
        permanent: true, // 301 영구 리다이렉트
      },
    ];
  },
  // =========================
  // 🔽 추가한 부분 (rewrites)
  // =========================
  async rewrites() {
    return [
      {
        source: "/user/:path*",
        destination: "http://localhost:8080/user/:path*",
      },
      {
        source: "/chat/:path*",
        destination: "http://localhost:8080/chat/:path*",
      },
    ];
  },
};

module.exports = nextConfig;