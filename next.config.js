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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'files.edgestore.dev'
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com'
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net'
      },
      {
        protocol: 'https',
        hostname: 'e-cdns-images.dzcdn.net'
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com'
      },
    ]
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
      test: /\.LICENSE$/,
      use: 'ignore-loader'
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      '@babel/plugin-syntax-async-generators': false,
      'jest-snapshot': false,
      '@jest/core': false,
    };
    
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
      config.resolve.fallback.worker_threads = false;
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
    GOOGLE_FIREBASE_CREDENTIALS: process.env.GOOGLE_FIREBASE_CREDENTIALS,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CONVEX_URL: process.env.CONVEX_URL,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    GOOGLE_CLOUD_STORAGE_BUCKET: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    FREE_PLAN_ID: process.env.FREE_PLAN_ID,
    STANDARD_PLAN_ID: process.env.STANDARD_PLAN_ID,
    PRO_PLAN_ID: process.env.PRO_PLAN_ID,
    ULTIMATE_PLAN_ID: process.env.ULTIMATE_PLAN_ID,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
  },
});
module.exports = nextConfig;

