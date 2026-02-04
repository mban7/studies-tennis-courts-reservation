from apps.users.models import User


def seed_users():
    users = {}

    if not User.objects.filter(email="user@test.com").exists():
        users['user'] = User.objects.create_user(
            email="user@test.com",
            password="user1234",
            first_name="Test",
            last_name="User",
            role=User.Role.USER,
        )
    else:
        users['user'] = User.objects.get(email="user@test.com")

    if not User.objects.filter(email="admin@test.com").exists():
        users['admin'] = User.objects.create_user(
            email="admin@test.com",
            password="admin1234",
            first_name="Admin",
            last_name="User",
            role=User.Role.ADMIN,
        )
    else:
        users['admin'] = User.objects.get(email="admin@test.com")

    return users
