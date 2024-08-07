/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = withBundleAnalyzer({
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './empty-module.ts',
      },
    },
  },
  images: {
    domains: [
      "files.edgestore.dev",
      'localhost',
      'www.gravatar.com',
      'images.ctfassets.net',
      'e-cdns-images.dzcdn.net',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack(config, { isServer }) {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };
    
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });
    
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource',
      generator: {
        filename: 'static/worker/[hash][ext][query]'
      }
    });
    
    if (!isServer) {
      config.output.environment = { ...config.output.environment, asyncFunction: true };
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        stream: false,
        crypto: false
      };
    }
    return config;
  },
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
});

module.exports = nextConfig;