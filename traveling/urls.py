from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from ninja import NinjaAPI

from main.api.authorization import AuthBearer
from main.api.routes import router as main_router

api_key_auth = AuthBearer()

api_v1 = NinjaAPI(version="1.0")
api_v1.add_router("main", main_router, tags=["main"], auth=api_key_auth)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(("main.urls", "main"), namespace="main")),
    path("api/v1/", api_v1.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
