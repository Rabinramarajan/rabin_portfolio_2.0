# Mail Delivery Troubleshooting

When emails are **returned to sender** or **undelivered**, it's usually one of these issues:

## 🔴 Most Common Problem: SMTP_FROM Not Authorized

**Symptom**: Emails bounce back with error like "550 Relaying denied" or "501 Invalid from address"

**Solution**: The FROM address must match an authorized sender on your SMTP server.

```env
# ❌ WRONG - This will bounce
SMTP_USER=rabinr2607@zellavora.com
SMTP_FROM=noreply@example.com    # Different from SMTP_USER

# ✅ CORRECT - Must match or be authorized
SMTP_USER=rabinr2607@zellavora.com
SMTP_FROM=rabinr2607@zellavora.com    # Same as SMTP_USER
```

**Fix**: Verify in your Hostinger control panel:
1. Go to Email settings
2. Confirm `rabinr2607@zellavora.com` is set up as a valid mailbox
3. Set `SMTP_FROM` to this same address
4. Test: `npm run contact:test`

---

## 🔴 Issue 2: Missing SPF/DKIM Records

**Symptom**: Emails delivered to spam folder or rejected by receiving mail server

**How SPF works**: Receiving servers check if your SMTP server is authorized to send from your domain.

**Fix**:
1. Log into Hostinger DNS settings
2. Add SPF record:
   ```
   v=spf1 include:hostinger.com ~all
   ```
3. Add DKIM record (provided by Hostinger)
4. Add DMARC record (optional but recommended):
   ```
   v=DMARC1; p=quarantine; rua=mailto:dmarc@zellavora.com
   ```
5. Wait 24-48 hours for DNS propagation
6. Test: `npm run contact:test`

**To verify SPF is set**:
```bash
# On Windows PowerShell
nslookup -type=TXT zellavora.com

# On Mac/Linux
dig zellavora.com TXT
```

Look for a record starting with `v=spf1`

---

## 🔴 Issue 3: CONTACT_TO Email Invalid or Unreachable

**Symptom**: Notification email bounces but other emails work

**Check**: Is `CONTACT_TO` a real, active email address?

```env
# Make sure this email exists and accepts mail
CONTACT_TO=rabinr.dev@gmail.com
```

**Fix**:
1. Send a test email to this address from your personal email
2. Verify it arrives
3. If it doesn't, the address might be blocked, full, or invalid
4. Update to a working email address
5. Test: `npm run contact:test rabinr.dev@gmail.com`

---

## 🔴 Issue 4: SMTP Server Blocking Your Relay

**Symptom**: Error like "550 User not local" or "Relay access denied"

**Cause**: Hostinger's SMTP server only allows authenticated users to send FROM their own addresses.

**Fix**:
```env
# This MUST be the email address you're authenticating with
SMTP_USER=rabinr2607@zellavora.com
SMTP_FROM=rabinr2607@zellavora.com    # MUST match SMTP_USER
```

---

## 🔴 Issue 5: Acknowledgement Email Bouncing

**Symptom**: Notification arrives (you get the contact submission) but visitor doesn't get confirmation

**Cause**: Visitor's email address has typo or doesn't accept mail

**This is NORMAL and OK**:
- Message was still saved to disk (`.contact-messages/`)
- Notification was sent to you
- Only the confirmation to the visitor failed (which is expected if they entered wrong email)

**To disable acknowledgement emails**:
```env
CONTACT_ACK_EMAIL=false
```

---

## 🔴 Issue 6: Rate Limiting (Too Many Emails)

**Symptom**: Emails work at first, then start bouncing

**Cause**: Hostinger rate-limits SMTP to prevent spam

**Fix**:
1. Space out test emails (don't send 10 in a row)
2. Check Hostinger limits (usually 100-300/day)
3. If high volume, contact Hostinger to increase limits

---

## ✅ Complete Diagnostic Checklist

Run through this to identify the problem:

### Step 1: Verify Configuration
```bash
# Check your env file has these
grep "SMTP_" .env.local
grep "CONTACT_" .env.local
```

**Must have**:
- `SMTP_HOST=smtp.hostinger.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER=rabinr2607@zellavora.com` (real Hostinger email)
- `SMTP_PASS=Rabin@6992` (correct password)
- `SMTP_FROM=rabinr2607@zellavora.com` (**MUST match SMTP_USER**)
- `CONTACT_TO=rabinr.dev@gmail.com` (real Gmail address)

### Step 2: Test SMTP Connection
```bash
npm run contact:test
```

**Should see**: `✅ SMTP connection successful!`

If not, fix the error shown.

### Step 3: Send Test Email
```bash
npm run contact:test rabinr.dev@gmail.com
```

**Check**:
- Message appears in your inbox (not spam)
- If in spam, check sender address and SPF records

### Step 4: Test Form Submission
1. Go to `http://localhost:3000/contact`
2. Fill out form with **your own email** as visitor email
3. Submit
4. Check both:
   - Notification in `CONTACT_TO` (rabinr.dev@gmail.com)
   - Confirmation in your personal email (the one you used in form)

### Step 5: Check Message Storage
```bash
# View stored messages (even if email failed)
ls -la .contact-messages/

# View a specific message
cat .contact-messages/RR-*.json
```

---

## 🔧 Advanced: Check Bounce/Delivery Logs

### In Hostinger Control Panel:
1. Go to Email → Logs
2. Check for bounce messages
3. Look for error codes like:
   - `550` = Permanent failure (address problem)
   - `421`/`450` = Temporary failure (try again)
   - `553` = Invalid sender address

### Common Error Codes:
```
550 5.1.1  → Recipient doesn't exist
550 5.1.2  → Sender not authorized to send
550 5.2.1  → Mailbox full
550 5.3.1  → Server issues
553 5.1.8  → Domain doesn't exist
```

---

## 🚀 Fix Priority Order

1. **FIRST**: Verify `SMTP_FROM` matches `SMTP_USER` ← This is usually the problem
2. **SECOND**: Test with `npm run contact:test`
3. **THIRD**: Check SPF records in DNS
4. **FOURTH**: Verify `CONTACT_TO` email is real
5. **FIFTH**: Check Hostinger SMTP rate limits

---

## 📋 Example: Correct Production Setup

```env
# Hostinger SMTP Setup
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=rabinr2607@zellavora.com
SMTP_PASS=Rabin@6992
SMTP_FROM=rabinr2607@zellavora.com          # ← MUST match SMTP_USER

# Email Recipients
CONTACT_TO=rabinr.dev@gmail.com             # Where YOU receive submissions
CONTACT_ACK_EMAIL=true                       # Send visitor confirmation

# Storage
CONTACT_PERSIST=file
CONTACT_STORE_DIR=./.contact-messages
```

---

## 🆘 Still Not Working?

1. **Check server logs**:
   ```bash
   npm run dev 2>&1 | grep -i '\[contact\]\|\[mail\]\|error'
   ```

2. **Contact Hostinger support with**:
   - Your domain: `zellavora.com`
   - Your email: `rabinr2607@zellavora.com`
   - Error message from bounced mail
   - Ask: "Can I send mail via SMTP with SMTP_FROM matching SMTP_USER?"

3. **Try alternative port**:
   ```env
   SMTP_PORT=587
   SMTP_SECURE=false
   ```
   Then test: `npm run contact:test`

4. **Enable debug logging**:
   ```bash
   DEBUG=nodemailer:* npm run contact:test
   ```

---

## Key Takeaway

**90% of mail delivery issues are caused by `SMTP_FROM` not matching the authorized sender.**

**Solution**: Make sure `SMTP_FROM` is exactly the same as your Hostinger email (`rabinr2607@zellavora.com`)

After fixing, test immediately: `npm run contact:test`
