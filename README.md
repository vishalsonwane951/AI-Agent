# 🤖 Vishal — AI Agent

A sleek, production-grade AI chat agent built with React.js, powered by OpenRouter.

## ✨ Features

- 🧠 **Multi-model support** — Mistral, Llama, Gemma, DeepSeek, GPT-4o Mini, Claude
- 💬 **Conversation memory** — full multi-turn context preserved
- 📝 **Markdown rendering** — code blocks with syntax highlighting, bold, italic, lists
- 📋 **Copy code** — one-click copy for all code blocks
- ⚡ **Suggestion chips** — quick-start prompts on the welcome screen
- 🎨 **Dark glassmorphic UI** — animated grid background, ambient orbs
- ⌨️ **Keyboard shortcuts** — Enter to send, Shift+Enter for new line

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Get your OpenRouter API key
- Go to [openrouter.ai](https://openrouter.ai)
- Sign up and navigate to **Keys**
- Create a new API key (free tier available)

### 3. Start the app
```bash
npm start
```

### 4. Use the app
- Open [http://localhost:3000](http://localhost:3000)
- Paste your OpenRouter API key in the **API KEY** field
- Pick a model (free ones are marked)
- Start chatting!

## 🆓 Free Models Available

| Model | Notes |
|-------|-------|
| Mistral 7B | Fast, great for general use |
| Llama 3.1 8B | Strong reasoning |
| Gemma 2 9B | Google's open model |
| DeepSeek R1 | Best for math & coding |

## 📁 Project Structure

```
src/
├── App.js              # Root component + chat logic
├── App.css             # Layout + background animations
├── index.js            # Entry point
├── index.css           # Global styles + CSS variables
├── hooks/
│   └── useOpenRouter.js  # OpenRouter API hook
└── components/
    ├── Header.js/.css    # Top bar + config
    ├── Message.js/.css   # Chat bubble + markdown renderer
    ├── Welcome.js/.css   # Empty state + suggestion chips
    └── ChatInput.js/.css # Textarea + send button
```

## 🛠 Build for Production

```bash
npm run build
```

Output goes to the `build/` folder — ready to deploy on Vercel, Netlify, or any static host.
