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

/** Manager inbox for hot leads; Settings first, then MANAGER_EMAIL env. */
export async function getManagerEmail() {
  const s = await Settings.getSettings()
  const fromSettings = (s.managerEmail && String(s.managerEmail).trim()) || ''
  const fromEnv = (process.env.MANAGER_EMAIL && String(process.env.MANAGER_EMAIL).trim()) || ''
  return fromSettings || fromEnv
}

/** Property consultant inbox; Settings first, then CONSULTANT_EMAIL env. */
export async function getPropertyConsultantEmail() {
  const s = await Settings.getSettings()
  const fromSettings = (s.propertyConsultantEmail && String(s.propertyConsultantEmail).trim()) || ''
  const fromEnv = (process.env.CONSULTANT_EMAIL && String(process.env.CONSULTANT_EMAIL).trim()) || ''
  return fromSettings || fromEnv
}

export function createMailTransport(user, pass) {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}
