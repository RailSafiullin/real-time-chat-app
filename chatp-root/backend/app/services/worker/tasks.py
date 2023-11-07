# from celery import shared_task
from fastapi import Depends
from app.api.v1.dependencies import get_token_manager
from app.services.email import send_email
from app.services.token import TokenManager
from .celery import celery
from app.core.config import settings


# @celery.task(name='celery_task')
# def celery_task(x:int):
#     time.sleep(x)
#     print('celery task started.')
#     return (4+5)

@celery.task(name='send_account_activation_email')
def send_account_activation_email(
    activation_token: str,
    recipient_email: str
):  
    activation_link = f"{settings.API_ORIGIN}{settings.API_V_STR}/auth/account/activate/{activation_token}"
    send_email(recipient_email, activation_link)
    return f'Email sent to {recipient_email}.'
