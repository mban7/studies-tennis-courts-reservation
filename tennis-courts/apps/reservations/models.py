import uuid

from django.db import models
from django.core.validators import MinValueValidator

from apps.courts.models import Court
from apps.users.models import User


class Reservation(models.Model):
    class ReservationStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        CANCELED = 'canceled', 'Canceled'
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    court = models.ForeignKey(Court, on_delete=models.PROTECT, related_name='reservation_court')
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='reservation_user')
    players_count = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1)]
    )
    additional_info = models.TextField()
    status = models.CharField(max_length=10, choices=ReservationStatus.choices, default=ReservationStatus.PENDING)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
