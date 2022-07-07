/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	compiler: {
		styledComponents: true,
	},
	env: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN:
			process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN,
	},
};

module.exports = nextConfig;
