// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   images: {
//     domains: ["respring-s3-bucket.s3.ap-northeast-2.amazonaws.com"],
//     unoptimized: true,
//   },
//   async redirects() {
//     return [
//       {
//         source: "/", // 기존 메인 페이지
//         destination: "/main", // 이동할 경로
//         permanent: true, // 301 영구 리다이렉트
//       },
//     ];
//   },
//   // =========================
//   // 🔽 추가한 부분 (rewrites)
//   // =========================
//   async rewrites() {
//     return [
//       {
//         source: "/user/:path*",
//         destination: "http://localhost:8080/user/:path*",
//       },
//       {
//         source: "/chat/:path*",
//         destination: "http://localhost:8080/chat/:path*",
//       },
//     ];
//   },
// };

// module.exports = nextConfig;
const withPWA = require('next-pwa')({
  dest: 'public', // 서비스워커와 PWA 관련 파일들이 public 폴더에 생성됨
  register: true, // 사용자가 사이트 방문하면 자동으로 서비스워커 등록됨
  skipWaiting: true, // 새 서비스워커가 바로 활성화되게 설정
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: false,
  images: {
    domains: ['respring-s3-bucket.s3.ap-northeast-2.amazonaws.com'],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/', // 기존 메인 페이지
        destination: '/main', // 이동할 경로
        permanent: true, // 301 영구 리다이렉트
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/user/:path*',
        destination: 'http://localhost:8080/user/:path*',
      },
      {
        source: '/chat/:path*',
        destination: 'http://localhost:8080/chat/:path*',
      },
    ];
  },
});

module.exports = nextConfig;
