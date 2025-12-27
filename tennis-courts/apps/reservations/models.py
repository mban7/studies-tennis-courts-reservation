import uuid

from django.db import models
from django.core.validators import MinValueValidator

from apps.courts.models import Court
from apps.payments.models import Payment
from apps.users.models import User


class Reservation(models.Model):
    class ReservationStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        CANCELED = 'canceled', 'Canceled'
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    court = models.ForeignKey(Court, on_delete=models.PROTECT, related_name='reservation_court')
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='reservation_user')
    payment = models.ForeignKey(Payment, on_delete=models.PROTECT, related_name='reservation_payment')
    players_count = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1)]
    )
    additional_info = models.TextField()
    status = models.CharField(max_length=10, choices=ReservationStatus.choices, default=ReservationStatus.PENDING)
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
