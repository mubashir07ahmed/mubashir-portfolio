import test from 'node:test';
import assert from 'node:assert/strict';
import { profileData } from '../shared/profileData.js';
import { ContactDeliveryError, sendContactEmail, validateContactSubmission } from './contactEmail.js';

const validInput = {
  name: 'Jane Smith',
  email: 'jane@example.org',
  message: 'I would like to discuss a possible collaboration.',
};
const fixedSender = 'Mubashir Ahmed <contact@mail.mubashirr.in>';

function restoreEnv(name, previous) {
  if (previous === undefined) delete process.env[name];
  else process.env[name] = previous;
}

test('contact submissions are trimmed and validated before delivery', () => {
  const result = validateContactSubmission({ ...validInput, name: '  Jane Smith  ', email: ' jane@example.org ' });
  assert.deepEqual(result, { ok: true, honeypot: false, value: validInput });
});

test('invalid contact fields are rejected and bot honeypots are accepted without delivery', () => {
  assert.equal(validateContactSubmission({ ...validInput, email: 'not-an-email' }).ok, false);
  assert.equal(validateContactSubmission({ ...validInput, email: 'jane@example.org\r\nBcc:other@example.org' }).ok, false);
  assert.equal(validateContactSubmission({ ...validInput, name: 'Jane\r\nBcc:other@example.org' }).ok, false);
  assert.equal(validateContactSubmission({ ...validInput, message: 'short' }).ok, false);
  assert.deepEqual(validateContactSubmission({ companyFax: 'filled by bot' }), { ok: true, honeypot: true });
});

test('contact mail stays blocked by default even if a Resend key is present', async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousGate = process.env.CONTACT_EMAIL_ENABLED;
  const previousNodeEnv = process.env.NODE_ENV;
  const previousFetch = globalThis.fetch;
  process.env.RESEND_API_KEY = 'test-resend-send-key';
  process.env.CONTACT_EMAIL_ENABLED = 'false';
  process.env.NODE_ENV = 'production';
  let fetchCalled = false;
  globalThis.fetch = async () => {
    fetchCalled = true;
    return new Response(JSON.stringify({ id: 'should-not-send' }), { status: 200 });
  };
  try {
    await assert.rejects(sendContactEmail(validInput), (error) => {
      assert.equal(error.code, 'sending_disabled');
      assert.equal(error.statusCode, 503);
      return true;
    });
    assert.equal(fetchCalled, false);
  } finally {
    globalThis.fetch = previousFetch;
    restoreEnv('RESEND_API_KEY', previousKey);
    restoreEnv('CONTACT_EMAIL_ENABLED', previousGate);
    restoreEnv('NODE_ENV', previousNodeEnv);
  }
});

test('contact mail is blocked outside production even when the enable flag is present', async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousGate = process.env.CONTACT_EMAIL_ENABLED;
  const previousNodeEnv = process.env.NODE_ENV;
  const previousFetch = globalThis.fetch;
  process.env.RESEND_API_KEY = 'test-resend-send-key';
  process.env.CONTACT_EMAIL_ENABLED = 'true';
  process.env.NODE_ENV = 'development';
  let fetchCalled = false;
  globalThis.fetch = async () => {
    fetchCalled = true;
    return new Response(JSON.stringify({ id: 'should-not-send' }), { status: 200 });
  };
  try {
    await assert.rejects(sendContactEmail(validInput), (error) => {
      assert.equal(error.code, 'sending_disabled');
      assert.equal(error.statusCode, 503);
      return true;
    });
    assert.equal(fetchCalled, false);
  } finally {
    globalThis.fetch = previousFetch;
    restoreEnv('RESEND_API_KEY', previousKey);
    restoreEnv('CONTACT_EMAIL_ENABLED', previousGate);
    restoreEnv('NODE_ENV', previousNodeEnv);
  }
});

test('contact mail uses the fixed sender, profile recipient, plain text, and visitor reply-to', async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousGate = process.env.CONTACT_EMAIL_ENABLED;
  const previousNodeEnv = process.env.NODE_ENV;
  const previousFrom = process.env.RESEND_FROM_EMAIL;
  const previousFetch = globalThis.fetch;
  process.env.RESEND_API_KEY = 'test-resend-send-key';
  process.env.CONTACT_EMAIL_ENABLED = 'true';
  process.env.NODE_ENV = 'production';
  process.env.RESEND_FROM_EMAIL = 'Attacker <spoof@example.org>\r\nBcc:other@example.org';
  let requestUrl = '';
  let requestOptions;
  globalThis.fetch = async (url, options) => {
    requestUrl = String(url);
    requestOptions = options;
    return new Response(JSON.stringify({ id: 'email_test_123' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const result = await sendContactEmail(validInput);
    assert.deepEqual(result, { id: 'email_test_123' });
    assert.equal(requestUrl, 'https://api.resend.com/emails');
    assert.equal(requestOptions.headers.Authorization, 'Bearer test-resend-send-key');
    const body = JSON.parse(requestOptions.body);
    assert.equal(body.from, fixedSender);
    assert.deepEqual(body.to, [profileData.contact.email]);
    assert.equal(body.reply_to, validInput.email);
    assert.equal(body.subject, 'New message from the Mubashir portfolio');
    assert.equal(body.text, `Name: ${validInput.name}\nEmail: ${validInput.email}\n\n${validInput.message}`);
    assert.equal('html' in body, false);
  } finally {
    globalThis.fetch = previousFetch;
    restoreEnv('RESEND_API_KEY', previousKey);
    restoreEnv('CONTACT_EMAIL_ENABLED', previousGate);
    restoreEnv('NODE_ENV', previousNodeEnv);
    restoreEnv('RESEND_FROM_EMAIL', previousFrom);
  }
});

test('Resend failures expose only a safe error code, not provider response content', async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousGate = process.env.CONTACT_EMAIL_ENABLED;
  const previousNodeEnv = process.env.NODE_ENV;
  const previousFetch = globalThis.fetch;
  process.env.RESEND_API_KEY = 'test-resend-send-key';
  process.env.CONTACT_EMAIL_ENABLED = 'true';
  process.env.NODE_ENV = 'production';
  globalThis.fetch = async () => new Response(JSON.stringify({ message: 'private provider detail' }), { status: 403 });
  try {
    await assert.rejects(sendContactEmail(validInput), (error) => {
      assert.ok(error instanceof ContactDeliveryError);
      assert.equal(error.code, 'provider_rejected');
      assert.equal(error.statusCode, 403);
      assert.equal(error.message.includes('private provider detail'), false);
      return true;
    });
  } finally {
    globalThis.fetch = previousFetch;
    restoreEnv('RESEND_API_KEY', previousKey);
    restoreEnv('CONTACT_EMAIL_ENABLED', previousGate);
    restoreEnv('NODE_ENV', previousNodeEnv);
  }
});
