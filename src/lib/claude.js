// DEMO ONLY — in produzione le chiamate passano per un API proxy server
const ANTHROPIC_BASE = 'https://api.anthropic.com/v1';

export async function chatWithClaude({ messages, systemPrompt, apiKey, onChunk }) {
  const response = await fetch(`${ANTHROPIC_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        const text = parsed.delta?.text || '';
        if (text) {
          fullText += text;
          onChunk?.(text, fullText);
        }
      } catch {}
    }
  }
  return fullText;
}

export async function classifyLead(question, apiKey) {
  const response = await fetch(`${ANTHROPIC_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      system: `Classifica questa domanda su attrezzature forestali OMEF.
Rispondi SOLO con JSON valido, nessun testo aggiuntivo:
{"product": "<nome prodotto o 'Generico'>", "category": "<cesoie|trince|legna|pinze|potatura|terreno|noleggio|usato|info>", "score": <1-10 urgenza acquisto>}`,
      messages: [{ role: 'user', content: question }],
    }),
  });
  if (!response.ok) return { product: 'Generico', category: 'info', score: 5 };
  const data = await response.json();
  try {
    const text = data.content?.[0]?.text || '{}';
    return JSON.parse(text);
  } catch {
    return { product: 'Generico', category: 'info', score: 5 };
  }
}
