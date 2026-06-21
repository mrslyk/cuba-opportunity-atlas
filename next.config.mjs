/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow importing the JSON data corpus from /data at build time.
  // Images are not optimized through a remote loader; assets are local/SVG.
  images: { unoptimized: true },
};

export default nextConfig;
