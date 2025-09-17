

import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_email(subject: str, body: str) -> str:
    """
    Summarize an email using GPT.
    Args:
        subject (str): The subject of the email
        body (str): The body content of the email
    Returns:
        str: A concise summary of the email
    """
    prompt = f"""
    Summarize the following email clearly and concisely:

    Subject: {subject}
    Body: {body}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    return response.choices[0].message.content
