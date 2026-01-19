from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.permissions import AllowAny

urlpatterns = [
    path('api/schema/', SpectacularAPIView.as_view(permission_classes=[AllowAny]), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(permission_classes=[AllowAny], url_name='schema'),
        name='swagger-ui'),
    path("auth/", include("apps.auth_service.urls")),
    path("api/", include("apps.users.urls")),
    path("api/", include("apps.courts.urls")),
]
