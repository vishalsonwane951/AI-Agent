import React from 'react';
import './Message.css';

// Simple inline markdown parser
function parseMarkdown(text) {
  const parts = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', lang: match[1] || 'text', content: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts;
}

function renderInline(text) {
  // bold, italic, inline code
  const segments = [];
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`|\*(.+?)\*)/g;
  let last = 0;
  let m;
  let key = 0;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) segments.push(<span key={key++}>{text.slice(last, m.index)}</span>);
    if (m[2]) segments.push(<strong key={key++}>{m[2]}</strong>);
    else if (m[3]) segments.push(<code key={key++} className="inline-code">{m[3]}</code>);
    else if (m[4]) segments.push(<em key={key++}>{m[4]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push(<span key={key++}>{text.slice(last)}</span>);
  return segments;
}

function renderTextBlock(content) {
  return content.split('\n').map((line, i, arr) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) return <h3 key={i}>{trimmed.slice(4)}</h3>;
    if (trimmed.startsWith('## ')) return <h2 key={i}>{trimmed.slice(3)}</h2>;
    if (trimmed.startsWith('# ')) return <h2 key={i}>{trimmed.slice(2)}</h2>;
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return <li key={i}>{renderInline(trimmed.slice(2))}</li>;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      return <li key={i}>{renderInline(trimmed.replace(/^\d+\.\s/, ''))}</li>;
    }
    if (trimmed === '') return i < arr.length - 1 ? <br key={i} /> : null;
    return <p key={i}>{renderInline(line)}</p>;
  });
}

function CopyButton({ text }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button className="copy-btn" onClick={copy}>
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function MessageContent({ content }) {
  const parts = parseMarkdown(content);
  return (
    <div className="message-content">
      {parts.map((part, i) =>
        part.type === 'code' ? (
          <div key={i} className="code-block">
            <div className="code-header">
              <span className="lang-tag">{part.lang || 'code'}</span>
              <CopyButton text={part.content} />
            </div>
            <pre><code>{part.content}</code></pre>
          </div>
        ) : (
          <div key={i} className="text-block">
            {renderTextBlock(part.content)}
          </div>
        )
      )}
    </div>
  );
}

export function TypingMessage() {
  return (
    <div className="message ai">
      <div className="msg-avatar ai-avatar">V</div>
      <div className="bubble ai-bubble">
        <div className="typing-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

export default function Message({ msg }) {
  const isUser = msg.role === 'user';
  const time = new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`message ${isUser ? 'user' : 'ai'}`}>
      <div className={`msg-avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`}>
        {isUser ? '👤' : 'V'}
      </div>
      <div className="msg-body">
        <div className={`bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
          {isUser ? (
            <p className="user-text">{msg.content}</p>
          ) : (
            <MessageContent content={msg.content} />
          )}
        </div>
        <div className={`msg-meta ${isUser ? 'meta-right' : ''}`}>
          {isUser ? 'You' : 'Vishal'} · {time}
        </div>
      </div>
    </div>
  );
}
