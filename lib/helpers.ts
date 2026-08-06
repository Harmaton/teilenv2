import nodemailer from "nodemailer";
import crypto from "crypto";

export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export function generateInviteToken(): string {
  return crypto.randomBytes(32).toString("hex");
}