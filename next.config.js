/** @type {import('next').NextConfig} */
// Azure Static Web Apps 用に static export を有効化
// リリース手順書 §1.2 Step 6 に従い output_location: "out" / is_static_export: true
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    // SWA では Next.js Image Optimizer が使えないため unoptimized
    unoptimized: true,
  },
  // 環境変数の型補完（実値は .env.local で）
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Tech0 Search',
  },
};

module.exports = nextConfig;
