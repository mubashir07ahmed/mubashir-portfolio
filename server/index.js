import express from 'express';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { getLocalAnswer, getProfileAnswer, isProfileQuestion, isRestrictedGeneralQuestion } from '../shared/chat.js';
import { invokeLLM } from './llm.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = express();
const httpServer = createServer(app);
app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

const rateWindows = new Map();
const maxRequests = 30;
const windowMs = 60_000;
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateWindows) if (now - record.startedAt > windowMs) rateWindows.delete(ip);
}, windowMs).unref();

function limitChatRequests(req, res, next) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  let record = rateWindows.get(key);
  if (!record || now - record.startedAt >= windowMs) {
    record = { startedAt: now, count: 0 };
    rateWindows.set(key, record);
  }
  record.count += 1;
  res.set('RateLimit-Limit', String(maxRequests));
  res.set('RateLimit-Remaining', String(Math.max(0, maxRequests - record.count)));
  if (record.count > maxRequests) {
    res.set('Retry-After', '60');
    return res.status(429).json({ error: 'The chat is receiving too many requests. Please try again shortly.' });
  }
  next();
}

app.get('/api/healthz', (_req, res) => res.status(200).json({ ok: true }));
app.post('/api/chat', limitChatRequests, async (req, res) => {
  const message = req.body?.message;
  if (typeof message !== 'string' || !message.trim() || message.length > 500) {
    return res.status(400).json({ error: 'Enter a question of up to 500 characters.' });
  }

  if (isProfileQuestion(message)) return res.json({ ...getProfileAnswer(message), scope: 'profile' });

  if (isRestrictedGeneralQuestion(message)) {
    return res.json({
      text: 'I can chat about Mubashir and everyday topics, but I’m not set up for programming help or general-knowledge trivia.',
      fallbackUsed: false,
      scope: 'general',
    });
  }

  const history = Array.isArray(req.body?.history)
    ? req.body.history.filter((item) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string').slice(-8)
    : [];
  try {
    const result = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'You are the friendly AI Chatbot on Mubashir Ahmed’s portfolio. Answer normal everyday, conversational, personal, workplace, and light creative questions naturally and briefly. For questions about Mubashir, use only the portfolio facts supplied in the conversation or say that the detail is not available. Do not answer programming, coding, software-development, algorithm, or general-knowledge/trivia questions; politely say those are outside your role. Do not claim to be Mubashir. Keep answers under 100 words.',
        },
        ...history,
        { role: 'user', content: message },
      ],
      maxTokens: 220,
    });
    const text = result?.choices?.[0]?.message?.content;
    if (typeof text === 'string' && text.trim()) return res.json({ text: text.trim(), fallbackUsed: false, scope: 'general' });
  } catch {
    // Fall through to a deterministic friendly reply when the AI service is unavailable.
  }

  return res.json({ ...getLocalAnswer(message), fallbackUsed: false, scope: 'general' });
});

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  const dist = path.join(root, 'dist');
  app.use(express.static(dist, { index: false, maxAge: '1h' }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || !req.accepts('html')) return next();
    return res.sendFile(path.join(dist, 'index.html'));
  });
} else {
  const vite = await createViteServer({
    root,
    configFile: path.join(root, 'vite.config.ts'),
    server: { middlewareMode: true, hmr: { server: httpServer } },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.use((err, _req, res, _next) => {
  if (res.headersSent) return;
  const status = err?.status === 413 ? 413 : err instanceof SyntaxError ? 400 : 500;
  res.status(status).json({ error: status === 400 ? 'The request body is not valid JSON.' : 'The server could not process that request.' });
});

const port = Number(process.env.PORT || 3000);
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Portfolio server listening on 0.0.0.0:${port} (${isProduction ? 'production' : 'development'})`);
});

process.on('SIGTERM', () => { clearInterval(cleanupTimer); httpServer.close(() => process.exit(0)); });
