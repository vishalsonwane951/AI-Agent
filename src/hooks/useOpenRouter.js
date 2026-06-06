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

  const sendMessage = useCallback(async ({ apiKey, model, history, userMessage, chatId }) => {
  setLoading(true);
  setError('');

  try {
    const isNewChat = !chatId;

    const res = await fetch(
      isNewChat
        ? '/api/chats'
        : `/api/chats/${chatId}/messages`,
      {
        method: isNewChat ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // your auth token
        },
        body: JSON.stringify({
          userMessage,
          model,
          userApiKey: apiKey || undefined, // only send if user provided their own
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API Error ${res.status}`);
    }

    const data = await res.json();
    const reply = isNewChat ? data.messages.at(-1)?.content : data.assistantMessage;

    if (!reply) throw new Error('Empty response from API.');
    return { reply, chatId: data.chatId ?? chatId };

  } catch (e) {
    setError(e.message);
    return null;
  } finally {
    setLoading(false);
  }
}, []);

  return { sendMessage, loading, error, setError };
}
