# Contact Form Production-Ready Checklist

## ✅ Immediate Actions (Do These First)

### 1. Fix SMTP_FROM Issue (Most Common Problem)
```env
# In .env.local - These MUST match
SMTP_USER=rabinr2607@zellavora.com
SMTP_FROM=rabinr2607@zellavora.com  ← SAME AS SMTP_USER
```

**Why**: Hostinger's SMTP server only allows you to send FROM your own authenticated email address.

### 2. Test the Configuration
```bash
# Install dependencies
npm install

# Test SMTP connection
npm run contact:test

# Expected output: ✅ SMTP connection successful!
```

### 3. Send Test Email
```bash
npm run contact:test rabinr.dev@gmail.com
```

**Check**:
- Email arrives in `rabinr.dev@gmail.com`
- NOT in spam folder
- From address is `rabinr2607@zellavora.com`

---

## ✅ Configuration Verification

| Setting | Your Value | Status |
|---------|-----------|--------|
| `SMTP_HOST` | `smtp.hostinger.com` | ✅ Correct |
| `SMTP_PORT` | `465` | ✅ Correct |
| `SMTP_SECURE` | `true` | ✅ Correct (required for port 465) |
| `SMTP_USER` | `rabinr2607@zellavora.com` | ✅ Verify in Hostinger |
| `SMTP_PASS` | `Rabin@6992` | ⚠️ Verify works by logging in |
| `SMTP_FROM` | `rabinr2607@zellavora.com` | **MUST match SMTP_USER** |
| `CONTACT_TO` | `rabinr.dev@gmail.com` | ✅ Verify is real Gmail |
| `CONTACT_PERSIST` | `file` | ✅ Messages saved to disk |

---

## ✅ Production Setup

### Step 1: Verify DNS Records (SPF)
```bash
# Check SPF record exists
nslookup -type=TXT zellavora.com

# Should see something like:
# v=spf1 include:hostinger.com ~all
```

**If missing**: Add to Hostinger DNS settings

### Step 2: Deploy to Production
```bash
# Build
npm run build

# Test before deploying
npm run contact:test

# Deploy when tests pass
npm run dev  # or deploy to Vercel
```

### Step 3: Test in Production
1. Go to `https://www.rabinr.in/contact`
2. Fill out form with **your own email** as visitor email
3. Submit
4. Verify:
   - "Message received" appears
   - You get notification at `CONTACT_TO` (rabinr.dev@gmail.com)
   - You receive confirmation email (if using your email)
   - Message saved in `.contact-messages/RR-*.json`

---

## 🔍 Troubleshooting Guide

### Issue: "Email service is not configured"
**Fix**:
```bash
grep SMTP .env.local
# Must show all SMTP_* variables

# If missing, add them
npm run contact:test
```

### Issue: "Authentication failed"
**Fix**:
1. Verify password in Hostinger is correct
2. Try logging in directly: `telnet smtp.hostinger.com 465`
3. Or try SMTP port 587 with `SMTP_SECURE=false`

```env
# Alternative configuration
SMTP_PORT=587
SMTP_SECURE=false
```

### Issue: "Connection timeout"
**Fix**:
```bash
# Test if Hostinger is reachable
nslookup smtp.hostinger.com

# Should return IP address
```

If fails, Hostinger might be down or network blocked.

### Issue: "Invalid from address" or Mails Bounce
**Fix**:
1. **CRITICAL**: Verify `SMTP_FROM` matches `SMTP_USER`
2. In Hostinger, confirm email is set up as a mailbox
3. Wait 15 minutes for settings to propagate
4. Test: `npm run contact:test`

### Issue: "Notification arrives but visitor doesn't get confirmation"
**This is OK and expected** if:
- Visitor typed wrong email address
- Visitor's email provider blocked your email
- You have `CONTACT_ACK_EMAIL=false`

**Message was still saved** to `.contact-messages/` directory.

### Issue: Emails work locally but fail in production
**Check**:
1. Environment variables set in hosting dashboard
2. `.env.local` not uploaded to server (should be in .gitignore)
3. Run: `npm run contact:test` in production environment
4. Check Vercel/hosting logs for `[contact]` errors

---

## 📊 Monitoring & Debugging

### View Mail Logs
```bash
# During development
npm run dev 2>&1 | grep '\[contact:mail\]'

# In production, check hosting logs
# Look for [contact:mail] entries
```

### Check Sent Messages
```bash
# View all stored messages
ls -la .contact-messages/

# View specific message
cat .contact-messages/RR-2025-01-*.json | jq

# Count messages
ls .contact-messages/ | wc -l
```

### Enable Debug Mode
```bash
# Show detailed SMTP debugging
DEBUG=nodemailer:* npm run contact:test

# Show all contact module debug info
DEBUG=contact:* npm run dev
```

---

## 📋 What's New in This Version

| Feature | Benefit |
|---------|---------|
| **Automatic Retries** | Failed emails retry up to 3x with backoff |
| **Connection Pooling** | Reuses connections instead of creating new ones each time |
| **Persistent Storage** | Messages saved to disk even if SMTP fails |
| **Better Errors** | Specific error messages help identify problems |
| **Mail Logging** | Track all email events: sent, bounced, failed, retried |
| **Diagnostic Tool** | `npm run contact:test` identifies issues automatically |
| **Bounce Detection** | Distinguishes between transient and permanent failures |

---

## 🚀 Common Success Scenarios

### Scenario 1: Form Works, Emails in Spam
**Problem**: Email delivered but in spam folder

**Solution**:
1. Add `rabinr2607@zellavora.com` to contacts
2. Mark email as "not spam"
3. Check SPF records are set

### Scenario 2: Visitor Never Sees Confirmation
**Problem**: Notification sent to you, but visitor email doesn't arrive

**Expected**: This happens when visitor types wrong email—they don't know it's wrong

**Solution**: In form, show visitor their email is being used. Or disable ack email:
```env
CONTACT_ACK_EMAIL=false
```

### Scenario 3: High Volume of Submissions
**Problem**: Some emails start failing after many submissions

**Cause**: Rate limiting on SMTP server

**Solution**:
1. Contact Hostinger: "Can I increase SMTP rate limit to [X]/day?"
2. Or space out submissions (don't test with 100 emails in a row)

---

## ✅ Final Checklist Before Going Live

- [ ] `SMTP_FROM` matches `SMTP_USER`
- [ ] `npm run contact:test` passes ✅
- [ ] Test email arrives in inbox (not spam)
- [ ] `.env.local` is in `.gitignore`
- [ ] `CONTACT_PERSIST=file` enabled
- [ ] `.contact-messages/` directory exists
- [ ] Form tested in browser (localhost:3000/contact)
- [ ] Message received confirmation shows
- [ ] Email received at `CONTACT_TO`
- [ ] Message saved in `.contact-messages/`
- [ ] Deployment tested (if using Vercel)
- [ ] Production URL tested (https://www.rabinr.in/contact)

---

## 🆘 Still Having Issues?

1. **Run diagnostic tool**: `npm run contact:test`
2. **Check logs**: `npm run dev | grep '\[contact'`
3. **Read troubleshooting**: See `MAIL_DELIVERY_TROUBLESHOOTING.md`
4. **Review setup**: See `CONTACT_FORM_SETUP.md`
5. **Contact Hostinger**:
   - Tell them you're sending via SMTP
   - Ask if `rabinr2607@zellavora.com` is authorized for SMTP
   - Ask about rate limits and SPF records

---

## 📞 Quick Support

| Issue | Quick Fix |
|-------|-----------|
| Connection refused | Check SMTP_HOST and SMTP_PORT |
| Authentication failed | Verify SMTP_USER and SMTP_PASS |
| Invalid from address | Make sure SMTP_FROM matches SMTP_USER |
| Mail bounce (550 error) | SMTP_FROM not authorized—must match SMTP_USER |
| Timeout | Try port 587 with SMTP_SECURE=false |
| Still in spam | Check SPF records in Hostinger DNS |

---

## File Reference

- **Setup Guide**: `CONTACT_FORM_SETUP.md`
- **Mail Delivery Issues**: `MAIL_DELIVERY_TROUBLESHOOTING.md`
- **Main Config**: `.env.local`
- **Email Service**: `src/lib/contact/email-service.ts`
- **Diagnostic Tool**: `src/lib/contact/test-smtp.ts`
- **Message Storage**: `src/lib/contact/message-store.ts`
- **Mail Logging**: `src/lib/contact/mail-logger.ts`

---

## Key Success Metric

**Your contact form is production-ready when**:
```
✅ npm run contact:test passes
✅ Test email arrives in your inbox
✅ Form submission shows "Message received"
✅ You receive notification email
✅ Message appears in .contact-messages/
```

Then you're ready for production! 🚀
