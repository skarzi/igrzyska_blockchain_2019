from rest_framework import serializers

from igrzyska.users.serializers import UserSerializer
from . import models


class FundingEntrySerializer(serializers.ModelSerializer):
    user = serializers.CurrentUserDefault()

    class Meta:
        model = models.FundingEntry
        fields = (
            'id',
            'funding',
            'user',
            'tokens_amount',
            'token_price',
        )
        extra_kwargs = {
            'token_price': {'read_only': True},
        }

    def create(self, validated_data):
        validated_data['token_price'] = validated_data['funding'].token_price
        return super().create(validated_data)


class FundingEntryDetailSerializer(FundingEntrySerializer):
    user = UserSerializer(read_only=True)

    class Meta(FundingEntrySerializer.Meta):
        fields = (
            'id',
            'user',
            'tokens_amount',
            'token_price',
        )


class FundingSerializer(serializers.ModelSerializer):
    collected_amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )
    entries = FundingEntryDetailSerializer(read_only=True, many=True)

    class Meta:
        model = models.Funding
        fields = (
            'id',
            'organisation',
            'name',
            'description',
            'soft_cap',
            'tokens_amount',
            'token_price',
            'collected_amount',
            'entries',
        )

    def validate(self, data):
        data = super().validate(data)
        if not data.get('soft_cap', None):
            data['soft_cap'] = (
                (data['tokens_amount'] * data['token_price']) / 2
            )
        return data
