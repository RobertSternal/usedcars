/** @type {import('next').Config} */
const nextConfig = {
  /* config options here */
  basePath: '/usedcars',
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/',
      },
    ],
  },
};

export default nextConfig;
