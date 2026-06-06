import { useState, useCallback } from 'react';

const SYSTEM_PROMPT = `You are Vishal, a highly intelligent and helpful AI agent. You are:
- Friendly, concise, and precise
- Great at coding, writing, analysis, math, and general knowledge
- You use markdown for formatting: **bold**, \`inline code\`, code blocks with triple backticks and language
- When showing code, always specify the language after triple backticks
- Keep responses focused and avoid unnecessary padding`;

export function useOpenRouter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = useCallback(async ({ apiKey, model, history, userMessage }) => {
    setLoading(true);
    setError('');

    const messages = [
      ...history,
      { role: 'user', content: userMessage }
    ];

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Vishal AI Agent',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API Error ${res.status}`);
      }

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (!reply) throw new Error('Empty response from API.');
      return reply;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendMessage, loading, error, setError };
}
