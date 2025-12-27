from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status

from drf_spectacular.utils import extend_schema

from apps.users.services import create_user
from apps.users.serializers import (
    UserCreateSerializer,
)

class UserView(ViewSet):
    permission_classes = []

    @extend_schema(
        request=UserCreateSerializer,
        responses={200},
        summary="Register User",
        description="Create new user account"
    )
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = create_user(**serializer.validated_data)

        return Response(
            {"email": user.email},
            status=status.HTTP_200_OK
        )