const requestTimeoutMs = 12_000;

/**
 * Server-only Manus chat-completions wrapper. Mirrors the supplied example's
 * invokeLLM({ messages, maxTokens }) pattern without exposing platform keys.
 */
export async function invokeLLM({ messages, maxTokens = 320 }) {
  const apiUrl = process.env.MANUS_API_URL?.trim();
  const apiKey = process.env.MANUS_API_KEY;
  if (!apiUrl || !apiKey) throw new Error('The built-in AI service is unavailable.');
  if (!Array.isArray(messages) || messages.length === 0) throw new Error('LLM messages are required.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages,
        ...(Number.isInteger(maxTokens) && maxTokens > 0 ? { max_tokens: maxTokens } : {}),
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.error) {
      const detail = payload?.error?.message || `${response.status} ${response.statusText}`;
      throw new Error(`LLM invoke failed: ${String(detail).slice(0, 240)}`);
    }
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}
