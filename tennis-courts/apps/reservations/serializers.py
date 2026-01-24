from rest_framework import serializers
from apps.reservations.models import Reservation
from apps.courts.serializers import CourtReadSerializer
from apps.users.serializers import UserReadSerializer


class ReservationCreateSerializer(serializers.Serializer):
    court_id = serializers.UUIDField()
    players_count = serializers.IntegerField(min_value=1)
    additional_info = serializers.CharField(required=False, allow_blank=True)
    start_at = serializers.DateTimeField()
    end_at = serializers.DateTimeField()

    def validate(self, data):
        if data['start_at'] >= data['end_at']:
            raise serializers.ValidationError("end_at must be after start_at")
        return data


class ReservationUpdateSerializer(serializers.Serializer):
    players_count = serializers.IntegerField(min_value=1, required=False)
    additional_info = serializers.CharField(required=False, allow_blank=True)
    start_at = serializers.DateTimeField(required=False)
    end_at = serializers.DateTimeField(required=False)


class ReservationReadSerializer(serializers.ModelSerializer):
    court = CourtReadSerializer()
    user = UserReadSerializer()

    class Meta:
        model = Reservation
        fields = '__all__'
