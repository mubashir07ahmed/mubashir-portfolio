import { profileData } from '../shared/profileData.js';

const resendEndpoint = 'https://api.resend.com/emails';
const requestTimeoutMs = 8_000;
const senderAddress = 'Mubashir Ahmed <contact@mail.mubashirr.in>';
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export class ContactDeliveryError extends Error {
  constructor(code, statusCode) {
    super(code);
    this.name = 'ContactDeliveryError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function validateContactSubmission(input) {
  const body = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const companyFax = typeof body.companyFax === 'string' ? body.companyFax.trim() : '';
  if (companyFax) return { ok: true, honeypot: true };

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? body.message.replace(/\0/g, '').trim() : '';
  if (name.length < 2 || name.length > 80 || /[\r\n\u0000-\u001f\u007f]/.test(name)) {
    return { ok: false, error: 'Enter a name between 2 and 80 characters.' };
  }
  if (email.length > 120 || !emailPattern.test(email)) {
    return { ok: false, error: 'Enter a valid email address.' };
  }
  if (message.length < 10 || message.length > 2_000) {
    return { ok: false, error: 'Enter a message between 10 and 2,000 characters.' };
  }
  return { ok: true, honeypot: false, value: { name, email, message } };
}

export async function sendContactEmail({ name, email, message }) {
  if (process.env.NODE_ENV !== 'production' || process.env.CONTACT_EMAIL_ENABLED !== 'true') {
    throw new ContactDeliveryError('sending_disabled', 503);
  }
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new ContactDeliveryError('missing_configuration', 503);
  const recipient = profileData.contact.email;
  if (!emailPattern.test(recipient)) throw new ContactDeliveryError('missing_recipient', 503);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(resendEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderAddress,
        to: [recipient],
        reply_to: email,
        subject: 'New message from the Mubashir portfolio',
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) throw new ContactDeliveryError('provider_rejected', response.status);
    if (typeof result?.id !== 'string' || !result.id) throw new ContactDeliveryError('provider_response_invalid', 502);
    return { id: result.id };
  } catch (error) {
    if (error instanceof ContactDeliveryError) throw error;
    throw new ContactDeliveryError(error?.name === 'AbortError' ? 'provider_timeout' : 'provider_unavailable', 502);
  } finally {
    clearTimeout(timeout);
  }
}
