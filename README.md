# Tennis Courts Reservation System

System rezerwacji kortów tenisowych z Django (backend) i React (frontend).

## Wymagania

- Docker
- Docker Compose

## Uruchomienie

1. Skopiuj plik `.env.example` do `.env`:
```bash
cp .env.example .env
```

2. Uruchom całą aplikację:
```bash
docker-compose up --build
```

3. Aplikacja będzie dostępna:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Mailpit (email testing): http://localhost:8025

## Dane testowe

Po uruchomieniu aplikacji w bazie danych zostaną utworzeni następujący użytkownicy:

- **Zwykły użytkownik:**
  - Email: `user@test.com`
  - Hasło: `user1234`

- **Administrator:**
  - Email: `admin@test.com`
  - Hasło: `admin1234`

**Korty tenisowe:**
- Kort 1 - Hala Ceglana (Warszawa) - 80 PLN/h
- Kort 2 - Otwarty Twarda (Warszawa) - 60 PLN/h
- Kort 3 - Otwarty Trawiasta (Kraków) - 100 PLN/h

**Przykładowe rezerwacje dla użytkownika testowego:**
- Rezerwacja #1: Kort 1, jutro 10:00-11:00 (potwierdzona)
- Rezerwacja #2: Kort 2, pojutrze 14:00-16:00 (oczekująca)

## Technologie

### Backend
- Django 6.0
- Django REST Framework
- PostgreSQL
- uv (package manager)
- SimpleJWT (authentication)

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- Axios
- React Router
- Bun (package manager)
