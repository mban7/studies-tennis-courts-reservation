from uuid import UUID

from apps.courts.models import Court


class CourtService:
    @staticmethod
    def get_court(court_id: UUID) -> Court:
        return Court.objects.get(pk=court_id)

    @staticmethod
    def get_courts():
        return Court.objects.all()


