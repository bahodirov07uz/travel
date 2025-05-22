from ninja.security import HttpBearer

from main.models import UserProfile


class AuthBearer(HttpBearer):
    def authenticate(self, request, token):
        user = UserProfile.objects.filter(auth_token=token).first()
        if user:
            return user
        return None
