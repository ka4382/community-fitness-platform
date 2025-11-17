from django.contrib import admin
from django.urls import path, include
from api_urls import urlpatterns as api_patterns

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(api_patterns)),
]
