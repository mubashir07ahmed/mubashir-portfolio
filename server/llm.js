const requestTimeoutMs = 12_000;

function configuredProviders() {
  const selectedProvider = process.env.AI_PROVIDER?.trim().toLowerCase() || 'auto';
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const manusApiUrl = process.env.MANUS_API_URL?.trim();
  const manusKey = process.env.MANUS_API_KEY?.trim();

  const providers = [
    groqKey && {
      id: 'groq',
      name: 'Groq',
      apiKey: groqKey,
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      model: process.env.GROQ_MODEL?.trim() || 'openai/gpt-oss-20b',
    },
    openAiKey && {
      id: 'openai',
      name: 'OpenAI',
      apiKey: openAiKey,
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini',
    },
    geminiKey && {
      id: 'gemini',
      name: 'Gemini',
      apiKey: geminiKey,
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      model: process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash',
    },
    manusApiUrl && manusKey && {
      id: 'manus',
      name: 'Manus',
      apiKey: manusKey,
      endpoint: `${manusApiUrl.replace(/\/+$/, '')}/v1/chat/completions`,
    },
  ].filter(Boolean);

  if (selectedProvider === 'auto') return providers;
  const selected = providers.find((provider) => provider.id === selectedProvider);
  if (!selected) throw new Error(`AI_PROVIDER=${selectedProvider} is not configured or is unavailable.`);
  return [selected];
}

async function requestProvider(provider, messages, maxTokens) {
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
        ...(Number.isInteger(maxTokens) && maxTokens > 0 ? { max_tokens: maxTokens } : {}),
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
 * Server-only OpenAI-compatible chat-completions wrapper.
 * Set AI_PROVIDER to groq, openai, gemini, manus, or auto.
 * auto uses Groq, OpenAI, Gemini, then the managed Manus provider when configured.
 */
export async function invokeLLM({ messages, maxTokens = 320 }) {
  if (!Array.isArray(messages) || messages.length === 0) throw new Error('LLM messages are required.');
  const providers = configuredProviders();
  if (providers.length === 0) throw new Error('No server-side AI provider is configured.');

  let lastError;
  for (const provider of providers) {
    try {
      return await requestProvider(provider, messages, maxTokens);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('All configured AI providers are unavailable.');
}

export function hasConfiguredProvider() {
  try {
    return configuredProviders().length > 0;
  } catch {
    return false;
  }
}
