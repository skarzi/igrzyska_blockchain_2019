from django.conf.urls import url

from rest_framework import routers

from . import views

app_name = 'fundings'

router = routers.SimpleRouter()
router.register('', views.FundingModelViewSet, base_name='fundings')

urlpatterns = (
    url(r'^entries/', views.FundingEntryView.as_view(), name='entry'),
    *router.urls,
)
