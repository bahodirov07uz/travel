import re

from django import forms
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.models import User
from django.utils import timezone

from .models import Comment


class UserProfileForm(forms.Form):
    first_name = forms.CharField(max_length=255)
    last_name = forms.CharField(max_length=255)
    phone_number = forms.CharField(max_length=20, required=False)
    email = forms.EmailField()
    about_me = forms.CharField(widget=forms.Textarea, required=False)
    avatar = forms.ImageField(required=False)


class CustomPasswordChangeForm(PasswordChangeForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["old_password"].widget = forms.Textarea(
            attrs={"class": "form-control", "placeholder": "Старый пароль"}
        )
        self.fields["new_password1"].widget = forms.Textarea(
            attrs={"class": "form-control", "placeholder": "Новый пароль"}
        )
        self.fields["new_password2"].widget = forms.Textarea(
            attrs={"class": "form-control", "placeholder": "Повторите новый пароль"}
        )

        self.fields["old_password"].label = ""
        self.fields["new_password1"].label = ""
        self.fields["new_password2"].label = ""


class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput())


class UserRegistrationForm(forms.Form):
    name = forms.CharField(max_length=255)
    email = forms.EmailField()
    phone = forms.CharField(max_length=20)
    password = forms.CharField(widget=forms.PasswordInput)

    def clean_name(self):
        name = self.cleaned_data.get("name")
        if len(name.split()) != 2:
            raise forms.ValidationError("Введите имя и фамилию.")
        return name

    def clean_email(self):
        email = self.cleaned_data.get("email")
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Пользователь с таким email уже существует.")
        return email

    def clean_phone(self):
        phone = self.cleaned_data.get("phone")
        phone_regex = re.compile(r"^\+?\d{9,15}$")
        if not phone_regex.match(phone):
            raise forms.ValidationError("Введите корректный номер телефона.")
        return phone

    def clean_password(self):
        password = self.cleaned_data.get("password")
        if len(password) < 8:
            raise forms.ValidationError(
                "Пароль должен содержать как минимум 8 символов."
            )
        return password


class UserLoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)


from django import forms


class TripForm(forms.Form):
    car_name = forms.CharField(label="Название машины", max_length=100)
    departure_city = forms.CharField(
        label="Город отправления",
        max_length=100,
        widget=forms.TextInput(attrs={"id": "departure", "list": "departure-list"}),
    )
    destination_city = forms.CharField(
        label="Город прибытия",
        max_length=100,
        widget=forms.TextInput(attrs={"id": "arrival", "list": "arrival-list"}),
    )
    departure_time = forms.DateTimeField(
        label="Время отправления",
        widget=forms.DateTimeInput(attrs={"type": "datetime-local"}),
    )
    arrival_time = forms.DateTimeField(
        label="Время прибытия",
        widget=forms.DateTimeInput(attrs={"type": "datetime-local"}),
    )
    max_passengers = forms.IntegerField(
        label="Количество пассажиров", min_value=1, max_value=4
    )
    price = forms.DecimalField(
        label="Стоимость поездки",
        max_digits=10,
        decimal_places=0,
        min_value=50,
        max_value=15000,
    )
    comment = forms.CharField(
        label="Комментарий",
        widget=forms.Textarea(
            attrs={"placeholder": "Введите комментарий", "maxlength": 500}
        ),
        required=False,
    )
    car_image = forms.ImageField(label="Фото машины", required=False)

    def clean(self):
        cleaned_data = super().clean()

        departure_time = cleaned_data.get("departure_time")
        arrival_time = cleaned_data.get("arrival_time")
        departure_city = cleaned_data.get("departure_city")
        destination_city = cleaned_data.get("destination_city")

        if departure_time is None or arrival_time is None:
            raise forms.ValidationError(
                "Время отправления и время прибытия должны быть заполнены."
            )

        if departure_time < timezone.now():
            raise forms.ValidationError("Время отправления не может быть в прошлом.")

        # Проверка, что дата и время отправления раньше даты и времени прибытия
        if departure_time >= arrival_time:
            raise forms.ValidationError(
                "Дата и время отправления должны быть раньше даты и времени прибытия."
            )

        # Проверка, что города отправления и прибытия не совпадают
        if departure_city == destination_city:
            raise forms.ValidationError(
                "Город отправления и город прибытия не могут совпадать."
            )

        return cleaned_data


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ["text"]
        widgets = {
            "text": forms.Textarea(attrs={"placeholder": "Введите ваш комментарий"}),
        }
