from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from drf_spectacular.utils import extend_schema

from apps.users.services import UserService
from apps.users.serializers import (
    UserReadSerializer, UserCreateWithRoleSerializer, UserUpdateSerializer
)
from apps.core.permissions import IsAdmin
from apps.core.responses import api_response
from apps.core.serializers import ApiResponseSerializer


class UserView(ViewSet):
    permission_classes = [IsAuthenticated]

    @property
    def service(self):
        return UserService()

    def get_permissions(self):
        admin_actions = {"create_user", "update_user", "deactivate", "profile"}

        if self.action in admin_actions:
            return [IsAdmin()]

        return [IsAuthenticated()]

    @extend_schema(
        request=UserCreateWithRoleSerializer,
        responses={201: ApiResponseSerializer},
        summary="Create User",
        description="Create new user",
        tags=["users"],
    )
    @action(detail=False, methods=['post'], url_path='create')
    def create_user(self, request):
        serializer = UserCreateWithRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.service.create_user(**serializer.validated_data)

        return api_response(
            data=UserReadSerializer(user).data,
            message="User created successfully",
            status_code=status.HTTP_201_CREATED
        )

    @extend_schema(
        request=None,
        responses={200: ApiResponseSerializer},
        summary="Get user information",
        tags=["users"],
    )
    @action(detail=True, methods=['get'], url_path='profile')
    def profile(self, request, pk=None):
        user = self.service.get_user(user_id=pk)

        return Response(
            UserReadSerializer(user).data,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        request=None,
        responses={200: ApiResponseSerializer},
        summary="Deactivate user",
        description="Deactivate user account",
        tags=["users"],
    )
    @action(detail=True, methods=['delete'], url_path='deactivate')
    def deactivate(self, request, pk=None):
        self.service.deactivate_user(user_id=pk)
        return api_response(
            message="User deactivated successfully",
            status_code=status.HTTP_200_OK
        )

    @extend_schema(
        request=UserUpdateSerializer,
        responses={200: ApiResponseSerializer},
        summary="Update user",
        description="Update user information",
        tags=["users"],
    )
    @action(detail=True, methods=['patch'], url_path='update')
    def update_user(self, request, pk=None):
        update_serializer = UserUpdateSerializer(data=request.data, partial=True)
        update_serializer.is_valid(raise_exception=True)

        user = self.service.update_user(
            user_id=pk,
            **update_serializer.validated_data
        )

        return api_response(
            data=UserReadSerializer(user).data,
            message="User updated successfully"
        )
