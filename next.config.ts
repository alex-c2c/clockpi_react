import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? process.env.FLASK_URL + "/:path*"
            : '/api/',
      },
    ]
  },
}


export default nextConfig;
