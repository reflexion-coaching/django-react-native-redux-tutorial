# django_project/urls.py
from django.contrib import admin 
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("books.urls")),
    path("api/v1/", include("accounts.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("api/v1/dj-rest-auth/", include("dj_rest_auth.urls")),
    path("api/v1/dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")),   # new
]