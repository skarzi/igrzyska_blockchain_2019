from django.db import models


class Organisation(models.Model):
    name = models.CharField(max_length=64)
    private_key = models.TextField(blank=True)
    public_key = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if self.id is None:
            # TODO: create organisation on blockchain
            pass
        super().save(*args, **kwargs)
