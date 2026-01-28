from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from drf_spectacular.utils import extend_schema

from apps.core.permissions import IsAdmin
from apps.core.responses import api_response
from apps.core.serializers import ApiResponseSerializer
from apps.reservations.serializers import (
    ReservationCreateSerializer,
    ReservationUpdateSerializer,
    ReservationReadSerializer,
)
from apps.reservations.services import ReservationService


class ReservationView(ViewSet):
    permission_classes = [IsAuthenticated]

    @property
    def service(self):
        return ReservationService()

    def get_permissions(self):
        admin_actions = {"confirm_reservation"}

        if self.action in admin_actions:
            return [IsAdmin()]

        return [IsAuthenticated()]

    @extend_schema(
        request=None,
        responses={200: ApiResponseSerializer},
        summary="Get reservation",
        tags=["reservations"],
    )
    @action(detail=True, methods=["get"], url_path="get")
    def get_reservation(self, request, pk=None):
        reservation = self.service.get_reservation(pk)

        return api_response(
            data=ReservationReadSerializer(reservation).data,
            message="Reservation retrieved successfully",
            status_code=status.HTTP_200_OK,
        )

    @extend_schema(
        request=None,
        responses={200: ApiResponseSerializer},
        summary="Get reservations",
        tags=["reservations"],
    )
    @action(detail=False, methods=["get"], url_path="get")
    def get_reservations(self, request):
        user_id = request.user.id if request.user.role == "user" else None
        reservations = self.service.get_reservations(user_id=user_id)
        serializer = ReservationReadSerializer(reservations, many=True)

        return api_response(
            data=serializer.data,
            message="Reservations retrieved successfully",
            status_code=status.HTTP_200_OK,
        )

    @extend_schema(
        request=None,
        responses={200: ApiResponseSerializer},
        summary="Get court reservations",
        tags=["reservations"],
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="court/(?P<court_id>[^/.]+)",
        url_name="court-reservations",
    )
    def get_court_reservations(self, request, court_id=None):
        # Get all active reservations for the court (no date filter)
        # Frontend will handle filtering by selected date
        reservations = self.service.get_court_reservations(court_id, from_date=None)
        serializer = ReservationReadSerializer(reservations, many=True)

        return api_response(
            data=serializer.data,
            message="Court reservations retrieved successfully",
            status_code=status.HTTP_200_OK,
        )

    @extend_schema(
        request=ReservationCreateSerializer,
        responses={200: ApiResponseSerializer},
        summary="Create a new reservation",
        tags=["reservations"],
    )
    @action(detail=False, methods=["post"], url_path="create")
    def create_reservation(self, request):
        serializer = ReservationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reservation = self.service.create_reservation(
            user_id=request.user.id, reservation_data=serializer.validated_data
        )

        return api_response(
            data=ReservationReadSerializer(reservation).data,
            message="Reservation created successfully",
            status_code=status.HTTP_200_OK,
        )

    @extend_schema(
        request=ReservationUpdateSerializer,
        responses={200: ApiResponseSerializer},
        summary="Update reservation",
        tags=["reservations"],
    )
    @action(detail=True, methods=["patch"], url_path="update")
    def update_reservation(self, request, pk=None):
        serializer = ReservationUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        reservation = self.service.update_reservation(pk, serializer.validated_data)

        return api_response(
            data=ReservationReadSerializer(reservation).data,
            message="Reservation updated successfully",
            status_code=status.HTTP_200_OK,
        )

    @extend_schema(
        request=None,
        responses={200: ApiResponseSerializer},
        summary="Cancel reservation",
        tags=["reservations"],
    )
    @action(detail=True, methods=["post"], url_path="cancel")
    def cancel_reservation(self, request, pk=None):
        reservation = self.service.cancel_reservation(pk)

        return api_response(
            data=ReservationReadSerializer(reservation).data,
            message="Reservation canceled successfully",
            status_code=status.HTTP_200_OK,
        )

    @extend_schema(
        request=None,
        responses={200: ApiResponseSerializer},
        summary="Confirm reservation",
        tags=["reservations"],
    )
    @action(detail=True, methods=["post"], url_path="confirm")
    def confirm_reservation(self, request, pk=None):
        reservation = self.service.confirm_reservation(pk)

        return api_response(
            data=ReservationReadSerializer(reservation).data,
            message="Reservation confirmed successfully",
            status_code=status.HTTP_200_OK,
        )
