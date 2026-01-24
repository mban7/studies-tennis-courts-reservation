from uuid import UUID
from decimal import Decimal
from datetime import datetime

from django.db import transaction
from django.core.exceptions import ValidationError

from apps.emails.services import EmailService
from apps.reservations.models import Reservation
from apps.courts.models import Court
from apps.users.models import User


class ReservationService:
    @staticmethod
    def get_reservation(reservation_id: UUID) -> Reservation:
        return Reservation.objects.select_related('court', 'user').get(id=reservation_id)

    @staticmethod
    def get_reservations(user_id: UUID = None) -> list[Reservation]:
        queryset = Reservation.objects.select_related('court', 'user').all()
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return list(queryset)

    @staticmethod
    def check_availability(court_id: UUID, start_at: datetime, end_at: datetime, exclude_reservation_id: UUID = None) -> bool:
        queryset = Reservation.objects.filter(
            court_id=court_id,
            status__in=['pending', 'confirmed']
        ).filter(
            start_at__lt=end_at,
            end_at__gt=start_at
        )

        if exclude_reservation_id:
            queryset = queryset.exclude(id=exclude_reservation_id)

        return not queryset.exists()

    @staticmethod
    def calculate_total_amount(court_id: UUID, start_at: datetime, end_at: datetime) -> Decimal:
        court = Court.objects.prefetch_related('prices').get(id=court_id)
        price = court.prices.filter(is_active=True).first()

        if not price:
            return Decimal('0.00')

        duration_hours = (end_at - start_at).total_seconds() / 3600
        return price.price_per_hour * Decimal(str(duration_hours))

    @staticmethod
    @transaction.atomic
    def create_reservation(user_id: UUID, reservation_data: dict) -> Reservation:
        court_id = reservation_data.pop('court_id')
        start_at = reservation_data['start_at']
        end_at = reservation_data['end_at']

        court = Court.objects.get(id=court_id)
        user = User.objects.get(id=user_id)

        if not court.is_active:
            raise ValidationError("Court is not active")

        if not ReservationService.check_availability(court_id, start_at, end_at):
            raise ValidationError("Court is not available for the selected time")

        players_count = reservation_data.get('players_count', 2)
        if players_count > court.max_players:
            raise ValidationError(f"Too many players. Max players for this court: {court.max_players}")

        total_amount = ReservationService.calculate_total_amount(court_id, start_at, end_at)

        reservation = Reservation.objects.create(
            court=court,
            user=user,
            total_amount=total_amount,
            **reservation_data
        )

        reservation_with_relations = ReservationService.get_reservation(reservation.id)

        try:
            EmailService.send_reservation_confirmation(reservation_with_relations)
        except Exception:
            pass

        return reservation_with_relations

    @staticmethod
    @transaction.atomic
    def update_reservation(reservation_id: UUID, reservation_data: dict) -> Reservation:
        reservation = Reservation.objects.select_for_update().get(id=reservation_id)

        start_at = reservation_data.get('start_at', reservation.start_at)
        end_at = reservation_data.get('end_at', reservation.end_at)

        if 'start_at' in reservation_data or 'end_at' in reservation_data:
            if not ReservationService.check_availability(
                reservation.court_id, start_at, end_at, exclude_reservation_id=reservation_id
            ):
                raise ValidationError("Court is not available for the selected time")

            total_amount = ReservationService.calculate_total_amount(reservation.court_id, start_at, end_at)
            reservation.total_amount = total_amount

        for field, value in reservation_data.items():
            setattr(reservation, field, value)

        reservation.save()

        return ReservationService.get_reservation(reservation_id)

    @staticmethod
    @transaction.atomic
    def cancel_reservation(reservation_id: UUID) -> Reservation:
        reservation = Reservation.objects.select_for_update().get(id=reservation_id)
        reservation.status = Reservation.ReservationStatus.CANCELED
        reservation.save()

        reservation_with_relations = ReservationService.get_reservation(reservation_id)

        try:
            EmailService.send_reservation_cancellation(reservation_with_relations)
        except Exception:
            pass

        return reservation_with_relations

    @staticmethod
    @transaction.atomic
    def confirm_reservation(reservation_id: UUID) -> Reservation:
        reservation = Reservation.objects.select_for_update().get(id=reservation_id)
        reservation.status = Reservation.ReservationStatus.CONFIRMED
        reservation.save()

        reservation_with_relations = ReservationService.get_reservation(reservation_id)

        try:
            EmailService.send_reservation_confirmation(reservation_with_relations)
        except Exception:
            pass

        return reservation_with_relations
