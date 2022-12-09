# posts/urls.py
from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import BookViewSet, UserViewSet

router = SimpleRouter()
router.register("users", UserViewSet, basename="users")
router.register("books", BookViewSet, basename="books")

urlpatterns = router.urls