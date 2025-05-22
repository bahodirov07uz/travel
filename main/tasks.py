from typing import Any

import requests

from django.conf import settings


def send_sms_task(to, message) -> Any:
    """
    Отправляет СМС по номеру телефона.

    Args:
        to (str): Номер телефона.
        message (str): Текст сообщения.
    Returns:
        Response: Ответ от сервиса.
    """
    api_key = settings.SMSRU_API_KEY
    from_ = settings.SMSRU_FROM
    params = {
        "api_id": api_key,
        "to": to,
        "msg": message,
        "json": 1,
    }
    url = "https://sms.ru/sms/send"

    if from_:
        params["from"] = from_

    response = requests.get(url, params=params, timeout=60)
    return response.json()
