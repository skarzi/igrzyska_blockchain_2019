from django.contrib import admin

from . import models


class FundingAdmin(admin.ModelAdmin):
    pass


class FundingEntryAdmin(admin.ModelAdmin):
    pass


admin.site.register(models.Funding, FundingAdmin)
admin.site.register(models.FundingEntry, FundingEntryAdmin)

