/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'www.w3schools.com',
            port: '',
            pathname: '/howto/**',
          },
          {
            protocol: 'https',
            hostname: '"res.cloudinary.com"',
            port: '',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
