# Animal Shelters - Konfiguracja Docker

## Jak uruchomić projekt w Dockerze

1. Skopiuj plik `.env.example` i utwórz na jego podstawie plik `.env`:
   ```bash
   cp .env.example .env
   ```
2. Uruchom kontenery za pomocą narzędzia Docker Compose:
   ```bash
   docker compose up --build
   ```

Po pomyślnym uruchomieniu:
- **Frontend:** [http://localhost:8080](http://localhost:8080)
- **Backend (API):** [http://localhost:3000](http://localhost:3000)

## Dodane pliki i struktura projektu

- **`docker-compose.yml` (katalog główny)**
  Główny plik konfiguracyjny Docker Compose. Łączy i konfiguruje uruchamianie dwóch serwisów: `frontend` oraz `backend`. Udostępnia port `8080` dla strony internetowej oraz `3000` dla API.

- **`.env.example` (katalog główny)**
  Szablon zmiennych środowiskowych dla backendu i kontenerów. Zawiera podstawowe ustawienia (porty, sekretny klucz JWT, ustawienia CORS).
  
- **`Dockerfile` (katalog główny)** — *[Dodano w Zadaniu 1]*
  Odpowiada za zbudowanie frontendu (Vite/React) i hostowanie go za pomocą lekkiego serwera Nginx.

- **`server/Dockerfile` (w folderze server/)** — *[Dodano w Zadaniu 2]*
  Instrukcja do utworzenia obrazu instalacji backendu (Node.js/Express). Uruchamia serwer na porcie 3000.
