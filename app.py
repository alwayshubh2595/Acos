import sys
from pathlib import Path
from fastapi import FastAPI, Query
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles

# ---- Real Integrations ----
from integrations.gmail_client import get_email_at_index
from core.summarizer import summarize_email
from core.text_to_speech import speak_text, synthesize_speech_bytes
from core.speech_to_text import listen_to_speech


# ---------------- CLI Voice Assistant ----------------
def cli_main():
    running = True
    index = 0

    while running:
        email = get_email_at_index(index)
        subject, body = email["subject"], email["body"]

        if subject == "No more messages":
            speak_text("You have no more messages in your inbox.")
            break

        summary = summarize_email(subject, body)
        print(f"\n📧 Subject: {subject}")
        print(f"📌 Summary: {summary}")
        speak_text(f"Here is your email summary. {summary}. Now, your reply.")

        """
        print("\n🎤 Waiting for your reply...")
        command = listen_to_speech().lower().strip()
        print("👉 You said:", command)

        if "next" in command:
            index += 1
            speak_text("Loading your next email.")
        elif "repeat" in command:
            speak_text(f"Repeating. {summary}. Now, your reply.")
        elif "stop" in command or "exit" in command or "quit" in command:
            speak_text("Goodbye! See you soon.")
            running = False
        else:
            speak_text("Sorry, I did not understand that. Please say next, repeat, or stop.")
        """
        running = False  # for now, exit after first email


# ---------------- FastAPI App ----------------
app = FastAPI()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/emails/latest")
def emails_latest(index: int = Query(0, ge=0)) -> dict:
    try:
        # ✅ Now uses your real Gmail integration
        email = get_email_at_index(index)
        # Ensure response has exactly the fields the frontend expects
        return {
            "subject": email.get("subject", ""),
            "body": email.get("body", "")
        }
    except Exception as e:
        # Return error in expected format
        return {
            "subject": "Error loading email",
            "body": f"Failed to fetch email: {str(e)}"
        }


@app.get("/summarize")
def summarize_endpoint(subject: str, body: str) -> dict:
    try:
        summary = summarize_email(subject, body)
        return {"summary": summary}
    except Exception as e:
        # Return error in expected format
        return {"summary": f"Failed to generate summary: {str(e)}"}


@app.get("/tts")
def tts(text: str):
    try:
        audio_bytes, content_type = synthesize_speech_bytes(text)
        return Response(content=audio_bytes, media_type=content_type)
    except Exception as e:
        # Return a simple error response
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")


# ---------------- Serve Lovable UI ----------------
BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

app.mount(
    "/",
    StaticFiles(directory=str(FRONTEND_DIST), html=True),
    name="static",
)


# ---------------- Entry Point ----------------
if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "cli":
        cli_main()
    else:
        print("⚡ Run backend with: uvicorn app:app --reload")
