from django.db import models

class Organisation(models.Model):
    name = models.CharField(max_length=64)
    public_key = models.CharField(max_length=128)
