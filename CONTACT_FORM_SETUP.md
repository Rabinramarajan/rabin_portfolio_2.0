# Contact Form Production Setup Guide

This guide ensures your portfolio contact form works reliably in production.

## Quick Start

1. **Verify your SMTP credentials** in `.env.local`:
   ```env
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=rabinr2607@zellavora.com
   SMTP_PASS=your-actual-password
   SMTP_FROM=rabinr2607@zellavora.com
   CONTACT_TO=rabinr.dev@gmail.com
   ```

2. **Enable message persistence** (saves submissions even if email fails):
   ```env
   CONTACT_PERSIST=file
   CONTACT_STORE_DIR=./.contact-messages
   ```

3. **Test the configuration**:
   ```bash
   # Using tsx (recommended)
   npx tsx src/lib/contact/test-smtp.ts rabinr.dev@gmail.com

   # Or with Node.js + ts-node
   node --loader ts-node/esm src/lib/contact/test-smtp.ts rabinr.dev@gmail.com
   ```

## What Changed (Production-Ready Improvements)

### 1. **Automatic Retries with Exponential Backoff**
- Transient errors (connection timeouts, temporary failures) are automatically retried
- Up to 3 attempts with exponential backoff (1s, 2s, 4s)
- Detects network issues vs. configuration errors

### 2. **Connection Management**
- Connection pooling and reuse (no new transporter per email)
- Configurable timeouts (connection: 10s, socket: 30s)
- Adaptive delay between connection attempts

### 3. **Persistent Message Storage**
- Messages are saved to disk even if email fails
- JSON format, easy to review and resend manually
- Located in `.contact-messages/` directory
- Protects against losing submissions due to SMTP outages

### 4. **Better Error Messages**
- Users get specific, helpful error messages
- Clear distinction between temporary and permanent failures
- Admin gets detailed server logs for debugging

### 5. **Diagnostic Tool**
- Built-in SMTP configuration tester
- Specific troubleshooting advice for each error type
- Can send test emails to verify setup

## Configuration Options

### Required Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `SMTP_HOST` | SMTP server hostname | `smtp.hostinger.com` |
| `SMTP_PORT` | SMTP port (465 or 587) | `465` |
| `SMTP_SECURE` | Use TLS (true for 465, false for 587) | `true` |
| `SMTP_USER` | SMTP authentication username | `rabinr2607@zellavora.com` |
| `SMTP_PASS` | SMTP authentication password | Your password |
| `SMTP_FROM` | From address in emails | `rabinr2607@zellavora.com` |
| `CONTACT_TO` | Where to receive submissions | `rabinr.dev@gmail.com` |

### Optional Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `CONTACT_ACK_EMAIL` | Send confirmation to visitor | `true` |
| `CONTACT_PERSIST` | Message storage mode: `memory` or `file` | `(none)` |
| `CONTACT_STORE_DIR` | Where to save messages (if PERSIST=file) | `./.contact-messages` |
| `CONTACT_ALLOW_UNCONFIGURED` | Allow form without email setup (dev only) | `false` |

## Troubleshooting

### Issue: "Email service is not configured yet"

**Solution**: Check that `.env.local` has all required SMTP variables.

```bash
# Verify environment variables are set
grep SMTP .env.local
```

### Issue: "Invalid login" / "Authentication failed"

**Causes**:
- Incorrect `SMTP_USER` or `SMTP_PASS`
- Account locked on SMTP server
- 2FA enabled (may block password auth)

**Solutions**:
1. Verify credentials in hosting control panel
2. Try logging in directly to verify password works
3. Check if your hosting requires an app-specific password
4. Disable 2FA temporarily to test, or use app password
5. Run the diagnostic tool: `npx tsx src/lib/contact/test-smtp.ts`

### Issue: "Connection refused" / "Connection timeout"

**Causes**:
- Wrong hostname or port
- Firewall blocking outgoing SMTP
- ISP blocking SMTP ports
- SMTP server is down

**Solutions**:
1. Verify SMTP_HOST is correct (check hosting docs)
2. Verify SMTP_PORT matches your setup (465 or 587)
3. Check firewall isn't blocking outbound port 465/587
4. Try from different network to isolate ISP issues
5. Contact hosting provider to verify SMTP is working
6. Run: `nslookup smtp.hostinger.com` to verify DNS

### Issue: "Certificate error" / "Self-signed certificate"

**Causes**:
- SMTP_SECURE setting doesn't match the port
- Server certificate issues

**Solutions**:
1. If using port 465: `SMTP_SECURE=true`
2. If using port 587: `SMTP_SECURE=false`
3. Try toggling the SMTP_SECURE value
4. Contact hosting provider about certificate issues

### Issue: Form says "submitted" but I don't receive emails

**Possible causes**:
1. **Acknowledgement failed** (your email address has typo or is spam-blocked)
   - Check server logs for: `[contact] acknowledgement failed`
   - The submission WAS sent to CONTACT_TO, user email didn't receive confirmation

2. **Email went to spam**
   - Check spam/junk folder for `CONTACT_TO` email
   - Add SMTP_FROM to your contacts to prevent this

3. **SMTP_SECURE/port mismatch**
   - Port 465 = implicit TLS, use `SMTP_SECURE=true`
   - Port 587 = STARTTLS, use `SMTP_SECURE=false`

4. **Recipient restrictions**
   - Some SMTP servers reject unknown recipients
   - Verify `CONTACT_TO` email can receive mail

5. **Messages stored but not sent** (check persistence)
   - Look in `.contact-messages/` directory
   - Review `CONTACT_PERSIST` environment variable

## Testing

### Test 1: Verify SMTP Connection

```bash
npx tsx src/lib/contact/test-smtp.ts
```

Expected output:
```
✅ SMTP connection successful!
```

### Test 2: Send Test Email

```bash
npx tsx src/lib/contact/test-smtp.ts rabinr.dev@gmail.com
```

Expected output:
```
✅ Test email sent successfully!
```

### Test 3: Verify in Browser

1. Start development server: `npm run dev`
2. Go to `http://localhost:3000/contact`
3. Fill out form and submit
4. Should see "Message received" with a reference ID
5. Check email at `CONTACT_TO` for the submission

## Production Deployment

### On Vercel or Similar Hosting

1. **Set environment variables** in your hosting dashboard:
   - Add all `SMTP_*` and `CONTACT_*` variables
   - **NEVER** commit `.env.local` to git

2. **Enable message persistence** for production:
   ```env
   CONTACT_PERSIST=file
   CONTACT_STORE_DIR=./.contact-messages
   ```

3. **Set up log monitoring**:
   - Monitor logs for `[contact]` errors
   - Watch for repeated authentication failures
   - Alert on SMTP connection timeouts

4. **Create backup routine**:
   - Periodically export `.contact-messages/` directory
   - Archive to S3 or similar backup storage
   - Consider external database for high volume

### Important Security Notes

- **Never commit `SMTP_PASS`** to git — use .gitignore for .env.local
- Use strong, unique SMTP passwords
- Consider app-specific passwords if available
- Don't share .env.local files via email or chat
- Rotate passwords periodically
- Use HTTPS only (automatic on Vercel)

## Monitoring & Maintenance

### Check Server Logs

Look for `[contact]` prefixed log messages:

```bash
# During development
npm run dev | grep '\[contact\]'

# After deployment, check hosting provider's log viewer
```

### Common Log Messages

| Log | Meaning | Action |
|-----|---------|--------|
| `[contact] notification email sent` | Success | None |
| `[contact] acknowledgement failed` | User email invalid/unreachable | Normal, submission was still sent |
| `[contact] SMTP error` | Email sending failed | Check credentials or SMTP status |
| `[contact] attempt N failed, retrying` | Transient error | System is recovering |

### Regular Checks

1. **Weekly**: Test form submission yourself
2. **Monthly**: Review messages in `.contact-messages/`
3. **Quarterly**: Update SMTP password if required by host
4. **After errors**: Run diagnostic tool to verify setup

## Performance Optimization

### Current Settings

- **Connection timeout**: 10 seconds
- **Socket timeout**: 30 seconds
- **Max retries**: 3 attempts
- **Retry delay**: Exponential backoff (1-4 seconds)
- **Message size limit**: 32 KB JSON, 50 MB attachment

### For High Volume (100+ submissions/day)

1. Consider using a transactional email service:
   - SendGrid
   - Mailgun
   - AWS SES
   - Postmark

2. Or add queue/background job system:
   - Vercel Queues
   - Bull/Redis
   - Trigger.dev

## Support & Debugging

For detailed error information, enable enhanced logging:

```bash
# In terminal before running server
export DEBUG=contact:*
npm run dev
```

For SMTP-specific debugging:

```bash
export DEBUG=nodemailer:*
npm run dev
```

## Files Modified for Production

- `src/lib/contact/email-service.ts` — Retry logic, connection pooling
- `src/lib/contact/contact-service.ts` — Better error handling
- `src/lib/contact/message-store.ts` — File-based persistence
- `src/app/api/contact/route.ts` — Enhanced error responses
- `src/lib/contact/test-smtp.ts` — New diagnostic tool

All changes are backward compatible. Existing `.env.local` files will continue to work.
