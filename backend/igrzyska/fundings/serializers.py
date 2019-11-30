from rest_framework import serializers

from . import models


class FundingSerializer(serializers.ModelSerializer):
    def validate(self, data):
        data = super().validate(data)
        if not data.get('soft_cap', None):
            data['soft_cap'] = (
                (data['tokens_amount'] * data['token_price']) / 2
            )
        return data

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
        )


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
