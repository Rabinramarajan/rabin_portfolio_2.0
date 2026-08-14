export default {
  framework: 'nextjs',
  buildCommand: 'next build',
  devCommand: 'next dev',
  outputDirectory: '.next',

  // Web Analytics and Speed Insights are automatically enabled on Vercel
  // Configure them via: https://vercel.com/dashboard → Analytics

  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
  },
};
