# Google Tag Manager Consent Mode Setup Guide

This guide walks you through setting up consent mode for your portfolio with CookieScript banner and Google Tag Manager.

## What You're Setting Up

- **CookieScript**: A privacy-compliant cookie consent banner
- **GTM Consent Mode**: GDPR-compliant consent tracking in Google Tag Manager
- **ConsentManager**: A React component that bridges CookieScript and GTM

## Step-by-Step Setup

### 1. Get Your CookieScript ID

1. Go to [CookieScript.com](https://cookiescript.com)
2. Sign up or log in to your account
3. Create a new website/container
4. You'll get a **CookieScript ID** (looks like: `12345abcde`)
5. **Note**: Save this ID for Step 3

### 2. Configure Google Tag Manager

#### Option A: If you already have GTM set up
1. Log in to [Google Tag Manager](https://tagmanager.google.com)
2. Go to your container settings
3. Your **GTM ID** is at the top (looks like: `GTM-XXXXXX`)

#### Option B: If you need to set up GTM
1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Click "Create account"
3. Set up your account and container
4. Accept the terms and create
5. Your **GTM ID** will be shown (looks like: `GTM-XXXXXX`)

### 3. Add Environment Variables

Add these to your `.env.local` file:

```env
# Google Tag Manager ID (required for consent mode)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX

# CookieScript ID (required for consent banner)
NEXT_PUBLIC_COOKIESCRIPT_ID=your_cookiescript_id_here
```

Replace:
- `GTM-XXXXXX` with your actual GTM ID
- `your_cookiescript_id_here` with your CookieScript ID

### 4. Configure CookieScript Settings

After adding the environment variables:

1. Go to [CookieScript Console](https://console.cookiescript.com)
2. Click on your website
3. Go to **Settings → Banner**
4. Configure:
   - Banner position (top/bottom)
   - Banner text and colors
   - Cookie categories (Analytics, Marketing, Functional, Necessary)
   - Accept/Decline buttons

5. Go to **Settings → Installation** tab
6. Copy your banner code (should match your CookieScript ID)

### 5. Configure GTM Consent Mapping

1. In [Google Tag Manager](https://tagmanager.google.com):
2. Go to **Admin → Container Settings → Consent Overviews**
3. Enable consent features:
   - ✅ ad_storage
   - ✅ analytics_storage
   - ✅ personalization_storage
   - ✅ functionality_storage
   - ✅ security_storage

4. Set default states to **Denied** (except security_storage which should be **Granted**)

## How It Works

### Flow Chart

```
User visits site
    ↓
ConsentManager initializes (denies all consents by default)
    ↓
CookieScript banner appears (after 2 second wait)
    ↓
User clicks Accept/Decline/Manage
    ↓
CookieScriptConsent event fired
    ↓
ConsentManager updates GTM consent state
    ↓
GTM respects consent settings for all tags
```

### Consent Categories

The system tracks these consent states:

| Category | Purpose | GTM Mapping |
|----------|---------|-------------|
| **Necessary** | Essential for site function | security_storage |
| **Functional** | Enhanced user experience | functionality_storage |
| **Analytics** | Usage tracking & optimization | analytics_storage |
| **Marketing** | Retargeting & ads | ad_storage, personalization_storage |

## Testing Your Setup

### 1. Local Testing

```bash
npm run dev
```

### 2. Check Console

In your browser DevTools Console, you should see:
- CookieScript banner appearing
- `CookieScriptConsent` events when you interact with the banner
- GTM consent updates logged

### 3. Test Consent Updates

1. Open DevTools → Application → Cookies
2. Accept/Decline cookies using the banner
3. Observe:
   - New cookies created in browser
   - GTM consent state updated
   - Event logged: `window.gtag('consent', 'update', ...)`

### 4. Verify in GTM

1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Click **Preview** mode
3. Visit your website
4. In the preview panel, look for:
   - `consent` events
   - Correct state values (granted/denied)

## Environment Variables Reference

```env
# Required for consent mode
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX

# Required for banner
NEXT_PUBLIC_COOKIESCRIPT_ID=your_id_here

# Optional: Still use GA directly (alongside GTM)
NEXT_PUBLIC_GA_ID=G-XXXXXX
```

**Note**: You can use both GTM and GA simultaneously. GTM respects consent settings, while GA (if used directly) will also respect them through the ConsentManager.

## Troubleshooting

### Banner not appearing
- Check that `NEXT_PUBLIC_COOKIESCRIPT_ID` is set correctly
- Ensure you've deployed or restarted `npm run dev`
- Check browser console for errors

### GTM consent not updating
- Verify `NEXT_PUBLIC_GTM_ID` is set
- Check that CookieScript is loaded first
- Open DevTools → Console and look for errors
- Ensure you're using the correct event listener syntax

### Cookies not being set
- CookieScript must be loaded before other scripts
- Check browser storage/privacy settings
- Verify banner is clickable and functioning

## Files Modified/Created

- ✅ `src/components/ConsentManager.tsx` - New consent handler
- ✅ `src/app/layout.tsx` - Updated with scripts and ConsentManager

## Next Steps

1. ✅ Add environment variables to `.env.local`
2. ✅ Restart dev server: `npm run dev`
3. ✅ Test the banner appears
4. ✅ Configure GTM tags with consent restrictions
5. ✅ Deploy to production

## Support Resources

- [CookieScript Docs](https://help.cookiescript.com/)
- [GTM Consent Mode Guide](https://support.google.com/tagmanager/answer/10718981)
- [Google Consent Mode v2](https://support.google.com/google-ads/answer/10718981)
