from datetime import datetime

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.db import models

from main.utils import generate_secret_token


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    birth_date = models.DateField(blank=True, null=True)
    password = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=100)
    about_me = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    gender = models.CharField(max_length=1, blank=True, null=True)
    auth_token = models.CharField(max_length=255, default=generate_secret_token)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Car(models.Model):
    image = models.ImageField(upload_to="images/", blank=True, null=True)
    brand = models.CharField(max_length=255)
    model = models.CharField(max_length=255, blank=True, null=True)
    color = models.CharField(max_length=255, blank=True, null=True)
    owner = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="cars"
    )

    def __str__(self):
        return f"{self.brand} {self.model} ({self.color})"


class City(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name}"


class Comment(models.Model):
    user_profile = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="received_comments"
    )
    author = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="authored_comments"
    )
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)


class Trip(models.Model):
    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    ]

    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    departure_city = models.ForeignKey(
        City, related_name="departure_city", on_delete=models.CASCADE
    )
    destination_city = models.ForeignKey(
        City, related_name="destination_city", on_delete=models.CASCADE
    )
    car = models.ForeignKey(Car, related_name="trip_car", on_delete=models.CASCADE)
    departure_date = models.DateField()
    departure_time = models.TimeField()
    arrival_date = models.DateField(null=True, blank=True)
    arrival_time = models.TimeField()
    passengers = models.ManyToManyField(
        UserProfile, related_name="trip_passengers", blank=True
    )
    max_passengers = models.PositiveIntegerField(default=4)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    comment = models.TextField(blank=True, null=True)
    pending_passengers = models.ManyToManyField(
        UserProfile, related_name="pending_trips", blank=True
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="planned")

    def has_active_trip(self):
        return Trip.objects.filter(
            user=self, status__in=["planned", "in_progress"]
        ).exists()

    def start_trip(self):
        self.status = "in_progress"
        self.save()

    def end_trip(self):
        self.status = "completed"
        self.save()

    @property
    def duration(self):
        if self.arrival_date and self.arrival_time:
            departure_datetime = datetime.combine(
                self.departure_date, self.departure_time
            )
            arrival_datetime = datetime.combine(self.arrival_date, self.arrival_time)
            return arrival_datetime - departure_datetime
        return None

    @property
    def duration_hours(self):
        duration = self.duration
        if duration:
            return duration.days * 24 + duration.seconds // 3600
        return None

    @property
    def duration_minutes(self):
        duration = self.duration
        if duration:
            return (duration.seconds // 60) % 60
        return None

    @property
    def duration_string(self):
        hours = self.duration_hours
        minutes = self.duration_minutes
        if hours is not None and minutes is not None:
            return f"{hours} ч {minutes} м"
        return None

    @property
    def is_full(self):
        return self.passengers.count() >= self.max_passengers

    def remaining_seats(self):
        return self.max_passengers - self.passengers.count()

    def __str__(self):
        return f"Trip from {self.departure_city} to {self.destination_city} on {self.departure_date}"


class Notification(models.Model):
    recipient = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="notifications"
    )
    sender = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="sent_notifications"
    )
    trip = models.ForeignKey(
        Trip, on_delete=models.CASCADE, related_name="notifications"
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.recipient.user.username}"

    def is_request_notification(self):
        return "хочет присоединиться к вашей поездке" in self.message
