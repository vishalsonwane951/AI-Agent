import React from 'react';
import './Header.css';

export const MODELS = [
  { label: 'Mistral 7B — Free', value: 'mistralai/mistral-7b-instruct' },
  { label: 'Llama 3.1 8B — Free', value: 'meta-llama/llama-3.1-8b-instruct:free' },
  { label: 'Gemma 2 9B — Free', value: 'google/gemma-2-9b-it:free' },
  { label: 'DeepSeek R1 — Free', value: 'deepseek/deepseek-r1:free' },
  { label: 'GPT-4o Mini', value: 'openai/gpt-4o-mini' },
  { label: 'Claude 3 Haiku', value: 'anthropic/claude-3-haiku' },
  { label: 'Claude Sonnet 4.5', value: 'anthropic/claude-sonnet-4-5' },
  // { label: 'GPT-OSS 20B — Free', value: 'openai/gpt-oss-20b:free' },
  

];

export default function Header({ apiKey, setApiKey, model, setModel, onClear, hasMessages }) {
  const currentModel = MODELS.find(m => m.value === model);

  return (
    <header className="header">
      <div className="header-top">
        <div className="brand">
          <div className="avatar">
            <span>V</span>
            <div className="online-dot" />
          </div>
          <div className="brand-text">
            <h1>Vishal</h1>
            <p>AI Agent · {currentModel?.label?.split(' —')[0]}</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="model-pill">{currentModel?.label?.split(' —')[0]}</div>
          {hasMessages && (
            <button className="clear-btn" onClick={onClear}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
