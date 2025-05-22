from django.contrib import admin
from .models import UserProfile, City, Car, Trip, Notification, Comment


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Представление модели UserProfile в админке."""

    list_display = [field.name for field in UserProfile._meta.fields]


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    """Представление модели City в админке."""

    list_display = [field.name for field in City._meta.fields]


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    """Представление модели Car в админке."""

    list_display = [field.name for field in Car._meta.fields]


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    """Представление модели Trip в админке."""

    list_display = [field.name for field in Trip._meta.fields]


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Представление модели Notification в админке."""

    list_display = [field.name for field in Notification._meta.fields]


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Представление модели Comment в админке."""

    list_display = [field.name for field in Comment._meta.fields]
