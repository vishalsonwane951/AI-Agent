import React, { useState, useRef, useEffect } from 'react';
import Header, { MODELS } from './components/Header';
import Message, { TypingMessage } from './components/Message';
import Welcome from './components/Welcome';
import ChatInput from './components/ChatInput';
import AuthModal from './components/AuthModal';
import ChatSidebar from './components/ChatSidebar';
import Settings from './components/Settings';
import { useBackendChat } from './hooks/useBackendChat';
import './App.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [model, setModel] = useState(localStorage.getItem('savedModel') || MODELS[0].value);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userApiKey, setUserApiKey] = useState(localStorage.getItem('savedApiKey') || '');
  const [showSettings, setShowSettings] = useState(false);
  const bottomRef = useRef(null);

  const { sendMessage, createChat, loading, error, setError } = useBackendChat();

  // Load saved settings on auth
  useEffect(() => {
    if (token) {
      loadChats();
      loadSettings();
    }
  }, [token]);

  async function loadSettings() {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.preferredModel) {
          setModel(data.preferredModel);
          localStorage.setItem('savedModel', data.preferredModel);
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);
  console.log("BACKEND URL",process.env.REACT_APP_BACKEND_URL)
  const burl = process.env.REACT_APP_BACKEND_URL;
  alert(`backend URL:${burl}`)

  async function loadChats() {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
    }
  }

  function handleAuth(authData) {
    setToken(authData.token);
    setUserId(authData.userId);
    setUsername(authData.username);
    localStorage.setItem('authToken', authData.token);
    localStorage.setItem('userId', authData.userId);
    localStorage.setItem('username', authData.username);
  }

  function handleLogout() {
    setToken(null);
    setUserId(null);
    setUsername(null);
    setChatId(null);
    setMessages([]);
    setChats([]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  async function handleNewChat() {
    if (!input.trim()) return;
    setError('');

    const reply = await createChat({
      token,
      model,
      userMessage: input,
      userApiKey: userApiKey || undefined,
    });

    if (reply) {
      setChatId(reply.chatId);
      setMessages(reply.messages.map(m => ({ ...m, ts: m.timestamp || Date.now() })));
      setInput('');
      loadChats();
    }
  }

  async function handleSend(text) {
    const prompt = (text || input).trim();
    if (!prompt || loading || !chatId) return;

    setInput('');
    setError('');

    const userMsg = { role: 'user', content: prompt, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    const updatedMessages = await sendMessage({
      token,
      chatId,
      userMessage: prompt,
      userApiKey: userApiKey || undefined,
    });

    if (updatedMessages) {
      setMessages(updatedMessages.map(m => ({ ...m, ts: m.timestamp || Date.now() })));
      loadChats();
    } else {
      setMessages(prev => prev.slice(0, -1));
    }
  }

  function handleSelectChat(id) {
    setChatId(id);
    const chat = chats.find(c => c._id === id);
    if (chat) {
      fetchChat(id);
    }
  }

  async function fetchChat(id) {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const chat = await res.json();
        setMessages(chat.messages.map(m => ({ ...m, ts: m.timestamp || Date.now() })));
        setModel(chat.model);
      }
    } catch (err) {
      console.error('Failed to fetch chat:', err);
    }
  }

  async function handleDeleteChat(id) {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chats/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        if (chatId === id) {
          setChatId(null);
          setMessages([]);
        }
        loadChats();
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  }

  if (!token) {
    return <AuthModal onAuth={handleAuth} />;
  }

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="bg-orb orb1" />
      <div className="bg-orb orb2" />

      <ChatSidebar
        chats={chats}
        activeChat={chatId}
        onSelectChat={handleSelectChat}
        onNewChat={() => {
          setChatId(null);
          setMessages([]);
          setInput('');
        }}
        onDeleteChat={handleDeleteChat}
        username={username}
        onLogout={handleLogout}
        onOpenSettings={() => setShowSettings(true)}
      />

      {showSettings && (
        <Settings
          username={username}
          token={token}
          userId={userId}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div className="chat-container">
        {chatId && (
          <Header
            apiKey={userApiKey}
            setApiKey={setUserApiKey}
            model={model}
            setModel={setModel}
            onClear={() => {
              setChatId(null);
              setMessages([]);
              setError('');
            }}
            hasMessages={messages.length > 0}
          />
        )}

        <div className="messages-area">
          {!chatId ? (
            <Welcome onSuggestion={(text) => {
              setInput(text);
            }} />
          ) : messages.length === 0 ? (
            <Welcome onSuggestion={(text) => {
              setInput(text);
            }} />
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

          {messages.length === 0 && error && !chatId && (
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
          onSend={() => {
            if (chatId) {
              handleSend();
            } else {
              handleNewChat();
            }
          }}
          loading={loading}
        />
      </div>
    </div>
  );
}
