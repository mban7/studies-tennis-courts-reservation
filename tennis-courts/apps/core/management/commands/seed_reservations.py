from django.utils import timezone
from datetime import timedelta
from apps.reservations.models import Reservation


def seed_reservations(user, courts):
    if not user or len(courts) < 2:
        return []

    now = timezone.now()
    reservations_data = [
        {
            "court": courts[0],
            "user": user,
            "players_count": 2,
            "additional_info": "Pierwsza testowa rezerwacja",
            "status": Reservation.ReservationStatus.CONFIRMED,
            "total_amount": 80.00,
            "start_at": now + timedelta(days=1, hours=10),
            "end_at": now + timedelta(days=1, hours=11),
        },
        {
            "court": courts[1],
            "user": user,
            "players_count": 4,
            "additional_info": "Druga testowa rezerwacja - mecz deblowy",
            "status": Reservation.ReservationStatus.PENDING,
            "total_amount": 120.00,
            "start_at": now + timedelta(days=2, hours=14),
            "end_at": now + timedelta(days=2, hours=16),
        },
    ]

    reservations = []
    for reservation_data in reservations_data:
        if not Reservation.objects.filter(
            court=reservation_data["court"],
            start_at=reservation_data["start_at"],
        ).exists():
            reservations.append(Reservation.objects.create(**reservation_data))

    return reservations
