/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
	images: {
		domains: ['images.amazon.com'],
	}
};

export default nextConfig;
