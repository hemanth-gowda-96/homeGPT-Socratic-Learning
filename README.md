# homeGPT-Socratic-Learning



homeGPT-Socratic-Learning is an offline, privacy-friendly learning assistant powered by a locally-run 7B LLM (Mistral/Llama). Its purpose is to help my nephews learn concepts using the **Socratic method** — instead of giving direct answers, the AI asks guiding questions, encourages reasoning, and adapts to their understanding level.homeGPT-Socratic-Learning is an offline, privacy-friendly learning assistant powered by a locally-run 7B LLM (Mistral/Llama).



## 🎯 Key Features## 🎯 Key Features



The entire system runs **fully locally**, with no cloud dependency, ensuring:The entire system runs **fully locally**, with no cloud dependency, ensuring:



✅ **Safe for children** - No external data exposure

✅ **Complete privacy** - No data leaves the device  

✅ **Works offline** - Runs even without internet  

✅ **Fast responses** - Powered by GPU (RTX 3060 Ti)



The goal is to build a personalized AI tutor that becomes better over time by learning from previous sessions and adjusting question difficulty.



## 🏗️ ArchitectureTODO List (Roadmap for the Repository)

✅ MVP Tasks

- **Backend**: Beego (Go framework)

- **LLM**: Mistral/Llama 7B (via LM Studio/Ollama) Add README introduction, purpose, and screenshots

- **GPU**: RTX 3060 Ti

- **Storage**: Local file-based session management Set up LM Studio/Ollama config for local 7B model



## 📋 TODO List (Roadmap) Beego backend skeleton (/session, /question, /answer)



### MVP Tasks Create Socratic prompt template



- [ ] Add README introduction, purpose, and screenshots Create topic JSON format (e.g., java.json, math.json)

- [ ] Set up LM Studio/Ollama config for local 7B model

- [ ] Beego backend skeleton (`/session`, `/question`, `/answer`) Basic UI: Start topic → Ask → Answer → Follow-up

- [ ] Create Socratic prompt template

- [ ] Create topic JSON format (e.g., `java.json`, `math.json`) ✅ Optional Future Enhancements

- [ ] Basic UI: Start topic → Ask → Answer → Follow-up  Mobile app version

 Offline speech TTS (“Great job!”)

### 🚀 Optional Future Enhancements  Voice input (optional)

 Explanations only on request (“Explain pls”)
- [ ] Mobile app version
- [ ] Offline speech TTS ("Great job!")
- [ ] Voice input (optional)
- [ ] Explanations only on request ("Explain pls")

## 🛠️ Getting Started

### Prerequisites

- Go 1.21+
- LM Studio or Ollama installed
- NVIDIA GPU with CUDA support (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/hemanth-gowda-96/homeGPT-Socratic-Learning.git
cd homeGPT-Socratic-Learning

# Install dependencies
go mod download

# Run the application
go run main.go
```

### Configuration

1. Install and configure LM Studio or Ollama
2. Download a 7B model (Mistral or Llama)
3. Update configuration file with local model endpoint

## 📖 How It Works

1. **Start a session** - Choose a topic (Java, Math, etc.)
2. **AI asks questions** - Uses Socratic method to guide learning
3. **Student responds** - Types answers and reasoning
4. **AI adapts** - Adjusts difficulty based on understanding
5. **Progress tracking** - Saves session data locally

## 🔒 Privacy

All data processing happens locally on your machine. No internet connection required after initial setup. Perfect for children's education without privacy concerns.

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

**Hemanth Gowda**

---

*Built with ❤️ for personalized, private, and effective learning*
