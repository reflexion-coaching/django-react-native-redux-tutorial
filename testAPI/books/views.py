# books/views.py
from rest_framework import viewsets
from .permissions import IsAuthorOrReadOnly

from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet): 
    permission_classes = (IsAuthorOrReadOnly,)
    queryset = Book.objects.all() 
    serializer_class = BookSerializer


