import React, { useState } from 'react';
import './Settings.css';
import { MODELS } from './Header';

export default function Settings({ username, onClose, token, userId }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('savedApiKey') || '');
  const [model, setModel] = useState(localStorage.getItem('savedModel') || MODELS[0].value);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setLoading(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ apiKey, model }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Failed to save settings');
      }

      localStorage.setItem('savedApiKey', apiKey);
      localStorage.setItem('savedModel', model);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const currentModel = MODELS.find(m => m.value === model);

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings & Preferences</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Profile</h3>
            <div className="setting-row">
              <label>Username</label>
              <span className="username-display">{username}</span>
            </div>
          </div>

          <div className="settings-section">
            <h3>API Configuration</h3>
            <div className="setting-row">
              <label htmlFor="api-key">OpenRouter API Key</label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="settings-input"
              />
              <span className="hint">Save your API key to use it across all chats</span>
            </div>

            <div className="setting-row">
              <label htmlFor="model">Default Model</label>
              <select
                id="model"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="settings-input"
              >
                {MODELS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              {currentModel && (
                <span className="hint">Current: {currentModel.label}</span>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {saved && <div className="success-message">✓ Settings saved successfully</div>}

          <div className="settings-actions">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
