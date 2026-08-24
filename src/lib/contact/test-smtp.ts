/**
 * SMTP Configuration Diagnostic Tool
 *
 * Run locally to verify your SMTP setup:
 * node -e "require('ts-node').register(); require('./src/lib/contact/test-smtp.ts').testSmtp()"
 *
 * Or use in scripts: tsx src/lib/contact/test-smtp.ts
 */

import { SmtpEmailProvider } from "./email-service";

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
}

async function testSmtpConnection(config: SmtpConfig): Promise<{
  success: boolean;
  message: string;
  details?: Record<string, any>;
}> {
  console.log("\n🔍 Testing SMTP Configuration...\n");
  console.log("Configuration:");
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  Secure: ${config.secure}`);
  console.log(`  Auth: ${config.user ? "Yes (user provided)" : "No"}\n`);

  try {
    const nodemailer = await import("nodemailer");

    // Test connection without sending
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.user ? { user: config.user, pass: config.pass } : undefined,
      connectionTimeout: 10 * 1000,
      socketTimeout: 15 * 1000,
    });

    console.log("⏳ Attempting SMTP connection...");
    await transporter.verify();

    console.log("✅ SMTP connection successful!\n");
    return {
      success: true,
      message: "SMTP is properly configured and accessible",
      details: {
        host: config.host,
        port: config.port,
        secure: config.secure,
        authenticated: !!config.user,
      },
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("❌ SMTP connection failed!\n");
    console.error("Error:", err.message);
    console.error("Code:", (error as any)?.code);

    // Provide specific troubleshooting advice
    let troubleshooting = "";

    if (err.message.includes("ECONNREFUSED")) {
      troubleshooting = `
Troubleshooting: ECONNREFUSED
- The server refused the connection. Check:
  1. SMTP_HOST is correct (${config.host})
  2. SMTP_PORT is correct (${config.port})
  3. No firewall is blocking the connection
  4. Your ISP/network isn't blocking SMTP
      `;
    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("timeout")) {
      troubleshooting = `
Troubleshooting: Connection Timeout
- The connection timed out. Check:
  1. SMTP_HOST is reachable (try: nslookup ${config.host})
  2. SMTP_PORT (${config.port}) is open
  3. No firewall is blocking the port
  4. Network connectivity to the SMTP server
      `;
    } else if (err.message.includes("Invalid login") || err.message.includes("authentication")) {
      troubleshooting = `
Troubleshooting: Authentication Failed
- SMTP credentials are incorrect. Check:
  1. SMTP_USER (username/email) is correct
  2. SMTP_PASS (password) is correct
  3. No special characters need escaping in password
  4. Account is not locked on the SMTP server
  5. 2FA might be blocking password login
      `;
    } else if (err.message.includes("certificate") || err.message.includes("self-signed")) {
      troubleshooting = `
Troubleshooting: Certificate/TLS Error
- There's an issue with TLS verification. Check:
  1. SMTP_SECURE is set correctly (true for port 465, false for 587)
  2. The SMTP server certificate is valid
  3. Try toggling SMTP_SECURE to opposite value
      `;
    }

    return {
      success: false,
      message: `SMTP connection failed: ${err.message}`,
      details: {
        error: err.message,
        code: (error as any)?.code,
        host: config.host,
        port: config.port,
        secure: config.secure,
        troubleshooting: troubleshooting.trim(),
      },
    };
  }
}

async function sendTestEmail(
  config: SmtpConfig,
  testEmail: string,
): Promise<{
  success: boolean;
  message: string;
}> {
  console.log("\n📧 Sending Test Email...\n");
  console.log(`Test email will be sent to: ${testEmail}\n`);

  try {
    const provider = new SmtpEmailProvider(config);

    await provider.send({
      to: testEmail,
      from: config.user || "noreply@example.com",
      subject: "SMTP Test - Portfolio Contact Form",
      text: "If you received this, your SMTP configuration is working correctly!",
      html: "<p>If you received this, your SMTP configuration is working correctly!</p>",
    });

    console.log("✅ Test email sent successfully!\n");
    return {
      success: true,
      message: "Test email sent successfully",
    };
  } catch (error) {
    console.error("❌ Failed to send test email!\n");
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Error:", err.message);

    return {
      success: false,
      message: `Failed to send test email: ${err.message}`,
    };
  }
}

export async function testSmtp(testEmail?: string) {
  const config: SmtpConfig = {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };

  if (!config.host) {
    console.error("❌ SMTP_HOST is not set. Please configure your environment variables.");
    process.exit(1);
  }

  const connectionResult = await testSmtpConnection(config);
  console.log("\nResult:", connectionResult.message);

  if (connectionResult.details?.troubleshooting) {
    console.log(connectionResult.details.troubleshooting);
  }

  if (connectionResult.success && testEmail) {
    const emailResult = await sendTestEmail(config, testEmail);
    console.log("Result:", emailResult.message);
  }

  if (!connectionResult.success) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const testEmail = process.argv[2] || process.env.CONTACT_TO;
  testSmtp(testEmail).catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
