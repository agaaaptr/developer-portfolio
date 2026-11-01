/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aga-putra.vercel.app',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Pin Turbopack's workspace root to this repo; without it `next dev` walks up
  // past the home directory's `.git` and warns the lockfile is outside the repo.
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig