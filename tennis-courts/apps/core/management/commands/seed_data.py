from django.core.management.base import BaseCommand
from .seed_users import seed_users
from .seed_courts import seed_courts
from .seed_reservations import seed_reservations


class Command(BaseCommand):
    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Starting database seeding..."))

        users = seed_users()
        self.stdout.write(self.style.SUCCESS(f"✓ Users: {len(users)} created/found"))

        courts = seed_courts()
        self.stdout.write(self.style.SUCCESS(f"✓ Courts: {len(courts)} created/found"))

        reservations = seed_reservations(users.get('user'), courts)
        self.stdout.write(self.style.SUCCESS(f"✓ Reservations: {len(reservations)} created"))

        self.stdout.write(self.style.SUCCESS("\n✅ Database seeding completed!"))
