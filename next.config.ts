import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [new URL('https://image.mux.com/**')],
    },
};

export default nextConfig;
