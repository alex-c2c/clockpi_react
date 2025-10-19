import type { NextConfig } from "next";


const nextConfig: NextConfig = {
	compiler: {
		removeConsole: false,
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "5001",
				pathname: "/api/1/wallpaper/file/**",
			},
		],
	},
	rewrites: async () => {
		return [
			{
				source: "/flask/:path*",
				destination: process.env.FLASK_URL + "/:path*"
			},
		]
	},
}


export default nextConfig;
