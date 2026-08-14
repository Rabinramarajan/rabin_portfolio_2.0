import { type VercelConfig, routes } from '@vercel/config/v1';

export const config: VercelConfig = {
  framework: 'nextjs',
  buildCommand: 'next build',
  devCommand: 'next dev',
  outputDirectory: '.next',

  // Web Analytics and Speed Insights configuration
  // These are automatically enabled on Vercel deployments
  // Configure them via the Vercel dashboard for granular control

  // Environment variables for production
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
  },
};
