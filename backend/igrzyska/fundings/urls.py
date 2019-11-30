from django.conf.urls import url
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from . import views

app_name = 'fundings'
