import nodemailer from "nodemailer";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: false,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass
  }
});

export async function sendEmail(to: string, subject: string, html: string) {
  if (!env.smtpHost) {
    logger.info("Email skipped because SMTP is not configured", { to, subject });
    return;
  }

  await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    html
  });
}
