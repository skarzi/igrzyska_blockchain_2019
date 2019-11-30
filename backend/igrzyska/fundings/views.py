from rest_framework import status, viewsets, generics, mixins
from igrzyska.fundings.serializers import FundingEntrySerializer
from igrzyska.fundings.models import FundingEntry


class FundingEntryView(generics.ListCreateAPIView):
    serializer_class = FundingEntrySerializer
    queryset = FundingEntry.objects.all()

    def get_queryset(self):
        user = self.request.user
        return super().get_queryset().filter(user=user)


