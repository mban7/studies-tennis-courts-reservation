from rest_framework.routers import DefaultRouter
from apps.users.views import UserView

router = DefaultRouter()
router.register("users", UserView, basename="users")

urlpatterns = router.urls