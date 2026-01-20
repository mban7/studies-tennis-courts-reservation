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

    @staticmethod
    @transaction.atomic
    def update_court(court_id: UUID, court_data: dict) -> Court:
        prices_data = court_data.pop("prices", None)
        is_active = court_data.pop("is_active", None)

        if is_active is not None:
            Court.objects.filter(id=court_id).update(
                is_active=is_active,
            )
            CourtPrice.objects.filter(court_id=court_id).update(
                is_active=is_active,
            )

        court = CourtService.get_court(court_id)

        for field, value in court_data.items():
            setattr(court, field, value)

        if court_data:
            court.save()

        if prices_data:
            CourtPrice.objects.update_or_create(
                court=court,
                defaults=prices_data,
            )

        return CourtService.get_court(court_id)


    @staticmethod
    @transaction.atomic
    def toggle_court(court_id: UUID) -> Court:
        court = Court.objects.select_for_update().get(id=court_id)

        new_state = not court.is_active

        Court.objects.filter(id=court_id).update(
            is_active=new_state,
        )

        CourtPrice.objects.filter(court_id=court_id).update(
            is_active=new_state,
        )

        return CourtService.get_court(court_id)



