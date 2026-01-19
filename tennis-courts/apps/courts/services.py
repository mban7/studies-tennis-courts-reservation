from uuid import UUID

from django.db import transaction

from apps.courts.models import Court, CourtPrice


class CourtService:
    @staticmethod
    def get_court(court_id: UUID) -> Court:
        return Court.objects.prefetch_related("prices").get(id=court_id)

    @staticmethod
    def get_courts() -> list[Court]:
        return list(Court.objects.prefetch_related("prices").all())

    @staticmethod
    @transaction.atomic
    def create_court(court_data: dict) -> Court:
        prices_data = court_data.pop("prices")

        court = Court.objects.create(**court_data)

        if prices_data:
            CourtPrice.objects.create(
                court=court,
                **prices_data
            )

        return Court.objects.prefetch_related("prices").get(id=court.id)
