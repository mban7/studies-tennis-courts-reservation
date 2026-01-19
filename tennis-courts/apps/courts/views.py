from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from drf_spectacular.utils import extend_schema

from apps.core.permissions import IsAdmin
from apps.core.responses import api_response
from apps.core.serializers import ApiResponseSerializer
from apps.courts.serializers import CourtCreateSerializer, CourtReadSerializer
from apps.courts.services import CourtService


class CourtView(ViewSet):
    permission_classes = [IsAuthenticated]

    @property
    def service(self):
        return CourtService()

    def get_permissions(self):
        admin_actions = {}

        if self.action in admin_actions:
            return [IsAdmin()]

        return [IsAuthenticated()]

    @extend_schema(
        request=CourtCreateSerializer,
        responses={200: ApiResponseSerializer},
        summary="Create a new court",
        tags=["courts"],
    )
    @action(detail=False, methods=["post"], url_path="create")
    def create_court(self, request):
        serializer = CourtCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        court = self.service.create_court(serializer.validated_data)

        return api_response(
            data=CourtReadSerializer(court).data,
            message="Court created successfully",
            status_code=status.HTTP_200_OK,
        )