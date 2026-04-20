import nodemailer from 'nodemailer'
import Settings from '../models/Settings.js'

/**
 * SMTP auth: Admin Settings first, then EMAIL_USER / EMAIL_PASS env.
 */
export async function resolveSmtpAuth() {
  const s = await Settings.getSettings()
  const user =
    (s.smtpUser && String(s.smtpUser).trim()) ||
    process.env.EMAIL_USER ||
    ''
  const pass =
    (s.smtpAppPassword && String(s.smtpAppPassword).trim()) ||
    process.env.EMAIL_PASS ||
    ''
  return { user, pass, hasAuth: Boolean(user && pass) }
}

export function createMailTransport(user, pass) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}
