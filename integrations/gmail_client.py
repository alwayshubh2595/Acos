import os
from base64 import urlsafe_b64decode
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Scopes define what the app can access (readonly + send)
SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send"
]


def authenticate_gmail():
    """Authenticate the user with Gmail API and return a service object."""
    creds = None

    # token.json stores the user's access and refresh tokens
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    # If no valid credentials are available, request login
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)

        # Save credentials for future use
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    service = build("gmail", "v1", credentials=creds)
    return service


def get_latest_email():
    """Fetch the most recent email (subject + plain text body)."""
    service = authenticate_gmail()

    results = service.users().messages().list(
        userId="me",
        labelIds=["INBOX"],
        q="-category:promotions -category:social -in:spam -in:trash",
        maxResults=1
    ).execute()

    messages = results.get("messages", [])
    if not messages:
        return {"subject": "No messages", "body": ""}

    msg = service.users().messages().get(
        userId="me", id=messages[0]["id"], format="full"
    ).execute()
    payload = msg["payload"]

    # Extract subject
    headers = payload.get("headers", [])
    subject = next((h["value"] for h in headers if h["name"] == "Subject"), "(No Subject)")

    # Extract plain text body
    body = ""
    if "parts" in payload:
        for part in payload["parts"]:
            if part["mimeType"] == "text/plain":
                data = part["body"].get("data")
                if data:
                    body = urlsafe_b64decode(data).decode("utf-8")
                    break
    else:
        data = payload["body"].get("data")
        if data:
            body = urlsafe_b64decode(data).decode("utf-8")

    return {"subject": subject, "body": body}


def get_email_at_index(index=0):
    """Fetch the email at a given index (0 = latest)."""
    service = authenticate_gmail()

    # Fetch a batch of messages (10 for now)
    results = service.users().messages().list(
        userId="me",
        labelIds=["INBOX"],
        q="-category:promotions -category:social -in:spam -in:trash",
        maxResults=10
    ).execute()

    messages = results.get("messages", [])
    if not messages or index >= len(messages):
        return {"subject": "No more messages", "body": ""}

    # Fetch the actual message at index
    msg = service.users().messages().get(
        userId="me", id=messages[index]["id"], format="full"
    ).execute()
    payload = msg["payload"]

    # Extract subject
    headers = payload.get("headers", [])
    subject = next((h["value"] for h in headers if h["name"] == "Subject"), "(No Subject)")

    # Extract plain text body
    body = ""
    if "parts" in payload:
        for part in payload["parts"]:
            if part["mimeType"] == "text/plain":
                data = part["body"].get("data")
                if data:
                    body = urlsafe_b64decode(data).decode("utf-8")
                    break
    else:
        data = payload["body"].get("data")
        if data:
            body = urlsafe_b64decode(data).decode("utf-8")

    return {"subject": subject, "body": body}
