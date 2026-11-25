/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aufbereitete Produkte liegen als statische Seiten unter public/produkte/<name>/index.html
  async rewrites() {
    return [{ source: "/produkte/:name", destination: "/produkte/:name/index.html" }];
  },
};
export default nextConfig;
