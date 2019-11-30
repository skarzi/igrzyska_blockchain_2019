from django.db import models
from django.conf import settings


class Funding(models.Model):
    organisation = models.ForeignKey(
        'organisations.Organisation',
        on_delete=models.SET_NULL,
        null=True,
        related_name='fundings',
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    # (tokens_amount * token_price) / 2
    soft_cap = models.DecimalField(max_digits=12, decimal_places=2, null=True)
    tokens_amount = models.PositiveIntegerField()
    token_price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f''


class FundingEntry(models.Model):
    funding = models.ForeignKey(
        'fundings.Funding',
        on_delete=models.CASCADE,
        related_name='entries',
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='funding_entries',
    )
    tokens_amount = models.PositiveIntegerField()
    token_price = models.DecimalField(max_digits=12, decimal_places=2)
