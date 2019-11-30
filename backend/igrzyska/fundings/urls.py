from django.conf.urls import url

from rest_framework import routers
from igrzyska.fundings.views import FundingEntryView

from . import views

app_name = 'fundings'

urlpatterns = (
    url(r'^entries/', FundingEntryView.as_view(), name='entry'),
)
