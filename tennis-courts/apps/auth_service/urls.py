from rest_framework.routers import DefaultRouter
from apps.auth_service.views import AuthView

router = DefaultRouter()
router.register("", AuthView, basename="auth")

urlpatterns = router.urls