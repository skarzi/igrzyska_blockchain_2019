from django.db.models import Prefetch

from rest_framework import status, viewsets, generics

from . import serializers, models


class FundingModelViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.FundingSerializer

    def get_queryset(self):
        queryset = models.Funding.objects.select_related('organisation')
        queryset = queryset.prefetch_related(
            Prefetch(
                'entries',
                queryset=models.FundingEntry.objects.select_related('user'),
            ),
        )
        return queryset
