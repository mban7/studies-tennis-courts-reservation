from apps.courts.models import Court, CourtPrice


def seed_courts():
    courts_data = [
        {
            "name": "Kort Marszałkowska",
            "court_type": Court.CourtType.INDOOR,
            "surface": Court.CourtSurface.CLAY,
            "max_players": 4,
            "city": "Warszawa",
            "street": "Marszałkowska 1",
            "postal_code": "00-001",
            "description": "Profesjonalny kort halowy z nawierzchnią ceglastą i doskonałym oświetleniem",
            "price": 80.00,
        },
        {
            "name": "Kort Nowy Świat",
            "court_type": Court.CourtType.OUTDOOR,
            "surface": Court.CourtSurface.HARD,
            "max_players": 4,
            "city": "Warszawa",
            "street": "Nowy Świat 15",
            "postal_code": "00-029",
            "description": "Nowoczesny kort otwarty z twardą nawierzchnią, idealny na turnieje",
            "price": 60.00,
        },
        {
            "name": "Kort Floriańska",
            "court_type": Court.CourtType.OUTDOOR,
            "surface": Court.CourtSurface.GRASS,
            "max_players": 2,
            "city": "Kraków",
            "street": "Floriańska 20",
            "postal_code": "31-019",
            "description": "Piękny kort trawiasta w sercu Krakowa",
            "price": 100.00,
        },
    ]

    courts = []
    for court_data in courts_data:
        if not Court.objects.filter(name=court_data["name"]).exists():
            price = court_data.pop("price")
            court = Court.objects.create(**court_data)
            CourtPrice.objects.create(court=court, price_per_hour=price)
            courts.append(court)
        else:
            courts.append(Court.objects.get(name=court_data["name"]))

    return courts
