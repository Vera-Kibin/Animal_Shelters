# Jak pracować nad projektem

## CZĘŚĆ 1. Po co to wszystko (w skrócie)

Najważniejsza idea: jest jedna „czysta" wersja projektu (gałąź `main`).
Nikt nie pisze w niej bezpośrednio. Każdy robi swoją zmianę „obok", w swojej
kopii (gałęzi), a dopiero po sprawdzeniu wrzucamy to do `main`. Dzięki temu,
nawet jak ktoś coś popsuje u siebie — główna wersja jest bezpieczna.

---

## CZĘŚĆ 2. Co zrobić RAZ na początku

1. Zainstaluj Node.js — wejdź na https://nodejs.org i pobierz wersję LTS.
   (To program, który pozwala uruchomić projekt na Twoim komputerze.)

2. Zainstaluj Git — https://git-scm.com (jeśli nie masz).
   (Git to narzędzie do zapisywania wersji kodu i pracy z GitHubem.)

3. Pobierz projekt na komputer:
   otwórz terminal i wpisz:
   `git clone https://github.com/Vera-Kibin/Animal_Shelters.git`

4. Wejdź do folderu projektu:
   `cd Animal_Shelters`

5. Zainstaluj „zależności" (biblioteki, których projekt używa):
   `npm install`
   (Robisz to raz. Może chwilę potrwać.)

6. Uruchom projekt u siebie:
   `npm run dev`
   W terminalu pojawi się adres (zwykle http://localhost:5173) —
   otwórz go w przeglądarce. To Twoja lokalna wersja strony.
   Gdy zmieniasz kod i zapisujesz plik — strona sama się odświeża.

Żeby zatrzymać: w terminalu wciśnij Ctrl + C.

---

## CZĘŚĆ 3. Najważniejsza zasada

**NIE pracujemy bezpośrednio w gałęzi `main`.**
`main` to wersja „na czysto". Każdy robi swoją rzecz w OSOBNEJ gałęzi.

Dodatkowo u nas (ważne!):

- Możesz robić `git push` swojej gałęzi (to jest OK, to tylko Twoja kopia).
- ALE NIE łącz swojej gałęzi z `main` (nie rób „merge") samodzielnie.
- Najpierw pokazujemy zmianę: na grupie zrzutem ekranu albo na rozmowie.
  Dopiero gdy wspólnie potwierdzimy, że jest OK — wtedy łączymy z `main`.

Po co tak? Żeby nie wrzucać do głównej wersji rzeczy, które potem trzeba
przerabiać, i żeby nie było bałaganu z gałęziami.

---

## CZĘŚĆ 4. Jak zrobić swoje zadanie (krok po kroku)

1. Zawsze zacznij od pobrania najświeższej wersji `main`:
   `git checkout main`
   `git pull`

2. Stwórz swoją gałąź (nazwa: imię/co-robisz, małymi literami, po łacinie):
   `git checkout -b ania/logo-w-stopce`

3. Rób zmiany w kodzie. Sprawdzaj na bieżąco w przeglądarce (`npm run dev`).

4. Zapisz zmiany w Git:
   `git add .`
   `git commit -m "krótki opis co zrobiłeś"`

5. Wyślij swoją gałąź na GitHub:
   `git push -u origin ania/logo-w-stopce`

6. STOP. Nie łącz z `main`. Pokaż efekt na grupie / rozmowie.
   Dopiero po akceptacji robimy razem pull request i merge.

---

## CZĘŚĆ 5. Nazewnictwo gałęzi (żeby się nie pogubić)

Format: `imie/co-robisz`

- `ania/baner-cookies`
- `lena/sekcja-o-projekcie`
- `daniel/formularz-oceny`

---

## CZĘŚĆ 6. Struktura plików — co gdzie jest (szczegółowo)

Jeśli czegoś nie znajdziesz albo nie wiesz, który plik zmienić — napisz do Very.

```
Animal_Shelters/
├─ public/                      ← pliki statyczne (np. logo, zdjęcia)
│                                 wrzucasz tu plik i odwołujesz się "/nazwa.jpg"
├─ index.html                   ← główny plik HTML (zwykle nie ruszamy)
├─ package.json                 ← lista bibliotek i komendy (dev, build, deploy)
├─ vite.config.js               ← konfiguracja (m.in. base dla GitHub Pages)
│
└─ src/                         ← TU jest cały kod strony
   ├─ main.jsx                  ← punkt startowy aplikacji (zwykle nie ruszamy)
   ├─ App.jsx                   ← składa stronę: nagłówek + treść + stopka
   │
   ├─ styles/
   │   └─ tokens.css            ← KOLORY, czcionki, wspólne zmienne
   │                             (np. --accent to żółty, --green to zielony)
   │
   ├─ pages/
   │   ├─ HomePage.jsx          ← główna strona, łączy wszystkie sekcje razem
   │   └─ HomePage.css
   │
   ├─ data/
   │   └─ (pliki JSON z bazą schronisk)  ← surowe dane o schroniskach
   │
   ├─ hooks/                    ← LOGIKA (nie wygląd)
   │   ├─ useShelters.js        ← wczytuje dane schronisk
   │   └─ useShelterFilters.js  ← filtrowanie, wyszukiwanie, geolokalizacja
   │
   ├─ assets/
   │   └─ Animals.jsx           ← ikony (pies, kot, łapa, domek)
   │
   └─ components/               ← „klocki", z których zbudowana jest strona
       ├─ Layout/
       │   ├─ Header.jsx/.css   ← górny pasek (logo, menu, przyciski)
       │   └─ Footer.jsx/.css   ← stopka na dole
       ├─ Hero/
       │   └─ Hero.jsx/.css     ← duża sekcja na górze (tytuł, zdjęcie, liczby)
       ├─ Filters/
       │   └─ FilterBar.jsx/.css← pasek wyszukiwania i filtrów
       ├─ Map/
       │   └─ ShelterMap.jsx/.css ← mapa z pinezkami (Leaflet)
       ├─ Shelters/
       │   ├─ ShelterList.jsx   ← lista kart schronisk
       │   ├─ ShelterCard.jsx/.css ← pojedyncza karta schroniska
       │   ├─ ShelterProfile.jsx/.css ← strona schroniska (po kliknięciu)
       │   ├─ CommentModal.jsx/.css   ← formularz opinii
       │   └─ AddAzylModal.jsx/.css   ← formularz „Dodaj placówkę"
       └─ About/
           └─ About.jsx/.css    ← sekcja „O projekcie"
```

Zasada ogólna:

- chcesz zmienić WYGLĄD czegoś → szukaj pliku `.css` obok komponentu,
- chcesz zmienić TEKST/strukturę → plik `.jsx` danego komponentu,
- chcesz zmienić KOLOR globalnie → `src/styles/tokens.css`.

---

## CZĘŚĆ 7. Czego NIE robimy teraz (żeby nie robić podwójnej roboty)

- Zmiany wizualne (logo, kolory, drobiazgi) — NAJPIERW uzgadniamy na grupie
  albo zrzutem ekranu, DOPIERO potem wrzucamy do `main`.
- Można pushować swoją gałąź, ale bez łączenia z `main` bez zgody.
- Drobnych, nieuzgodnionych zmian nie wrzucamy do głównej wersji.

---

## CZĘŚĆ 8. Deploy (wrzucenie wersji „na żywo")

Strona działa na GitHub Pages: https://vera-kibin.github.io/Animal_Shelters/
Deploy robi JEDNA osoba, komendą `npm run deploy`, po scaleniu zmian do `main`.
Nie każdy robi deploy osobno — żeby nie nadpisywać sobie wersji.

---

## CZĘŚĆ 9. Jak zrobić merge (po akceptacji)

Merge robimy DOPIERO, gdy zmiana została zaakceptowana na grupie/rozmowie.

Najprościej przez GitHub (zalecane):

1. Wejdź na GitHub → zakładka „Pull requests".
2. Otwórz swój pull request (ten, który był „in review").
3. Kliknij „Merge pull request" → „Confirm merge".
4. Gotowe —

---

## CZĘŚĆ 10. Przydatne komendy Git (ściąga)

```
git status              ← co się zmieniło, na jakiej gałęzi jesteś
git branch              ← lista Twoich gałęzi (gwiazdka = aktualna)
git checkout nazwa      ← przełącz się na istniejącą gałąź
git checkout -b nazwa   ← stwórz nową gałąź i przejdź na nią
git pull                ← pobierz najnowszą wersję z GitHuba
git add .               ← przygotuj wszystkie zmiany do zapisu
git commit -m "opis"    ← zapisz zmiany z opisem
git push                ← wyślij swoją gałąź na GitHub
git log --oneline       ← historia zmian (krótko)
```

Jeśli coś pomyliłeś i nie wiesz, jak cofnąć — NIE kombinuj na siłę,
napisz na grupie. Często da się łatwo naprawić, jeśli nic jeszcze nie scaliłeś.

---

Masz pytanie albo coś nie działa? Napisz na grupie albo priv.
Naprawdę lepiej zapytać niż zgadywać
