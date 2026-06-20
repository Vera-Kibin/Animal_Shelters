import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./CommentModal.css";

const CRITERIA = [
  {
    id: "clean_rooms",
    label: "Czystość pomieszczeń",
    good: "Posprzątane, brak odoru, suche posłania.",
    bad: "Brud, mocny zapach, zaniedbane kąty.",
  },
  {
    id: "clean_cages",
    label: "Czystość klatek / kojców",
    good: "Czyste boksy, świeża woda i miski.",
    bad: "Zabrudzenia, puste miski.",
  },
  {
    id: "animal_state",
    label: "Stan i kondycja zwierząt",
    good: "Zwierzęta czyste, spokojne, zadbane.",
    bad: "Widoczne zaniedbanie, lęk, problemy zdrowotne.",
  },
  {
    id: "space",
    label: "Warunki i przestrzeń",
    good: "Dość miejsca, wybiegi, ogrzewanie.",
    bad: "Ciasnota, brak wybiegu.",
  },
  {
    id: "staff",
    label: "Podejście i liczba opiekunów",
    good: "Zaangażowani, znają zwierzęta.",
    bad: "Za mało rąk, obojętność.",
  },
  {
    id: "openness",
    label: "Otwartość schroniska",
    good: "Wpuszczają, pokazują, odpowiadają.",
    bad: "Unikają kontaktu, nie wpuszczają.",
  },
];

function Stars({ value, onChange, disabled }) {
  return (
    <div className={"stars" + (disabled ? " is-disabled" : "")}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          className={"stars__s" + (n <= value ? " is-on" : "")}
          onClick={() => onChange(n)}
          aria-label={n + " z 5"}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function CommentModal({ shelter, onClose, onSubmit }) {
  const [visited, setVisited] = useState(null);
  const [mode, setMode] = useState("quick");
  const [sentiment, setSentiment] = useState(null);
  const [ratings, setRatings] = useState({});
  const [skipped, setSkipped] = useState({});
  const [openHint, setOpenHint] = useState(null);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const setRate = (id, n) => {
    setRatings((r) => ({ ...r, [id]: n }));
    setSkipped((s) => ({ ...s, [id]: false }));
  };
  const toggleSkip = (id) => setSkipped((s) => ({ ...s, [id]: !s[id] }));

  function handleSend() {
    if (onSubmit) {
      onSubmit({
        author: "Ty",
        verified: true,
        type: mode,
        visited: visited || "indirect",
        sentiment: mode === "quick" ? sentiment : undefined,
        ratings: mode === "detailed" ? ratings : undefined,
        text: text.trim(),
        likes: 0,
        replies: [],
      });
      return;
    }
    setSent(true);
  }

  return createPortal(
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal modal--review" onClick={(e) => e.stopPropagation()}>
        <button className="modal__x" onClick={onClose} aria-label="Zamknij">
          ×
        </button>

        {sent ? (
          <div className="modal__thanks">
            <h3>Dziękujemy!</h3>
            <p>
              Twoja opinia pomaga budować zaufanie do schronisk. Zostawiając ją,
              realnie pomagasz, nawet bez żadnej wpłaty. Jeśli możesz, dodaj
              dłuższy opis i zdjęcia. Krótka opinia też się liczy, choć mniej.
            </p>
            <button className="modal__send" onClick={onClose}>
              Zamknij
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Opinia o schronisku</span>
            <h3 className="modal__title">{shelter.name}</h3>
            <p className="modal__intro">
              Zostawienie opinii jest ważne, bo to z nich budujemy wskaźnik
              zaufania. Możesz pomóc po prostu dzieląc się tym, co wiesz.
            </p>

            <div className="visited">
              <span className="visited__q">
                Czy miałaś/eś bezpośredni kontakt z tym schroniskiem?
              </span>
              <div className="visited__opts">
                <button
                  className={"chip2" + (visited === "yes" ? " is-on" : "")}
                  onClick={() => setVisited("yes")}
                >
                  Tak, byłam/em na miejscu
                </button>
                <button
                  className={"chip2" + (visited === "indirect" ? " is-on" : "")}
                  onClick={() => setVisited("indirect")}
                >
                  Pośrednio
                </button>
                <button
                  className={"chip2" + (visited === "no" ? " is-on" : "")}
                  onClick={() => setVisited("no")}
                >
                  Tylko ze słyszenia
                </button>
              </div>
              {visited === "no" && (
                <p className="visited__note">
                  Opinie „ze słyszenia" oznaczamy osobno i liczą się najmniej.
                </p>
              )}
            </div>

            <div className="modal__modes">
              <button
                className={
                  "modal__mode" + (mode === "quick" ? " is-active" : "")
                }
                onClick={() => setMode("quick")}
              >
                <strong>Szybka opinia</strong>
                <small>kilka słów, liczy się mniej</small>
              </button>
              <button
                className={
                  "modal__mode" + (mode === "detailed" ? " is-active" : "")
                }
                onClick={() => setMode("detailed")}
              >
                <strong>Szczegółowa opinia</strong>
                <small>ze zdjęciami, liczy się bardziej</small>
              </button>
            </div>

            {mode === "quick" ? (
              <>
                <div className="sentiment">
                  <button
                    className={
                      "sentiment__btn pos" +
                      (sentiment === "pos" ? " is-on" : "")
                    }
                    onClick={() => setSentiment("pos")}
                  >
                    👍 Pozytywna
                  </button>
                  <button
                    className={
                      "sentiment__btn neg" +
                      (sentiment === "neg" ? " is-on" : "")
                    }
                    onClick={() => setSentiment("neg")}
                  >
                    👎 Negatywna
                  </button>
                </div>
                <textarea
                  rows={2}
                  placeholder="Kilka słów o Twoim wrażeniu…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="dims">
                  {CRITERIA.map((d) => (
                    <div
                      key={d.id}
                      className={
                        "dims__row" + (skipped[d.id] ? " is-skipped" : "")
                      }
                    >
                      <div className="dims__head">
                        <span className="dims__label">
                          {d.label}
                          <button
                            type="button"
                            className="dims__info"
                            onClick={() =>
                              setOpenHint(openHint === d.id ? null : d.id)
                            }
                            aria-label="Przykład"
                          >
                            ?
                          </button>
                        </span>
                        <div className="dims__controls">
                          <Stars
                            value={ratings[d.id] || 0}
                            onChange={(n) => setRate(d.id, n)}
                            disabled={skipped[d.id]}
                          />
                          <button
                            type="button"
                            className={
                              "dims__skip" + (skipped[d.id] ? " is-on" : "")
                            }
                            onClick={() => toggleSkip(d.id)}
                          >
                            nie umiem ocenić
                          </button>
                        </div>
                      </div>
                      {openHint === d.id && (
                        <div className="dims__examples">
                          <div className="ex ex--good">
                            <div className="ex__ph" aria-hidden>
                              zdjęcie
                            </div>
                            <span className="ex__tag">
                              na co zwracać uwagę (okej)
                            </span>
                            <p>{d.good}</p>
                          </div>
                          <div className="ex ex--bad">
                            <div className="ex__ph" aria-hidden>
                              zdjęcie
                            </div>
                            <span className="ex__tag">
                              sygnały ostrzegawcze (nie okej)
                            </span>
                            <p>{d.bad}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <textarea
                  rows={4}
                  placeholder="Opisz swoimi słowami, co zauważyłaś/eś na miejscu…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />

                <label className="upload">
                  <input type="file" multiple accept="image/*" />
                  Dodaj zdjęcia ze schroniska (opcjonalnie, ale bardzo pomagają)
                </label>
                <p className="upload__warn">
                  Uwaga: zdjęcia ze schroniska dołączaj tylko za zgodą placówki.
                  Jeśli schronisko zgłosi sprzeciw, opinia ze zdjęciami może
                  zostać usunięta.
                </p>
                <p className="modal__hint">
                  Szczegółowe opinie ze zdjęciami liczą się najbardziej.
                </p>
              </>
            )}

            <button className="modal__send" onClick={handleSend}>
              Wyślij opinię
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
