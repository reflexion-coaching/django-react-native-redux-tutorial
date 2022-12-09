# posts/views.py
from django.contrib.auth import get_user_model
from rest_framework import viewsets

from .models import Book
from .serializers import BookSerializer, UserSerializer 

class BookViewSet(viewsets.ModelViewSet): 
    queryset = Book.objects.all() 
    serializer_class = BookSerializer

class UserViewSet(viewsets.ModelViewSet): 
    queryset = get_user_model().objects.all() 
    serializer_class = UserSerializer

