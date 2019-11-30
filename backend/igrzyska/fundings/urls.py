from django.conf.urls import url

from rest_framework import routers

from . import views

app_name = 'fundings'

router = routers.SimpleRouter()
router.register('', views.FundingModelViewSet, base_name='fundings')

urlpatterns = router.urls
