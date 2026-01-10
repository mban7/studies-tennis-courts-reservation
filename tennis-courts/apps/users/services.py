from uuid import UUID

from django.db import transaction
from django.shortcuts import get_object_or_404
from apps.users.models import User

class UserService:
    @staticmethod
    def get_user(*, user_id: UUID) -> User:
        return get_object_or_404(User, id=user_id)

    @staticmethod
    @transaction.atomic
    def create_user(*, email: str, password: str) -> User:
        return User.objects.create_user(
            email=email,
            password=password,
        )

    @staticmethod
    @transaction.atomic
    def create_admin(*, email: str, password: str, first_name: str = None, last_name: str = None) -> User:
        user = UserService.create_user(email=email, password=password)
        user.role=User.Role.ADMIN

        if first_name:
            user.first_name=first_name
        if last_name:
            user.last_name=last_name

        user.save(update_fields=["role"])

        return user

    @staticmethod
    @transaction.atomic
    def deactivate_user(*, user_id: UUID) -> User:
        user = get_object_or_404(User, id=user_id)

        if not user.is_active:
            return user

        user.is_active = False
        user.save(update_fields=["is_active"])
        return user

    @staticmethod
    @transaction.atomic
    def update_user(*, user_id: UUID, email: str = None, first_name: str = None, last_name: str = None) -> User:
        user = get_object_or_404(User, id=user_id)
        update_fields = []

        if email is not None:
            user.email = email
            update_fields.append("email")

        if first_name is not None:
            user.first_name = first_name
            update_fields.append("first_name")

        if last_name is not None:
            user.last_name = last_name
            update_fields.append("last_name")

        if update_fields:
            user.save(update_fields=update_fields)

        return user
