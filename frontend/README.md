# Frontend - System Rezerwacji Kortów Tenisowych

Frontend aplikacji do rezerwacji kortów tenisowych zbudowany w React + TypeScript + Tailwind CSS.

## Technologie

- **React 19.2** - biblioteka UI
- **TypeScript** - typowanie statyczne
- **Vite** - narzędzie budujące
- **React Router DOM** - routing
- **Axios** - klient HTTP
- **Tailwind CSS 4.x** - style

## Instalacja i uruchomienie

### Wymagania
- Node.js 18+
- npm lub yarn

### Instalacja zależności
```bash
npm install
```

### Konfiguracja
Plik `.env.local` powinien zawierać:
```
VITE_API_URL=http://localhost:8000
```

### Uruchomienie dev server
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:5173

### Budowanie produkcyjne
```bash
npm run build
```

## Struktura projektu

```
frontend/src/
├── components/          # Komponenty wielokrotnego użytku
│   └── common/         # Wspólne komponenty (Navbar, ProtectedRoute)
├── hooks/              # Custom hooks (useAuth)
├── lib/                # Biblioteki pomocnicze
│   ├── api.ts         # Funkcje API
│   └── axios.ts       # Konfiguracja axios z interceptorami
├── pages/              # Strony aplikacji
│   ├── auth/          # Strony autoryzacji (Login, Register)
│   ├── courts/        # Strony kortów
│   ├── reservations/  # Strony rezerwacji
│   └── admin/         # Panel administracyjny
│       ├── courts/
│       ├── reservations/
│       └── users/
├── styles/             # Style globalne
├── types/              # Definicje typów TypeScript
├── App.tsx             # Główny komponent
├── routes.tsx          # Konfiguracja routingu
└── main.tsx            # Entry point
```

## Funkcjonalności

### Dla użytkownika:
- Rejestracja i logowanie
- Przeglądanie dostępnych kortów tenisowych
- Filtrowanie kortów (kryte/odkryte)
- Rezerwacja kortów z wyborem daty i czasu
- Zarządzanie własnymi rezerwacjami
- Anulowanie rezerwacji w statusie "oczekująca"

### Dla administratora:
- Dashboard ze statystykami
- Zarządzanie kortami (dodawanie, edycja, aktywacja/dezaktywacja)
- Zarządzanie wszystkimi rezerwacjami
- Potwierdzanie i anulowanie rezerwacji
- Przeglądanie listy użytkowników

## Autoryzacja

Aplikacja używa autoryzacji opartej na cookie (HTTP-only cookies):
- `access_token` - token dostępu (ważny 5 min)
- `refresh_token` - token odświeżania (ważny 24h)

Axios automatycznie odświeża tokeny przy błędzie 401.

## Routing

### Publiczne ścieżki:
- `/login` - Logowanie
- `/rejestracja` - Rejestracja

### Chronione ścieżki (wymaga zalogowania):
- `/korty` - Lista kortów
- `/korty/:courtId/rezerwuj` - Rezerwacja kortu
- `/rezerwacje` - Moje rezerwacje

### Ścieżki administracyjne (wymaga roli admin):
- `/admin` - Dashboard
- `/admin/korty` - Zarządzanie kortami
- `/admin/rezerwacje` - Zarządzanie rezerwacjami
- `/admin/uzytkownicy` - Zarządzanie użytkownikami

## Stylowanie

Aplikacja używa Tailwind CSS 4.x z podstawowymi klasami utility:
- Responsywne breakpointy (md:, lg:)
- Kolorystyka: blue (główna), gray (tła), green/yellow/red (statusy)
- Komponenty z hover effects i transitions

## Hooki

### useAuth
Custom hook zarządzający stanem autoryzacji:
```typescript
const {
  user,           // Aktualnie zalogowany użytkownik
  loading,        // Stan ładowania
  error,          // Błędy autoryzacji
  login,          // Funkcja logowania
  register,       // Funkcja rejestracji
  logout,         // Funkcja wylogowania
  isAdmin,        // Czy użytkownik jest adminem
  isAuthenticated,// Czy użytkownik jest zalogowany
  refetch         // Odświeżenie danych użytkownika
} = useAuth();
```

## API

API functions są dostępne w `lib/api.ts`:
- `authApi` - autoryzacja (login, register, logout, getMe)
- `courtsApi` - korty (getCourts, getCourt, createCourt, updateCourt, toggleCourt)
- `reservationsApi` - rezerwacje (getReservations, createReservation, cancelReservation, confirmReservation)
- `usersApi` - użytkownicy (getUsers, createUser, updateUser)

## Uwagi implementacyjne

1. **Cookie-based auth** - Wszystkie requesty są wysyłane z `withCredentials: true`
2. **Auto-refresh** - Token jest automatycznie odświeżany przy 401
3. **Protected Routes** - Komponenty są chronione przez `ProtectedRoute`
4. **TypeScript** - Wszystkie typy są zdefiniowane w `types/index.ts`
5. **Responsywność** - UI jest responsywne (mobile-first approach)
