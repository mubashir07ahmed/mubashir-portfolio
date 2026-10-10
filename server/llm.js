const requestTimeoutMs = 12_000;

function getGroqConfig() {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;
  return {
    name: 'Groq',
    apiKey,
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-20b',
  };
}

async function requestGroq(provider, messages, maxTokens) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        ...(provider.model ? { model: provider.model } : {}),
        messages,
        ...(Number.isInteger(maxTokens) && maxTokens > 0 ? { max_completion_tokens: maxTokens } : {}),
        ...(provider.model.startsWith('openai/gpt-oss-') ? { reasoning_format: 'hidden', reasoning_effort: 'low' } : {}),
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.error) {
      const detail = payload?.error?.message || `${response.status} ${response.statusText}`;
      throw new Error(`${provider.name} request failed: ${String(detail).slice(0, 240)}`);
    }
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Server-only Groq chat-completions client. No other remote provider is used.
 */
export async function invokeLLM({ messages, maxTokens = 320 }) {
  if (!Array.isArray(messages) || messages.length === 0) throw new Error('LLM messages are required.');
  const config = getGroqConfig();
  if (!config) throw new Error('GROQ_API_KEY is not configured.');
  return requestGroq(config, messages, maxTokens);
}

export function hasConfiguredProvider() {
  return Boolean(getGroqConfig());
}
