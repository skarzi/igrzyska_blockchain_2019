from django.contrib import admin
from igrzyska.organisations.models import Organisation


class OrganisationAdmin(admin.ModelAdmin):
    pass


admin.site.register(Organisation, OrganisationAdmin)
