from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from .serializers import LoginSerializer
from .services import login_user
from ..core.serializers import MessageSerializer


class AuthView(ViewSet):
    authentication_classes = []
    permission_classes = []

    @extend_schema(
        request=LoginSerializer,
        responses={200: MessageSerializer},
        summary="Login user",
    )
    @action(detail=False, methods=["post"], url_path="login")
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = login_user(
            request=request,
            **serializer.validated_data
        )

        response = Response({"detail": "ok"})
        print(data)
        response.set_cookie(
            "access_token",
            data["access"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=300,
            path="/api"
        )

        response.set_cookie(
            "refresh_token",
            data["refresh"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=86400,
            path="/auth/refresh"
        )

        return response

    @extend_schema(
        request=None,
        responses={200: MessageSerializer},
        summary="Logout",
    )
    @action(detail=False, methods=["post"], url_path="logout")
    def logout(self, request):
        response = Response({"detail": "ok"})

        response.delete_cookie("access_token", path="/api")
        response.delete_cookie("refresh_token", path="/auth/refresh")
        return response

