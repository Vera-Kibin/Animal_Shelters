import { useState } from "react";
import "./CookieBanner.css";

const STORAGE_KEY = "cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(
    () => !localStorage.getItem(STORAGE_KEY)
  );
  const [expanded, setExpanded] = useState(false);

  const consent = (value) => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Informacja o cookies">
      <div className="cookie-banner__inner container">
        <div className="cookie-banner__text">
          <p className="cookie-banner__title">Informacja o plikach cookies</p>
          <p>
            Ta strona korzysta z plików cookies, aby świadczyć usługi na
            najwyższym poziomie. Dalsze korzystanie ze strony oznacza zgodę na
            ich użycie.
          </p>

          {expanded && (
            <div className="cookie-banner__details">
              <h3>I. Informacje ogólne</h3>
              <p>
                Niniejsza Polityka Prywatności określa sposób pozyskiwania,
                przetwarzania oraz zabezpieczania danych osobowych w rozumieniu
                ustawy o ochronie danych osobowych z dnia 29 sierpnia 1997 roku
                (Dz.U. Nr 133, poz. 883 z póź. zm.) oraz ustawą o świadczeniu
                usług drogą elektroniczną z dnia 18 lipca 2002 r. (Dz.U. Nr 144,
                poz. 1204 z póź. zm.)
              </p>
              <p>
                Właścicielem strony internetowej animalhelper.pl oraz
                administratorem danych osobowych jest Fundacja Psia Krew z
                siedzibą w Gdańsku przy ul. Obrońców Westerplatte 12, 80-317, NIP
                5892043256, REGON: 380074917, KRS: 0000730048.
              </p>

              <h3>II. Dane osobowe</h3>
              <ol>
                <li>Serwis zbiera informacje podane dobrowolnie przez użytkownika.</li>
                <li>Dane osobowe są pozyskiwane podczas wypełniania formularza newsletter</li>
                <li>Dane osobowe są wykorzystywane wyłącznie w celu wysyłania newslettera oraz o ile wyraził na to zgodę.</li>
                <li>Zawartość strony internetowej można przeglądać bez podawania jakichkolwiek danych osobowych.</li>
                <li>
                  Każda osoba, która udostępniła swoje dane osobowe ma prawo do
                  dostępu do ich treści oraz możliwość ich poprawiania,
                  uaktualniania, uzupełniania, jak i również żądania zaprzestania
                  przetwarzania danych osobowych oraz wniesienia sprzeciwu wobec
                  przetwarzania danych osobowych. Wymienione czynności można dokonać
                  poprzez wysłanie stosownego oświadczenia na adres email:
                  fundacjapsiakrew@gmail.com
                </li>
                <li>
                  Pozyskane przez administratora dane osobowe są przechowywane,
                  przetwarzane i chronione zgodnie z obowiązującymi przepisami prawa.
                  Zbiór danych osobowych został zgłoszony do Urzędu Ochrony Danych
                  Osobowych (uodo.gov.pl)
                </li>
                <li>
                  Administrator chroni zgromadzone dane osobowe korzystając z
                  następujących środków:
                  <ul>
                    <li>szyfrowanie danych służących do zapisu do newslettera</li>
                    <li>zabezpieczenie zbioru danych przed nieuprawnionym dostępem</li>
                  </ul>
                </li>
              </ol>

              <h3>III. Informacja o plikach cookies.</h3>
              <ol>
                <li>Serwis korzysta z plików cookies.</li>
                <li>
                  Pliki cookies (tzw. „ciasteczka") stanowią dane informatyczne, w
                  szczególności pliki tekstowe, które przechowywane są w urządzeniu
                  końcowym Użytkownika Serwisu i przeznaczone są do korzystania ze
                  stron internetowych Serwisu. Cookies zazwyczaj zawierają nazwę
                  strony internetowej, z której pochodzą, czas przechowywania ich na
                  urządzeniu końcowym oraz unikalny numer.
                </li>
                <li>
                  Podmiotem zamieszczającym na urządzeniu końcowym Użytkownika Serwisu
                  pliki cookies oraz uzyskującym do nich dostęp jest operator Serwisu.
                </li>
                <li>
                  Pliki cookies wykorzystywane są w następujących celach:
                  <ul>
                    <li>
                      tworzenia statystyk, które pomagają zrozumieć, w jaki sposób
                      Użytkownicy Serwisu korzystają ze stron internetowych, co
                      umożliwia ulepszanie ich struktury i zawartości;
                    </li>
                    <li>
                      utrzymania sesji Użytkownika Serwisu (po zalogowaniu), dzięki
                      której Użytkownik nie musi na każdej podstronie Serwisu
                      ponownie wpisywać loginu i hasła;
                    </li>
                    <li>
                      określania profilu użytkownika w celu wyświetlania mu
                      dopasowanych materiałów w sieciach reklamowych, w
                      szczególności sieci Google.
                    </li>
                  </ul>
                </li>
                <li>
                  W ramach Serwisu stosowane są dwa zasadnicze rodzaje plików cookies:
                  „sesyjne" (session cookies) oraz „stałe" (persistent cookies).
                  Cookies „sesyjne" są plikami tymczasowymi, które przechowywane są w
                  urządzeniu końcowym Użytkownika do czasu wylogowania, opuszczenia
                  strony internetowej lub wyłączenia oprogramowania (przeglądarki
                  internetowej). „Stałe" pliki cookies przechowywane są w urządzeniu
                  końcowym Użytkownika przez czas określony w parametrach plików
                  cookies lub do czasu ich usunięcia przez Użytkownika.
                </li>
                <li>
                  Oprogramowanie do przeglądania stron internetowych (przeglądarka
                  internetowa) zazwyczaj domyślnie dopuszcza przechowywanie plików
                  cookies w urządzeniu końcowym Użytkownika. Użytkownicy Serwisu mogą
                  dokonać zmiany ustawień w tym zakresie. Przeglądarka internetowa
                  umożliwia usunięcie plików cookies. Możliwe jest także automatyczne
                  blokowanie plików cookies Szczegółowe informacje na ten temat
                  zawiera pomoc lub dokumentacja przeglądarki internetowej.
                </li>
                <li>
                  Ograniczenia stosowania plików cookies mogą wpłynąć na niektóre
                  funkcjonalności dostępne na stronach internetowych Serwisu.
                </li>
                <li>
                  Pliki cookies zamieszczane w urządzeniu końcowym Użytkownika Serwisu
                  i wykorzystywane mogą być również przez współpracujących z operatorem
                  Serwisu reklamodawców oraz partnerów.
                </li>
                <li>
                  Zalecamy przeczytanie polityki ochrony prywatności tych firm, aby
                  poznać zasady korzystania z plików cookies wykorzystywane w
                  statystykach: Polityka ochrony prywatności Google Analytics.
                </li>
                <li>
                  Pliki cookies mogą być wykorzystane przez sieci reklamowe, w
                  szczególności sieć Google, do wyświetlenia reklam dopasowanych do
                  sposobu, w jaki użytkownik korzysta z Serwisu. W tym celu mogą
                  zachować informację o ścieżce nawigacji użytkownika lub czasie
                  pozostawania na danej stronie.
                </li>
                <li>
                  W zakresie informacji o preferencjach użytkownika gromadzonych przez
                  sieć reklamową Google użytkownik może przeglądać i edytować informacje
                  wynikające z plików cookies przy pomocy narzędzia:
                  https://www.google.com/ads/preferences/
                </li>
              </ol>

              <h3>IV. Zarządzanie plikami cookies – jak w praktyce wyrażać i cofać zgodę?</h3>
              <ol>
                <li>
                  Jeśli użytkownik nie chce otrzymywać plików cookies, może zmienić
                  ustawienia przeglądarki. Zastrzegamy, że wyłączenie obsługi plików
                  cookies niezbędnych dla procesów uwierzytelniania, bezpieczeństwa,
                  utrzymania preferencji użytkownika może utrudnić, a w skrajnych
                  przypadkach może uniemożliwić korzystanie ze stron www.
                </li>
                <li>
                  W celu zarządzania ustawieniami cookies wybierz z listy poniżej
                  przeglądarkę internetową/ system i postępuj zgodnie z instrukcjami
                  <ul>
                    <li>Internet Explorer</li>
                    <li>Chrome</li>
                    <li>Safari</li>
                    <li>Firefox</li>
                    <li>Opera</li>
                    <li>Android</li>
                    <li>Safari (iOS)</li>
                    <li>Windows Phone</li>
                    <li>Blackberry</li>
                  </ul>
                </li>
              </ol>

              <h3>V. Udostępnienie danych.</h3>
              <ol>
                <li>
                  Dane podlegają udostępnieniu podmiotom zewnętrznym wyłącznie w
                  granicach prawnie dozwolonych.
                </li>
                <li>
                  Operator może mieć obowiązek udzielania informacji zebranych przez
                  Serwis upoważnionym organom na podstawie zgodnych z prawem żądań w
                  zakresie wynikającym z żądania.
                </li>
              </ol>

              <h3>VI. Postanowienia końcowe</h3>
              <ol>
                <li>
                  Administrator ma prawo do zmian w niniejszej Polityce Prywatności.
                  Osoby udostępniające swoje dane osobowe obowiązuje aktualnie
                  obowiązująca wersja Polityki Prywatności, dostępna na stronie
                  www.animalhelper.pl/polityka-prywatnosci/
                </li>
                <li>
                  W sprawach nieuregulowanych niniejszą Polityką Prywatności stosuje
                  się obowiązujące przepisy prawa polskiego.
                </li>
              </ol>
            </div>
          )}

          <button
            className="cookie-banner__toggle"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Zwiń politykę prywatności ▲" : "Pełna polityka prywatności ▼"}
          </button>
        </div>

        <div className="cookie-banner__actions">
          <button
            className="cookie-banner__btn cookie-banner__btn--outline"
            onClick={() => setExpanded((v) => !v)}
          >
            Dostosuj
          </button>
          <button
            className="cookie-banner__btn cookie-banner__btn--outline"
            onClick={() => consent("rejected")}
          >
            Odrzuć wszystkie
          </button>
          <button
            className="cookie-banner__btn cookie-banner__btn--solid"
            onClick={() => consent("accepted")}
          >
            Akceptuj wszystko
          </button>
        </div>
      </div>
    </div>
  );
}
