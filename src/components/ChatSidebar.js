import React from 'react';
import './ChatSidebar.css';

export default function ChatSidebar({ chats, activeChat, onSelectChat, onNewChat, onDeleteChat, username, onLogout, onOpenSettings }) {
  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{username?.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <p className="user-name">{username}</p>
          <div className="user-actions">
            <button onClick={onOpenSettings} className="settings-btn" title="Settings">
              ⚙️
            </button>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="chats-list">
        <h3>Recent Chats</h3>
        {chats.length === 0 ? (
          <p className="empty-chats">No chats yet. Start a conversation!</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`chat-item ${activeChat === chat._id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat._id)}
            >
              <div className="chat-item-content">
                <p className="chat-title">{chat.title}</p>
                <p className="chat-date">
                  {new Date(chat.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                className="chat-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat._id);
                }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
