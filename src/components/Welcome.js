import React from 'react';
import './Welcome.css';

const SUGGESTIONS = [
  { icon: '⚡', text: 'Explain async/await in JavaScript' },
  { icon: '🐍', text: 'Write a Python function to sort a list' },
  { icon: '💡', text: '5 unique startup ideas for 2025' },
  { icon: '🔢', text: 'Solve: x² − 5x + 6 = 0, step by step' },
  { icon: '✍️', text: 'Write a haiku about machine learning' },
  { icon: '🌍', text: 'Translate "Hello World" into 6 languages' },
];

export default function Welcome({ onSuggestion }) {
  return (
    <div className="welcome">
      <div className="welcome-icon">
        <span>V</span>
        <div className="icon-ring" />
      </div>
      <h2>Hey, I'm Vishal!</h2>
      <p>Your AI agent powered by OpenRouter.<br />Ask me anything — I'm here to help.</p>

      <div className="suggestions-grid">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            className="suggestion-card"
            onClick={() => onSuggestion(s.text)}
          >
            <span className="sug-icon">{s.icon}</span>
            <span className="sug-text">{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
