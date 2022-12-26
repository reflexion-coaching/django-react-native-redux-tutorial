# django_project/urls.py
from django.contrib import admin 
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("books.urls")),
    path("api/v1/", include("accounts.urls")),
    path("api-auth/", include("rest_framework.urls")),  # new
]