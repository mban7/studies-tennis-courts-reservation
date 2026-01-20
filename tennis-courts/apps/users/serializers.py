from rest_framework import serializers
from apps.users.models import User

class UserEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

class UserUIIDSerializer(serializers.Serializer):
    uuid = serializers.UUIDField()

class UserReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "role", "first_name", "last_name", "date_joined"]

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password"]
        extra_kwargs = {
            'password': {'write_only': True}
        }

class UserCreateWithRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "password", "role", "first_name", "last_name"]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_role(self, value):
        if value not in [User.Role.USER, User.Role.ADMIN]:
            raise serializers.ValidationError("Invalid role selected.")
        return value


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "first_name", "last_name"]