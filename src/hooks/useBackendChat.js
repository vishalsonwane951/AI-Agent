import { useState, useCallback } from 'react';

export function useBackendChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = useCallback(async ({ token, chatId, userMessage, userApiKey }) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chats/${chatId}/message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            userMessage,
            userApiKey: userApiKey || undefined,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `API Error ${res.status}`);
      }

      const data = await res.json();
      return data.messages;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createChat = useCallback(async ({ token, model, userMessage, userApiKey }) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/chats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            model,
            userMessage,
            userApiKey: userApiKey || undefined,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `API Error ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendMessage, createChat, loading, error, setError };
}
