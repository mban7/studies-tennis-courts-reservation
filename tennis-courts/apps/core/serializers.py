from rest_framework import serializers

class ApiResponseSerializer(serializers.Serializer):
    message = serializers.CharField(required=False)
    data = serializers.JSONField(required=False)
