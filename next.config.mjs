/** @type {import('next').NextConfig} */
const nextConfig = {
  // The shop used to live at /shop behind a splash page. It is now the home page.
  async redirects() {
    return [{ source: "/shop", destination: "/", permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "w-img.b-cdn.net",
      },
    ],
  },
};

export default nextConfig;
