from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from drf_spectacular.utils import extend_schema

from apps.users.services import UserService
from apps.users.serializers import (
    UserReadSerializer, UserCreateSerializer, UserUpdateSerializer,
    AdminCreateSerializer
)
from apps.core.permissions import IsAdmin


class UserView(ViewSet):
    permission_classes = [IsAuthenticated]

    @property
    def service(self):
        return UserService()

    def get_permissions(self):
        public_actions = {"register"}
        admin_actions = {"register_admin"}

        if self.action == "register":
            return [AllowAny()]
        elif self.action == "register_admin":
            return [IsAdmin()]

        return [IsAuthenticated()]
    @extend_schema(
        request=UserCreateSerializer,
        responses={201: UserReadSerializer},
        summary="Register User",
        description="Create new user account"
    )
    @action(detail=False, methods=['post'], url_path='user')
    def register(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.service.create_user(**serializer.validated_data)

        return Response(
            UserReadSerializer(user).data,
            status=status.HTTP_201_CREATED
        )

    @extend_schema(
        request=AdminCreateSerializer,
        responses={201: UserReadSerializer},
        summary="Create Admin User",
        description="Create new admin user account - requires admin authentication"
    )
    @action(detail=False, methods=['post'], url_path='admin')
    def register_admin(self, request):
        serializer = AdminCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_data = serializer.validated_data.copy()
        user = self.service.create_admin(**user_data)

        return Response(
            UserReadSerializer(user).data,
            status=status.HTTP_201_CREATED
        )

    @extend_schema(
        request=None,
        responses={200: UserReadSerializer},
        summary="Get user by his email",
    )
    @action(detail=False, methods=['get'], url_path='profile')
    def profile(self, request, pk=None):
        user = self.service.get_user(user_id=pk)

        return Response(
            UserReadSerializer(user).data,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        request=None,
        responses={200: UserReadSerializer},
        summary="Deactivate user",
        description="Deactivate user account by UUID"
    )
    @action(detail=True, methods=['delete'], url_path='deactivate')
    def deactivate(self, request, pk=None):
        user = self.service.deactivate_user(user_id=pk)
        return Response(
            UserReadSerializer(user).data,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        request=UserUpdateSerializer,
        responses={200: UserReadSerializer},
        summary="Update user",
        description="Update user information by UUID"
    )
    @action(detail=True, methods=['patch'], url_path='update')
    def update_user(self, request, pk=None):
        # pk comes from URL path parameter, already validated by DRF
        update_serializer = UserUpdateSerializer(data=request.data, partial=True)
        update_serializer.is_valid(raise_exception=True)

        user = self.service.update_user(
            user_id=pk,
            **update_serializer.validated_data
        )

        return Response(
            UserReadSerializer(user).data,
            status=status.HTTP_200_OK
        )
