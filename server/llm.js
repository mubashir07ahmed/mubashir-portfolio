const requestTimeoutMs = 12_000;
const groqApiUrl = 'https://api.groq.com/openai/v1';

/**
 * Server-only OpenAI-compatible chat-completions wrapper.
 * Groq is preferred when GROQ_API_KEY is configured; Manus remains a fallback
 * for the managed preview when its platform credentials are available.
 */
export async function invokeLLM({ messages, maxTokens = 320 }) {
  if (!Array.isArray(messages) || messages.length === 0) throw new Error('LLM messages are required.');

  const groqKey = process.env.GROQ_API_KEY?.trim();
  const manusApiUrl = process.env.MANUS_API_URL?.trim();
  const manusKey = process.env.MANUS_API_KEY;
  const useGroq = Boolean(groqKey);

  if (!useGroq && (!manusApiUrl || !manusKey)) throw new Error('No server-side AI provider is configured.');

  const apiUrl = useGroq ? groqApiUrl : manusApiUrl;
  const apiKey = useGroq ? groqKey : manusKey;
  const model = useGroq ? (process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-20b') : undefined;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    const response = await fetch(`${apiUrl.replace(/\/+$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...(model ? { model } : {}),
        messages,
        ...(Number.isInteger(maxTokens) && maxTokens > 0 ? { max_tokens: maxTokens } : {}),
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.error) {
      const detail = payload?.error?.message || `${response.status} ${response.statusText}`;
      throw new Error(`${useGroq ? 'Groq' : 'Manus'} LLM invoke failed: ${String(detail).slice(0, 240)}`);
    }
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}
