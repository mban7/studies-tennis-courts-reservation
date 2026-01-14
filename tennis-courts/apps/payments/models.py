import uuid

from django.db import models

from apps.courts.models import CourtPrice
from apps.reservations.models import Reservation


class Payment(models.Model):
    class PaymentMethod(models.TextChoices):
        TRANSFER = 'transfer', 'Bank Transfer'
        IN_PERSON = 'in_person', 'Payment in person'
    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        CANCELLED = 'cancelled', 'Cancelled'
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reservation = models.ForeignKey(Reservation, on_delete=models.PROTECT, related_name="payments",)
    method = models.CharField(max_length=10, choices=PaymentMethod.choices)
    status = models.CharField(max_length=10, choices=PaymentStatus.choices)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=8, choices=CourtPrice.Currency.choices, default=CourtPrice.Currency.PLN)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expired_at = models.DateTimeField(null=True, blank=True)
