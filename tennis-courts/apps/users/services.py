from uuid import UUID

from django.db import transaction
from apps.users.models import User

class UserService:
    @staticmethod
    def get_user(*, user_id: UUID) -> User:
        return User.objects.get(id=user_id)

    @staticmethod
    def get_users() ->list[User]:
        return list(User.objects.all())

    @staticmethod
    @transaction.atomic
    def create_user(*, email: str, password: str, role: str = None, first_name: str = None, last_name: str = None) -> User:
        user_data = {}

        if role:
            user_data['role'] = role

        if first_name:
            user_data['first_name'] = first_name

        if last_name:
            user_data['last_name'] = last_name

        user = User.objects.create_user(
            email=email,
            password=password,
            **user_data
        )
        return user

    @staticmethod
    @transaction.atomic
    def toggle_user(*, user_id: UUID) -> User:
        user = User.objects.select_for_update().get(id=user_id)

        user.is_active = not user.is_active
        user.save(update_fields=["is_active"])

        return user

    @staticmethod
    @transaction.atomic
    def update_user(*, user_id: UUID, email: str = None, first_name: str = None, last_name: str = None) -> User:
        user = User.objects.get(id=user_id)
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
