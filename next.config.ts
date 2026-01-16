import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Giữ nguyên khi truy cập đúng index.html (không rewrite lần nữa)
      {
        source: "/docs/autopost/:path*/index.html",
        destination: "/docs/autopost/:path*/index.html",
      },
      // Cho phép bỏ `/index.html`
      // /docs/autopost/facebook/connect  ->  /docs/autopost/facebook/connect/index.html
      {
        source: "/docs/autopost/:path*",
        destination: "/docs/autopost/:path*/index.html",
      },
      // Cho phép dùng URL ngắn như bạn ví dụ:
      // /docs/facebook/connect  ->  /docs/autopost/facebook/connect/index.html
      {
        source: "/docs/:platform(facebook|instagram|linkedin|wordpress|x)/:slug*",
        destination: "/docs/autopost/:platform/:slug*/index.html",
      },
    ];
  },
};

export default nextConfig;