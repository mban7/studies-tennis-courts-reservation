from rest_framework import serializers

from apps.courts.models import CourtPrice, Court

class CourtPriceReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourtPrice
        fields = [
            "id",
            "price_per_hour",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

class CourtReadSerializer(serializers.ModelSerializer):
    prices = CourtPriceReadSerializer(many=True, read_only=True)

    class Meta:
        model = Court
        fields = [
            "id",
            "name",
            "court_type",
            "surface",
            "max_players",
            "city",
            "street",
            "postal_code",
            "description",
            "is_active",
            "prices",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

class CourtPriceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourtPrice
        fields = ["price_per_hour"]

class CourtCreateSerializer(serializers.ModelSerializer):
    court_type = serializers.ChoiceField(choices=Court.CourtType.choices)
    surface = serializers.ChoiceField(choices=Court.CourtSurface.choices)
    prices = CourtPriceCreateSerializer(many=False)

    class Meta:
        model = Court
        fields = [
            "name",
            "court_type",
            "surface",
            "max_players",
            "city",
            "street",
            "postal_code",
            "description",
            "prices",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

class CourtPriceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourtPrice
        fields = ["price_per_hour"]
        extra_kwargs = {
            "price_per_hour": {"required": False},
        }


class CourtUpdateSerializer(serializers.ModelSerializer):
    prices = CourtPriceUpdateSerializer(required=False)

    class Meta:
        model = Court
        fields = [
            "name",
            "court_type",
            "surface",
            "max_players",
            "city",
            "street",
            "postal_code",
            "description",
            "is_active",
            "prices",
        ]
        extra_kwargs = {
            field: {"required": False}
            for field in fields
        }

