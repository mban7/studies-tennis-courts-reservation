# Instrukcje uruchomienia

## Quick Start

1. Upewnij się że masz plik `.env` w głównym katalogu (skopiuj z `.env.example` jeśli go nie masz):
```bash
cp .env.example .env
```

2. Uruchom wszystko za pomocą docker-compose:
```bash
docker-compose up --build
```

3. Otwórz w przeglądarce:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api/schema/docs/
- Mailpit (email testing): http://localhost:8025

## Dane testowe

Po pierwszym uruchomieniu w bazie danych zostaną utworzeni użytkownicy:

- **User**: user@test.com / user1234
- **Admin**: admin@test.com / admin1234

Oraz 3 korty tenisowe:
- **Kort 1**: Hala Ceglana (Warszawa) - 80 PLN/h
- **Kort 2**: Otwarty Twarda (Warszawa) - 60 PLN/h
- **Kort 3**: Otwarty Trawiasta (Kraków) - 100 PLN/h

I 2 przykładowe rezerwacje dla użytkownika testowego:
- Rezerwacja #1: Kort 1, jutro o 10:00-11:00 (status: potwierdzona)
- Rezerwacja #2: Kort 2, pojutrze o 14:00-16:00 (status: oczekująca)

## Co się dzieje przy starcie?

Backend przy starcie:
1. Czeka na uruchomienie PostgreSQL
2. Wykonuje migracje (`python manage.py migrate`)
3. Tworzy użytkowników testowych (`python manage.py seed_data`)
4. Uruchamia dev server na porcie 8000

Frontend przy starcie:
1. Instaluje zależności (bun install)
2. Uruchamia dev server na porcie 5173 (z hot-reload)

## Zatrzymanie

```bash
docker-compose down
```

## Zatrzymanie i usunięcie danych

```bash
docker-compose down -v
```

## Refresh token (axios interceptor)

Frontend automatycznie obsługuje refresh tokenów:
- Gdy otrzyma 401, automatycznie wywołuje `/auth/refresh/`
- Jeśli refresh się powiedzie (200), powtarza oryginalny request
- Jeśli nie - zwraca error

Kod w `frontend/src/lib/axios.ts`:
```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshResponse = await axios.post(`${API_URL}/auth/refresh/`, {}, { withCredentials: true });
      if (refreshResponse.status === 200) return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);
```
