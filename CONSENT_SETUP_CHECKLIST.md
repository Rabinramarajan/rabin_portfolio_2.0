# Consent Mode Setup Checklist ✅

## 🚀 Quick Start (5 minutes)

### Step 1: Get CookieScript ID (2 min)
- [ ] Go to https://cookiescript.com
- [ ] Sign up / Log in
- [ ] Create a new website
- [ ] Copy your **CookieScript ID** (e.g., `abc123def456`)
- [ ] Save it somewhere safe

### Step 2: Get GTM ID (2 min)
- [ ] Go to https://tagmanager.google.com
- [ ] Create account or use existing
- [ ] Create a container for your website
- [ ] Copy your **GTM ID** (e.g., `GTM-ABC1234`)
- [ ] Save it somewhere safe

### Step 3: Update .env.local (1 min)
Add these two lines to `.env.local`:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
NEXT_PUBLIC_COOKIESCRIPT_ID=your_id_here
```

Example:
```env
NEXT_PUBLIC_GTM_ID=GTM-ABC1234
NEXT_PUBLIC_COOKIESCRIPT_ID=abc123def456
```

### Step 4: Restart & Test
```bash
# Stop running dev server (Ctrl+C)
npm run dev
```

Visit http://localhost:3000 and you should see:
- ✅ CookieScript banner appears after 2 seconds
- ✅ Accept/Decline buttons work
- ✅ Cookies are set/updated in browser storage

---

## 📋 After Initial Setup

### In CookieScript Console
- [ ] Customize banner colors/text (https://console.cookiescript.com)
- [ ] Set banner position (top/bottom)
- [ ] Configure which cookies to track
- [ ] Test banner on your local site

### In Google Tag Manager
- [ ] Go to https://tagmanager.google.com
- [ ] Click **Preview** to enable test mode
- [ ] Visit your website
- [ ] Look for consent events in preview panel
- [ ] Verify all consent states show as "denied" (default)

---

## 🔍 How to Verify It's Working

### Browser DevTools Test

1. Open your website
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. You should see:
   - Initial GTM consent defaults (analytics_storage: denied, etc.)
   - CookieScript banner appears
   - When you click accept/decline: `CookieScriptConsent` event

### Storage Tab Test

1. Go to **Application** tab in DevTools
2. Click **Cookies** → **http://localhost:3000**
3. Before accepting: No CookieScript cookies yet
4. After accepting: Multiple cookies appear (cookiescript_*, _ga_*, etc.)

### GTM Preview Test

1. Open Google Tag Manager
2. Click the **Preview** button (top right)
3. Enter your website URL: `http://localhost:3000`
4. Preview window opens on left
5. In preview, look for:
   - `gtm.js` event
   - `consent` events
   - State showing "denied" by default

---

## 📦 What Was Added to Your Project

### New Files
```
src/
├── components/
│   └── ConsentManager.tsx          ← Handles consent updates
├── types/
│   └── gtag.d.ts                   ← TypeScript types
```

### Modified Files
```
src/app/layout.tsx                   ← Added ConsentManager & scripts
```

### Documentation
```
CONSENT_MODE_SETUP.md               ← Full setup guide
CONSENT_SETUP_CHECKLIST.md         ← This file
```

---

## 🎯 Next Level: Tag Configuration

Once everything is working, you'll want to configure individual GTM tags to respect consent:

### For Google Analytics tag:
- Trigger: "Consent - Analytics Granted"
- Settings: Respect consent state

### For Google Ads tag:
- Trigger: "Consent - Ads Granted"
- Settings: Respect consent state

**See [GTM Docs](https://support.google.com/tagmanager/answer/10718981) for detailed steps**

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Banner not showing | Check env vars are set, restart server |
| GTM events not firing | Verify GTM ID in Google Tag Manager exists |
| Cookies not setting | Check browser privacy settings, clear cache |
| Types missing | Run `npm run typecheck` to verify |

---

## 📞 Support Links

- **CookieScript Help**: https://help.cookiescript.com/
- **GTM Consent Mode**: https://support.google.com/tagmanager/answer/10718981
- **Google Consent Mode v2**: https://support.google.com/google-ads/answer/10718981

---

## Status

- [x] Code setup complete
- [x] ConsentManager component created
- [x] Layout updated with scripts
- [ ] CookieScript ID added (YOUR ACTION)
- [ ] GTM ID added (YOUR ACTION)
- [ ] Local testing done (YOUR ACTION)
- [ ] Deployed to production (YOUR ACTION)

**👉 Next: Get your CookieScript ID and GTM ID, then add them to `.env.local`**
