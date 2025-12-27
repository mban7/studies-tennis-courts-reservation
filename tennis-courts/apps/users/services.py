from apps.users.models import User

def create_user(*, email: str, password: str) -> User:
    return User.objects.create_user(
        email=email,
        password=password,
    )