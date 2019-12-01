from django.db.models import Prefetch

from rest_framework import status, viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from igrzyska.fundings.models import FundingEntry
from . import serializers, models


class FundingEntryViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.FundingEntrySerializer
    queryset = models.FundingEntry.objects.all()

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset().filter(user=user)
        if self.action == 'list':
            queryset = queryset.filter(is_completed=True)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # TODO: get something from blockchain and send it to mobile app to sign
        token = 'token to sign'

        self.perform_create(serializer)
        data = dict(serializer.data)
        data['token'] = token
        headers = self.get_success_headers(serializer.data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    @action(
        detail=True,
        methods=['POST'],
    )
    def complete(self, request, *args, **kwargs):
        # TODO: do something with this token
        signed_token = request.data['signed_token']

        funding_entry = self.get_object()
        funding_entry.is_completed = True
        funding_entry.save()
        return Response(
            data=self.get_serializer(funding_entry).data,
            status=status.HTTP_201_CREATED,
        )


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
