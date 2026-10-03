import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./CommentModal.css";
import {
  PYTANIA_OGOLNE,
  KATEGORIE_OCENY,
  PYTANIA_SZCZEGOLOWE,
  PYTANIA_WSTEPNE,
  INFO_ANKIETY,
  INFO_WSTEPNE,
  KLAUZULA_ZDJECIA,
} from "../../data/surveyData";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "../Auth/LoginForm";

const OPCJE = ["tak", "nie", "nie wiem"];
const KOLORY = [
  "#c0392b",
  "#e67e22",
  "#f1c40f",
  "#cddc39",
  "#7cb342",
  "#3f7d57",
];

// odpowiedzi wstępne pamiętamy w localStorage, żeby pytać tylko raz
// na daną placówkę (przetrwują odświeżenie strony)
const INTRO_KEY = "survey_intro_v1";

function wczytajIntro(shelterId) {
  try {
    const all = JSON.parse(localStorage.getItem(INTRO_KEY) || "{}");
    return all[shelterId] || null;
  } catch {
    return null;
  }
}

function zapiszIntro(shelterId, answers) {
  try {
    const all = JSON.parse(localStorage.getItem(INTRO_KEY) || "{}");
    all[shelterId] = { done: true, answers };
    localStorage.setItem(INTRO_KEY, JSON.stringify(all));
  } catch {
    /* brak miejsca */
  }
}

// pojedyncze lub wielokrotne pytanie wyboru (pytania wstępne) —
// jedno pytanie na ekran; single = pilulki w kolumnie, multi = okragle "babelki"
function PytanieWybor({ pytanie, opcje, multi, value, onChange }) {
  const jestOn = (o) => (multi ? (value || []).includes(o) : value === o);
  const wybierz = (o) => {
    if (!multi) {
      onChange(value === o ? undefined : o);
      return;
    }
    const cur = value || [];
    onChange(cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o]);
  };
  return (
    <div className="pyt">
      <h4 className="pyt__q">{pytanie}</h4>
      <div
        className={
          "pyt__opts " + (multi ? "pyt__opts--bubbles" : "pyt__opts--stack")
        }
      >
        {opcje.map((o, i) => (
          <button
            type="button"
            key={o}
            className={"pyt__btn" + (jestOn(o) ? " is-on" : "")}
            aria-pressed={jestOn(o)}
            onClick={() => wybierz(o)}
          >
            <span className="pyt__badge" aria-hidden="true">
              {jestOn(o) ? "✓" : String.fromCharCode(65 + i)}
            </span>
            <span className="pyt__label">{o}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

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

function SkalaOceny({ value, onChange }) {
  return (
    <div className="skala">
      <button
        type="button"
        className={"skala__seg skala__seg--nw" + (!value ? " is-on" : "")}
        onClick={() => onChange(0)}
        aria-label="nie wiem"
      >
        nie wiem
      </button>
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

// skąd pochodzi wiedza oceniającego -> pole visited w opinii
const ZRODO_NA_VISITED = {
  "Własne doświadczenia": "yes",
  "Jedno i drugie": "indirect",
  "Informacje od innych osób": "no",
};

// tytuły kolejnych ekranów pytań wstępnych (jeden pytań na ekran)
const TYTULY_WSTEPNE = [
  "Zaczynajmy…",
  "Kolejne pytanie…",
  "Jeszcze chwila…",
  "Ostatnie pytanie…",
];

export default function CommentModal({ shelter, onClose, onSubmit }) {
  const { isLoggedIn } = useAuth();
  const [krok, setKrok] = useState(1);
  const [wstepne, setWstepne] = useState(
    () => wczytajIntro(shelter.id)?.answers || {},
  );
  const [introZrobione, setIntroZrobione] = useState(
    () => !!wczytajIntro(shelter.id)?.done,
  );
  const [introKrok, setIntroKrok] = useState(0);
  const [ogolne, setOgolne] = useState({});
  const [oceny, setOceny] = useState({});
  const [szczegolowe, setSzczegolowe] = useState({});
  const [text, setText] = useState("");
  const [openHint, setOpenHint] = useState(null);
  const [sent, setSent] = useState(false);
  const [pokazOstrzezenie, setPokazOstrzezenie] = useState(false);
  const [zaakceptowanoOstrzezenie, setZaakceptowanoOstrzezenie] =
    useState(false);

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
  const setWstepnaOdp = (id, val) =>
    setWstepne((o) => ({ ...o, [id]: val }));

  const pytWstepne = PYTANIA_WSTEPNE[introKrok];
  const wybraneWstepne = pytWstepne.multi
    ? wstepne[pytWstepne.id] || []
    : [];

  function handleSend() {
    if (onSubmit) {
      onSubmit({
        author: "Ty",
        verified: true,
        type: "ankieta",
        wstepne,
        visited: ZRODO_NA_VISITED[wstepne.zrodlo] || "indirect",
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
        ) : !isLoggedIn ? (
          <LoginForm />
        ) : !introZrobione ? (
          <div className="intro">
            <span className="eyebrow">Ankieta o schronisku</span>
            <h3 className="modal__title">{shelter.name}</h3>

            <div
              className="intro__bar"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={PYTANIA_WSTEPNE.length}
              aria-valuenow={introKrok + 1}
              aria-label="Postęp pytań wstępnych"
            >
              <span
                style={{
                  width: `${((introKrok + 1) / PYTANIA_WSTEPNE.length) * 100}%`,
                }}
              />
            </div>

            <div className="intro__body" key={introKrok}>
              <p className="intro__step">{TYTULY_WSTEPNE[introKrok]}</p>
              {introKrok === 0 && (
                <p className="modal__intro intro__note">{INFO_WSTEPNE}</p>
              )}

              <PytanieWybor
                pytanie={pytWstepne.pytanie}
                opcje={pytWstepne.opcje}
                multi={pytWstepne.multi}
                value={wstepne[pytWstepne.id]}
                onChange={(v) => setWstepnaOdp(pytWstepne.id, v)}
              />

              {pytWstepne.multi && wybraneWstepne.length > 0 && (
                <div className="intro__chips">
                  {wybraneWstepne.map((o) => (
                    <button
                      type="button"
                      key={o}
                      className="intro__chip"
                      aria-label={`Usuń odpowiedź ${o}`}
                      onClick={() =>
                        setWstepnaOdp(
                          pytWstepne.id,
                          wybraneWstepne.filter((x) => x !== o),
                        )
                      }
                    >
                      {o} <span aria-hidden="true">×</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="intro__foot">
              {introKrok > 0 && (
                <button
                  type="button"
                  className="intro__round intro__round--ghost"
                  onClick={() => setIntroKrok(introKrok - 1)}
                  aria-label="Poprzednie pytanie"
                >
                  ←
                </button>
              )}
              {introKrok < PYTANIA_WSTEPNE.length - 1 ? (
                <>
                  <span className="intro__count">
                    Pytanie {introKrok + 1} z {PYTANIA_WSTEPNE.length}
                  </span>
                  <button
                    type="button"
                    className="intro__round"
                    onClick={() => setIntroKrok(introKrok + 1)}
                    aria-label="Następne pytanie"
                  >
                    →
                  </button>
                </>
              ) : (
                <button
                  className="modal__send intro__cta"
                  autoFocus={introKrok === PYTANIA_WSTEPNE.length - 1}
                  onClick={() => {
                    zapiszIntro(shelter.id, wstepne);
                    setIntroZrobione(true);
                  }}
                >
                  Przejdź do pytań →
                </button>
              )}
            </div>
          </div>
        ) : pokazOstrzezenie ? (
          <div className="modal__thanks">
            <span className="eyebrow">Ankieta o schronisku</span>
            <h3 className="modal__title">Bardziej szczegółowe pytania</h3>
            <p className="modal__intro">
              Kolejny segment zawiera bardziej szczegółowe i fachowe pytania o
              placówkę (m.in. o izolatki, kwarantannę, dokumentację). Jeśli nie
              masz takiej wiedzy możesz spokojnie wysłać ankietę teraz, a te
              pytania zostaną potraktowane jako neutralne.
            </p>
            <div className="krok__nav">
              <button
                className="krok__back"
                onClick={() => {
                  setPokazOstrzezenie(false);
                  handleSend();
                }}
              >
                Wyślij teraz
              </button>
              <button
                className="modal__send"
                onClick={() => {
                  setPokazOstrzezenie(false);
                  setZaakceptowanoOstrzezenie(true);
                  setKrok(3);
                }}
              >
                Przejdź dalej →
              </button>
            </div>
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
              <button
                className="krok__back"
                onClick={() => {
                  if (krok === 1) {
                    // wracamy na ostatni ekran pytań wstępnych,
                    // żeby jednym kliknięciem wrócić do ankiety
                    setIntroZrobione(false);
                    setIntroKrok(PYTANIA_WSTEPNE.length - 1);
                  } else {
                    setKrok(krok - 1);
                  }
                }}
              >
                ← Wstecz
              </button>
              {krok < 3 ? (
                <button
                  className="modal__send"
                  onClick={() => {
                    if (krok === 2 && !zaakceptowanoOstrzezenie) {
                      setPokazOstrzezenie(true);
                    } else {
                      setKrok(krok + 1);
                    }
                  }}
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
