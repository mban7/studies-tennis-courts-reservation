from rest_framework.routers import DefaultRouter
from apps.courts.views import CourtView

router = DefaultRouter()
router.register("courts", CourtView, basename="courts")

urlpatterns = router.urls