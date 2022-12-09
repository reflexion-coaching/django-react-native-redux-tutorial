# books/serializers.py
from django.contrib.auth import get_user_model # new
from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            "id",
            "author",
            "title",
            "created_at",
        )
        model = Book

class UserSerializer(serializers.ModelSerializer): 
    class Meta:
        model = get_user_model() 
        fields = ("id", "username",)