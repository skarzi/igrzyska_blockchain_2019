from django.contrib.auth import get_user_model

from rest_framework import status, viewsets, generics
from rest_framework import permissions
from rest_framework.authtoken import serializers

from .serializers import UserSerializer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_staff=False)
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
