# homeGPT-Socratic-Learning

homeGPT-Socratic-Learning is an offline, privacy-friendly learning assistant powered by a locally-run 7B LLM (Mistral/Llama). Its purpose is to help my nephews learn concepts using the Socratic method — instead of giving direct answers, the AI asks guiding questions, encourages reasoning, and adapts to their understanding level.

## 📢 Project Update: Moving to Next.js Full-Stack

This project is being developed as a Next.js full‑stack app. The UI and API routes will live in a single Next.js codebase, and the backend will proxy requests to a locally running LLM (LM Studio or Ollama). Existing Go prototype code will be kept temporarily while the migration completes.

## 🎯 Key Features

The entire system runs fully locally, with no cloud dependency, ensuring:

- Safe for children — no external data exposure
- Complete privacy — no data leaves the device
- Works offline — runs even without internet
- Fast responses — GPU-accelerated on devices like RTX 3060 Ti

The goal is to build a personalized AI tutor that improves over time by learning from previous sessions and adjusting question difficulty.

## 🏗️ Tech Stack

- Next.js (App Router) + API Routes
- TypeScript
- Tailwind CSS (planned)
- Local LLM via LM Studio or Ollama

## 🛠️ Getting Started (Next.js)

Prerequisites:

- Node.js 18+ and npm (or pnpm/yarn)
- LM Studio or Ollama installed locally

Setup (coming as the Next.js app lands):

```bash
# Clone the repo
git clone https://github.com/hemanth-gowda-96/homeGPT-Socratic-Learning.git
cd homeGPT-Socratic-Learning

# (Once Next.js is scaffolded)
npm install
npm run dev
# App will start at http://localhost:3000
```

LLM server:

```bash
# LM Studio (example)
lms server start --port 1234

# Ollama (example)
ollama serve
```

## 🔧 Configuration

For Next.js, create `.env.local` at the repo root:

```
# LLM endpoint your API routes will call
LLM_BASE_URL=http://localhost:1234

# Default model name
LLM_MODEL=mistral
```

Notes:

- If using LM Studio: the completions/chat endpoints are exposed under the port you start (`/v1/...`).
- If using Ollama: REST endpoints are typically under `http://localhost:11434/api`.

## 📖 How It Works

1. Start an LLM locally (LM Studio or Ollama)
2. Next.js API routes proxy requests to the local LLM endpoint
3. The UI guides learning using the Socratic method (question → reflect → follow‑up)
4. Sessions and progress are stored locally for privacy

## 🚀 API Documentation

Interactive API documentation is available via Swagger UI:

```
http://localhost:3000/api-docs
```

### Available Endpoints

**📝 Generation API** (`/api/generate`)

- Primary endpoint for text generation using Ollama models
- Supports custom models, prompts, and generation options

**💬 Chat API** (`/api/chat`)

- Conversational endpoint with context and history support
- Ideal for multi-turn conversations and guided learning

**🏥 Health Checks**

- All endpoints include GET methods for health monitoring
- Returns available models and service status

### Example Usage

```javascript
// Generate response
const response = await fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "mistral",
    prompt: "Explain photosynthesis using the Socratic method",
    stream: false,
  }),
});

// Chat with context
const chatResponse = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "What is gravity?",
    systemPrompt: "Use the Socratic method to guide learning",
  }),
});
```

## 📋 Roadmap

- ✅ Next.js full‑stack structure with API routes
- ✅ Interactive API documentation with Swagger
- ✅ Voice input support for accessibility
- 🔄 Enhanced chat UI with guided questioning
- 🔄 Session persistence and progress tracking
- 📋 Advanced Socratic method implementation

## 🔒 Privacy

All data processing happens locally on your machine. No internet connection is required after initial setup.

## 📝 License

MIT License — see LICENSE for details

## 👨‍💻 Author

Hemanth Gowda

---

Built with ❤️ for personalized, private, and effective learning
