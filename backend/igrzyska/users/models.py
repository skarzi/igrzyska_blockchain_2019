from django.contrib.auth.models import AbstractUser
from django.urls import reverse
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django_prometheus.models import ExportModelOperationsMixin


class User(ExportModelOperationsMixin('user'), AbstractUser):
    name = models.CharField(_('Name of User'), blank=True, max_length=255)
    private_key = models.TextField(blank=True)
    public_key = models.TextField(blank=True)

    def __str__(self):
        return self.username
