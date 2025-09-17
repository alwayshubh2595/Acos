# Acos
Voice-powered AI assistant for managing your inbox — from reading to replying.
AI Voice Inbox Assistant
🚀 From “to-do” to “done” — a voice-powered AI that manages your inbox, drafts replies in your style, and takes action on your behalf.

📖 Overview

Despite decades of productivity apps, communication still piles up: emails, messages, meeting requests. Existing tools only help us track tasks — they don’t actually do them.

This project is an AI-powered voice agent that transforms the way we handle digital communication:

🎙️ Voice-first control — manage your inbox hands-free, while driving, walking, or cooking.

📩 Smart email triage — fetch, summarize, and prioritize your most important emails.

✍️ Personalized replies — draft and send responses in your writing style.

📆 Proactive execution — schedule meetings, set reminders, and extract tasks automatically.

🧠 Perfect memory — learns your communication patterns to act more like a chief of staff than a tool.

⚙️ Tech Stack

Backend: FastAPI (Python)

LLM: OpenAI / Anthropic (pluggable)

Voice: Whisper / Google STT + ElevenLabs / Google TTS

Email: Gmail API (extendable to Outlook/others)

Auth: Google OAuth2

\n
Getting Started
\n
1. Create and activate a virtual environment, then install deps:
\n
```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
```
\n
2. Set environment variables (PowerShell):
\n
```powershell
$env:OPENAI_API_KEY = "..."
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\\path\\to\\service_account.json"
$env:ELEVENLABS_API_KEY = "..."
```
\n
3. Run the API:
\n
```bash
uvicorn app:app --reload
```
\n
4. Visit `http://localhost:8000/docs` for interactive API docs. Health check at `/health`. Static UI at `http://localhost:8000/`.


🎯 Roadmap

 Fetch & send emails via Gmail API

 Voice commands for email triage

 Draft replies with GPT-4o mini

 Voice playback of drafts for confirmation

 Send confirmed replies hands-free

 Integrate with Google Calendar for scheduling

 Extend to WhatsApp / Slack / SMS

🌟 Vision

This isn’t just an inbox assistant. The goal is to build the first AI Chief of Staff — a system that deeply understands your work, routines, and communication history, then acts on your behalf. From inbox zero to task zero.