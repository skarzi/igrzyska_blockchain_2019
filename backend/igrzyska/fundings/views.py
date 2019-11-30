from django.db.models import Prefetch

from rest_framework import status, viewsets, generics

from igrzyska.fundings.models import FundingEntry
from . import serializers, models


class FundingEntryView(generics.ListCreateAPIView):
    serializer_class = serializers.FundingEntrySerializer
    queryset = models.FundingEntry.objects.all()

    def get_queryset(self):
        user = self.request.user
        return super().get_queryset().filter(user=user)


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
