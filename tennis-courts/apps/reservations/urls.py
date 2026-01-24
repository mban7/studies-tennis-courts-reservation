from rest_framework.routers import DefaultRouter
from apps.reservations.views import ReservationView

router = DefaultRouter()
router.register("reservations", ReservationView, basename="reservations")

urlpatterns = router.urls
