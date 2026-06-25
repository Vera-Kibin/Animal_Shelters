import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./CommentModal.css";
import "./AddAzylModal.css";

const PLACE_TYPES = [
  "schronisko",
  "azyl",
  "fundacja",
  "dom tymczasowy",
  "inne",
];

export default function AddAzylModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [adres, setAdres] = useState("");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [placeContact, setPlaceContact] = useState("");
  const [canContactMe, setCanContactMe] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const canSend = name.trim() && adres.trim();

  function handleSend() {
    if (!canSend) return;
    if (onSubmit)
      onSubmit({ name, placeType, adres, placeContact, canContactMe, text });
    setSent(true);
  }

  return createPortal(
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__x" onClick={onClose} aria-label="Zamknij">
          ×
        </button>

        {sent ? (
          <div className="modal__thanks">
            <h3>Dziękujemy!</h3>
            <p>
              Zgłoszenie trafi do moderacji. Po sprawdzeniu dodamy placówkę do
              bazy. Dzięki, że pomagasz ją tworzyć.
            </p>
            <button className="modal__send" onClick={onClose}>
              Zamknij
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Zgłoś placówkę</span>
            <h3 className="modal__title">Dodaj placówkę do bazy</h3>
            <p className="modal__intro">
              Baza opiera się na oficjalnym rejestrze, ale możesz pomóc ją
              rozbudować o azyle i placówki prowadzone przez osoby lub
              organizacje. Wpisz to, co wiesz. Zgłoszenie trafi do moderacji
              przed publikacją.
            </p>

            <div className="azyl__form">
              <label className="azyl__field">
                <span>
                  Nazwa placówki <i>*</i>
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="np. Azyl pod Lasem"
                />
              </label>

              <label className="azyl__field">
                <span>
                  Adres placówki <i>*</i>
                </span>
                <input
                  value={adres}
                  onChange={(e) => setAdres(e.target.value)}
                  placeholder="ulica, miejscowość"
                />
                <p className="azyl__hint">
                  Adres miejsca, które zgłaszasz, a nie Twój.
                </p>
              </label>
              <div className="azyl__field">
                <span>Typ placówki</span>
                <div className="azyl__chips">
                  {PLACE_TYPES.map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={
                        "azyl__chip" + (placeType === t ? " is-on" : "")
                      }
                      onClick={() => setPlaceType(placeType === t ? "" : t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <label className="azyl__field">
                <span>Kontakt do placówki</span>
                <input
                  value={placeContact}
                  onChange={(e) => setPlaceContact(e.target.value)}
                  placeholder="telefon, strona lub link (np. Google Maps, Facebook)"
                />
                <p className="azyl__hint">
                  Nieobowiązkowe. Jeśli znasz kontakt lub link do tego miejsca,
                  pomoże nam szybciej zweryfikować zgłoszenie.
                </p>
              </label>

              <label className="azyl__field">
                <span>
                  Krótki opis
                  <button
                    type="button"
                    className="azyl__tips-btn"
                    onClick={() => setShowTips((v) => !v)}
                  >
                    co warto napisać?
                  </button>
                </span>

                {showTips && (
                  <ul className="azyl__tips">
                    <li>czym placówka się zajmuje,</li>
                    <li>jakie zwierzęta tam są (psy, koty, inne),</li>
                    <li>jak można pomóc (adopcja, wolontariat, karma),</li>
                    <li>cokolwiek, co pomoże nam zweryfikować miejsce.</li>
                  </ul>
                )}
                <textarea
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Czym się zajmuje, jakie zwierzęta, jak można pomóc…"
                />
              </label>
            </div>

            <p className="azyl__warn">
              Prosimy zgłaszać tylko realne, działające placówki i pisać z
              szacunkiem. Zgłoszenia ze spamem lub nieprawdziwymi danymi będą
              odrzucane, a takie konta mogą stracić możliwość dodawania treści.
            </p>
            <label className="azyl__check">
              <input
                type="checkbox"
                checked={canContactMe}
                onChange={(e) => setCanContactMe(e.target.checked)}
              />
              <span>
                Możesz się ze mną skontaktować, jeśli pojawią się pytania do
                tego zgłoszenia.
              </span>
            </label>
            <button
              className="modal__send"
              onClick={handleSend}
              disabled={!canSend}
            >
              Wyślij zgłoszenie
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
