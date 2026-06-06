import React, { useRef, useEffect } from 'react';
import './ChatInput.css';

export default function ChatInput({ value, onChange, onSend, loading }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!loading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [loading]);

  function autoResize(e) {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  function handleChange(e) {
    onChange(e.target.value);
    autoResize(e);
  }

  return (
    <div className="input-area">
      <div className={`input-wrapper ${loading ? 'input-loading' : ''}`}>
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKey}
          placeholder="Ask Vishal anything..."
          rows={1}
          disabled={loading}
        />
        <button
          className="send-button"
          onClick={onSend}
          disabled={loading || !value.trim()}
          aria-label="Send"
        >
          {loading ? (
            <div className="spinner" />
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>
      <p className="input-hint">
        <kbd>Enter</kbd> to send &nbsp;·&nbsp; <kbd>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
