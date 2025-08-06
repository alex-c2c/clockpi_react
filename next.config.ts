import type { NextConfig } from "next";


const nextConfig: NextConfig = {
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
				source: "/api/image-proxy",
				destination: "/api/image-proxy"	
			},
			{
				source: "/api/:path*",
				destination:
					process.env.NODE_ENV === "development"
						? process.env.FLASK_URL + "/:path*"
						: "/api/",
			},
		]
	},
}


export default nextConfig;
