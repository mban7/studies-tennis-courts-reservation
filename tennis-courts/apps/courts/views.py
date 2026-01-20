from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from drf_spectacular.utils import extend_schema

from apps.core.permissions import IsAdmin
from apps.core.responses import api_response
from apps.core.serializers import ApiResponseSerializer
from apps.courts.serializers import CourtCreateSerializer, CourtReadSerializer, CourtUpdateSerializer
from apps.courts.services import CourtService


class CourtView(ViewSet):
    permission_classes = [IsAuthenticated]

    @property
    def service(self):
        return CourtService()

    def get_permissions(self):
        admin_actions = {"create_court"}

        if self.action in admin_actions:
            return [IsAdmin()]

        return [IsAuthenticated()]

    @extend_schema(
        request=None,
        responses={200: ApiResponseSerializer},
        summary="Get court",
        tags=["courts"],
    )
    @action(detail=True, methods=["get"], url_path="get")
    def get_court(self, request, pk=None):
        court = self.service.get_court(pk)

        return api_response(
            data=CourtReadSerializer(court).data,
            message="Court retrieved successfully",
            status_code=status.HTTP_200_OK,
        )

    @extend_schema(
        request=None,
        responses={200: ApiResponseSerializer},
        summary="Get courts",
        tags=["courts"],
    )
    @action(detail=False, methods=["get"], url_path="get")
    def get_courts(self, request):
        courts = self.service.get_courts()
        serializer = CourtReadSerializer(courts, many=True)

        return api_response(
            data=serializer.data,
            message="Court retrieved successfully",
            status_code=status.HTTP_200_OK,
        )

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

    @extend_schema(
        request=CourtUpdateSerializer,
        responses={200: ApiResponseSerializer},
        summary="Update court",
        tags=["courts"],
    )
    @action(detail=True, methods=["patch"], url_path="update")
    def update_court(self, request, pk=None):
        serializer = CourtUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        court = self.service.update_court(pk, serializer.validated_data)

        return api_response(
            data=CourtReadSerializer(court).data,
            message="Court updated successfully",
        )

    @extend_schema(
        request=None,
        responses={200: ApiResponseSerializer},
        summary="Toggle court activity",
        tags=["courts"],
    )
    @action(detail=True, methods=["post"], url_path="toggle")
    def toggle_court(self, request, pk=None):
        court = self.service.toggle_court(pk)
        return api_response(
            data=CourtReadSerializer(court).data,
            message="Court toggled successfully",
        )


