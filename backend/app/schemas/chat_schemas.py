from datetime import datetime
from pydantic import BaseModel


class MessageRecipient(BaseModel):
    recipient_id: str
    chat_id: str


class Message(BaseModel):
    user_id: str 
    message: str 
    created_at: datetime 



class ChatResponse(BaseModel):
    chat_id: str 
    member_ids: list[str]
    messages: list[Message | None]