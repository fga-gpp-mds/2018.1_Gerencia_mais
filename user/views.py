#from django.shortcuts import render
from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from user.serializers import UserSerializer, UserCreateUpdateSerializer
from rest_framework import generics
from rest_framework.permissions import (
    AllowAny
)
# Create your views here.
class UserViewVSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ListUser(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CreateUserAPI(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserCreateUpdateSerializer

    @classmethod
    def perform_create(self, serializer):
        instance = serializer.save()
        instance.set_password(instance.password)
        instance.save()
