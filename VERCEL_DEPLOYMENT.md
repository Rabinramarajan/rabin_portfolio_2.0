# Vercel Deployment Guide

This guide will help you deploy your portfolio to Vercel and complete the production checklist.

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. GitHub repository connected to Vercel

## Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm i -g vercel
```

## Step 2: Link Your Project to Vercel

Run the following command from your project directory:

```bash
npx vercel link
```

This will:
- Authenticate you with Vercel
- Create a new project on Vercel (or link to existing)
- Generate the `.vercel/` folder with project configuration

## Step 3: Pull Environment Variables

```bash
npx vercel pull
```

This retrieves any environment variables from your Vercel project.

## Step 4: Deploy Preview Build

```bash
npx vercel deploy
```

This creates a preview deployment URL. Share this URL to test before production.

## Step 5: Deploy to Production

```bash
npx vercel deploy --prod
```

This deploys to your production domain.

## Production Checklist Items

### ✅ Preview Deployment
- Run `npx vercel deploy` to create preview URLs
- Every commit to GitHub automatically creates preview deployments

### ✅ Enable Web Analytics
1. Go to https://vercel.com/dashboard
2. Select your project
3. Navigate to **Analytics** → **Web Analytics**
4. Click **Enable Web Analytics**
5. Analytics data will start appearing after 24 hours

### ✅ Enable Speed Insights
1. In your Vercel project dashboard
2. Go to **Analytics** → **Speed Insights**
3. Click **Enable Speed Insights**
4. Your Next.js app automatically integrates with Speed Insights

### ✅ Add Custom Domain
1. In Vercel dashboard, go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your custom domain (e.g., `rabin.dev`)
4. Follow DNS configuration instructions
5. Update `SITE_URL` in `src/content/profile.ts` to match your domain

## Environment Variables for Production

Add these to your Vercel project (Settings → Environment Variables):

```
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
```

## Automatic Deployments

Once linked to GitHub, Vercel will automatically:
- Deploy preview URLs for every pull request
- Deploy to production when you push to `main` branch
- Show deployment status in GitHub

## Troubleshooting

**"No projects found"**
- Ensure you're logged into the correct Vercel account
- Run `npx vercel whoami` to check current user

**Build fails**
- Check build logs: `npx vercel logs`
- Ensure all dependencies are installed: `npm install`
- Verify environment variables are set

**Domain not resolving**
- DNS changes can take up to 48 hours
- Check domain configuration in Vercel dashboard
- Verify DNS records match Vercel's instructions

## Next Steps

1. Set up CI/CD by connecting your GitHub repository
2. Configure edge middleware if needed
3. Set up custom error pages
4. Enable security headers via vercel.ts

For more details, visit: https://vercel.com/docs
