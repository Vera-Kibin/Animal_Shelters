import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./CommentModal.css";
import {
  PYTANIA_OGOLNE,
  KATEGORIE_OCENY,
  PYTANIA_SZCZEGOLOWE,
  LEGENDA_OCEN,
  INFO_ANKIETY,
  KLAUZULA_ZDJECIA,
} from "../../data/surveyData";

const OPCJE = ["tak", "nie", "nie wiem"];
const KOLORY = [
  "#c0392b",
  "#e67e22",
  "#f1c40f",
  "#cddc39",
  "#7cb342",
  "#3f7d57",
];

// pojedyncze pytanie tak/nie/nie wiem
function PytanieTak({ pytanie, value, onChange }) {
  return (
    <div className="pyt">
      <p className="pyt__q">{pytanie}</p>
      <div className="pyt__opts">
        {OPCJE.map((o) => (
          <button
            type="button"
            key={o}
            className={
              "pyt__btn" + ((value || "nie wiem") === o ? " is-on" : "")
            }
            onClick={() => onChange(o)}
          >
            {o.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

// skala oceny 1–6 — pasek "gąsienica": 6 części, blade kolory, wybrana wyraźna
function SkalaOceny({ value, onChange }) {
  return (
    <div className="skala">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <button
          type="button"
          key={n}
          className={"skala__seg" + (value === n ? " is-on" : "")}
          style={{ background: KOLORY[n - 1] }}
          onClick={() => onChange(n)}
          aria-label={n + " z 6"}
        >
          {value === n ? n : ""}
        </button>
      ))}
    </div>
  );
}

export default function CommentModal({ shelter, onClose, onSubmit }) {
  const [krok, setKrok] = useState(1);
  const [ogolne, setOgolne] = useState({});
  const [oceny, setOceny] = useState({});
  const [szczegolowe, setSzczegolowe] = useState({});
  const [text, setText] = useState("");
  const [openHint, setOpenHint] = useState(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // jeden setter, klucz = numer pytania
  const setOgolneOdp = (i, val) => setOgolne((o) => ({ ...o, [i]: val }));
  const setOcena = (i, val) => setOceny((o) => ({ ...o, [i]: val }));
  const setSzczeg = (i, val) => setSzczegolowe((o) => ({ ...o, [i]: val }));

  function handleSend() {
    if (onSubmit) {
      onSubmit({
        author: "Ty",
        verified: true,
        type: "ankieta",
        ogolne,
        oceny,
        szczegolowe,
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
              Twoja opinia pomaga budować obraz dobrostanu zwierząt w tej
              placówce. Zostawiając ją, realnie pomagasz, nawet bez żadnej
              wpłaty.
            </p>
            <button className="modal__send" onClick={onClose}>
              Zamknij
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Ankieta o schronisku</span>
            <h3 className="modal__title">{shelter.name}</h3>
            <p className="modal__intro">{INFO_ANKIETY}</p>

            <div className="kroki">
              {["1. Ogólne", "2. Oceny", "3. Szczegóły"].map((etk, idx) => (
                <button
                  type="button"
                  key={etk}
                  className={"kroki__k" + (krok === idx + 1 ? " is-on" : "")}
                  onClick={() => setKrok(idx + 1)}
                >
                  {etk}
                </button>
              ))}
            </div>

            {krok === 1 && (
              <div className="krok">
                {PYTANIA_OGOLNE.map((p, i) => (
                  <PytanieTak
                    key={i}
                    pytanie={p}
                    value={ogolne[i]}
                    onChange={(v) => setOgolneOdp(i, v)}
                  />
                ))}
              </div>
            )}

            {krok === 2 && (
              <div className="krok">
                <div className="legenda">
                  <span>
                    <b>1</b> dramat
                  </span>
                  <span>
                    <b>3</b> dostatecznie
                  </span>
                  <span>
                    <b>6</b> doskonale
                  </span>
                </div>
                {KATEGORIE_OCENY.map((k, i) => (
                  <div className="ocena" key={i}>
                    <span className="ocena__label">
                      {k.label}
                      <button
                        type="button"
                        className="ocena__info"
                        onClick={() => setOpenHint(openHint === i ? null : i)}
                        aria-label="Przykład"
                      >
                        ?
                      </button>
                    </span>
                    <SkalaOceny
                      value={oceny[i] || 0}
                      onChange={(v) => setOcena(i, v)}
                    />

                    {openHint === i && (
                      <div className="ocena__examples">
                        <div className="ex ex--good">
                          <div className="ex__ph" aria-hidden>
                            przykładowe zdjęcie
                          </div>
                          <span className="ex__tag">
                            na co zwracać uwagę (okej)
                          </span>
                          <p>{k.good}</p>
                        </div>
                        <div className="ex ex--bad">
                          <div className="ex__ph" aria-hidden>
                            przykładowe zdjęcie
                          </div>
                          <span className="ex__tag">
                            sygnały ostrzegawcze (nie okej)
                          </span>
                          <p>{k.bad}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <p className="ocena__photonote">
                  Zdjęcia w przykładach są poglądowe (do uzupełnienia).
                </p>
              </div>
            )}

            {krok === 3 && (
              <div className="krok">
                {PYTANIA_SZCZEGOLOWE.map((p, i) => (
                  <PytanieTak
                    key={i}
                    pytanie={p}
                    value={szczegolowe[i]}
                    onChange={(v) => setSzczeg(i, v)}
                  />
                ))}

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
                <div className="upload__warn">
                  Zdjęcia zazwyczaj można publikować, o ile:
                  <ul>
                    {KLAUZULA_ZDJECIA.map((z, i) => (
                      <li key={i}>{z}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="krok__nav">
              {krok > 1 && (
                <button
                  className="krok__back"
                  onClick={() => setKrok(krok - 1)}
                >
                  ← Wstecz
                </button>
              )}
              {krok < 3 ? (
                <button
                  className="modal__send"
                  onClick={() => setKrok(krok + 1)}
                >
                  Dalej →
                </button>
              ) : (
                <button className="modal__send" onClick={handleSend}>
                  Wyślij ankietę
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
