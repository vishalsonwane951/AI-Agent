import React, { useState, useRef, useEffect } from 'react';
import Header, { MODELS } from './components/Header';
import Message, { TypingMessage } from './components/Message';
import Welcome from './components/Welcome';
import ChatInput from './components/ChatInput';
import { useOpenRouter } from './hooks/useOpenRouter';
import './App.css';

export default function App() {
  const [apiKey, setApiKey] = useState('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');
  const [model, setModel] = useState(MODELS[0].value);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const { sendMessage, loading, error, setError } = useOpenRouter();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend(text) {
    const prompt = (text || input).trim();
    if (!prompt || loading) return;

    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key in the field above.');
      return;
    }

    setInput('');
    setError('');

    const userMsg = { role: 'user', content: prompt, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    const newHistory = [...history, { role: 'user', content: prompt }];
    setHistory(newHistory);

    const reply = await sendMessage({ apiKey, model, history, userMessage: prompt });

    if (reply) {
      const aiMsg = { role: 'assistant', content: reply, ts: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
      setHistory(h => [...h, { role: 'assistant', content: reply }]);
    } else {
      // Remove the user message if API failed
      setMessages(prev => prev.slice(0, -1));
      setHistory(newHistory.slice(0, -1));
    }
  }

  function clearChat() {
    setMessages([]);
    setHistory([]);
    setError('');
  }

  return (
    <div className="app">
      {/* Animated background */}
      <div className="bg-grid" />
      <div className="bg-orb orb1" />
      <div className="bg-orb orb2" />

      <div className="chat-container">
        <Header
          apiKey={apiKey}
          setApiKey={setApiKey}
          model={model}
          setModel={setModel}
          onClear={clearChat}
          hasMessages={messages.length > 0}
        />

        <div className="messages-area">
          {messages.length === 0 ? (
            <Welcome onSuggestion={handleSend} />
          ) : (
            <div className="messages-list">
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}
              {loading && <TypingMessage />}
              {error && (
                <div className="error-banner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {messages.length === 0 && error && (
            <div className="error-banner standalone-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}
        </div>

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          loading={loading}
        />
      </div>
    </div>
  );
}
