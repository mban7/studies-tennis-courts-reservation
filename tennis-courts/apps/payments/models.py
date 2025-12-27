import uuid

from django.db import models

class Payment(models.Model):
    class PaymentMethod(models.TextChoices):
        TRANSFER = 'transfer', 'Bank Transfer'
        IN_PERSON = 'in_person', 'Payment in person'
    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        CANCELLED = 'cancelled', 'Cancelled'
    id = models.UUIDField(primary_key=True, default=uuid.uuid4(), editable=False)
    method = models.CharField(max_length=10, choices=PaymentMethod.choices)
    status = models.CharField(max_length=10, choices=PaymentStatus.choices)
    paid_at = models.DateTimeField(null=True, blank=True)
