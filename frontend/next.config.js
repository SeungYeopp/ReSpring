/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["example.com"], // ✅ 외부 이미지 도메인 허용
  },
  async redirects() {
    return [
      {
        source: "/", // 기존 메인 페이지
        destination: "/today", // 변경할 경로
        permanent: true, // 301 리다이렉트 (영구 이동)
      },
    ];
  },
};

module.exports = nextConfig;
