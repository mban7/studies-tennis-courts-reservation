import uuid

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Court(models.Model):
    class CourtType(models.TextChoices):
        INDOOR = 'indoor', 'Indoor'
        OUTDOOR = 'outdoor', 'Outdoor'
    class CourtSurface(models.TextChoices):
        CLAY = 'clay', 'Clay'
        GRASS = 'grass', 'Grass'
        HARD = 'hard', 'Hard'
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=64)
    court_type = models.CharField(max_length=16, choices=CourtType.choices)
    surface = models.CharField(max_length=16, choices=CourtSurface.choices)
    max_players = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(4)
        ],
        default=2
    )
    city = models.CharField(max_length=32)
    street = models.CharField(max_length=32)
    postal_code = models.CharField(max_length=16)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CourtPrice(models.Model):
    class Currency(models.TextChoices):
        PLN = 'PLN', 'PLN'
        EUR = 'EUR', 'Euro'
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    court = models.ForeignKey(Court, on_delete=models.PROTECT, related_name='prices')
    price_per_hour = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=8, choices=Currency.choices, default=Currency.PLN)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



