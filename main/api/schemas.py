from datetime import date
from enum import Enum

from ninja import ModelSchema, Schema

from main.models import UserProfile


class ReturnedTripOption(str, Enum):
    TAKING_ME = "taking_me"
    IM_GOING = "im_going"
    ALL = "all"


class ChangeUserDataSchema(ModelSchema):
    class Config:
        model = UserProfile
        model_fields = [
            "first_name",
            "last_name",
            "birth_date",
            "gender",
            "email",
            "phone_number",
        ]


class UserData(ModelSchema):
    """Данные пользователя доступные для изменения."""

    first_name: str
    last_name: str
    birth_date: date | None
    gender: str | None
    email: str
    phone_number: str | None

    class Meta:
        model = UserProfile
        fields = [
            "first_name",
            "last_name",
            "birth_date",
            "gender",
            "email",
            "phone_number",
        ]


class ChangedUserDataSuccess(Schema):
    """Возвращаемая информации при успешном изменении данных."""

    message: str
    user: UserData
