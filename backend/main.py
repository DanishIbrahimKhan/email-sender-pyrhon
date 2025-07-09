from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import smtplib
import os
from email.message import EmailMessage
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request body structure
class ContactForm(BaseModel):
    name: str
    email: str
    message: str

# Define the POST endpoint
@app.post("/send")
async def send_email(data: ContactForm):
    # Prepare email
    msg = EmailMessage()
    msg["Subject"] = "New Contact Form Submission"
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = os.getenv("EMAIL_RECEIVER")
    msg.set_content(f"Name: {data.name}\nEmail: {data.email}\n\nMessage:\n{data.message}")

    try:
        # Send email via Gmail SMTP
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
            smtp.send_message(msg)
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
