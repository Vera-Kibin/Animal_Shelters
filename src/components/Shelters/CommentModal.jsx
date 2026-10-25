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

const OPCJE = ["tak", "nie wiem", "nie"];
const KOLORY = [
  "#c0392b",
  "#e67e22",
  "#f1c40f",
  "#cddc39",
  "#7cb342",
  "#3f7d57",
];

function completeAnswers(questions, answers, defaultValue) {
  return Object.fromEntries(
    questions.map((_, i) => [i, answers[i] ?? defaultValue]),
  );
}

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
      {multi && <p className="pyt__hint">Możesz wybrać kilka odpowiedzi</p>}
      <div className="pyt__opts pyt__opts--stack">
        {opcje.map((o) => (
          <button
            type="button"
            key={o}
            className={"pyt__btn" + (jestOn(o) ? " is-on" : "")}
            aria-pressed={jestOn(o)}
            onClick={() => wybierz(o)}
          >
            <span className="pyt__dot" aria-hidden="true">
              {jestOn(o) ? "✓" : ""}
            </span>
            <span className="pyt__label">{o}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// pojedyncze pytanie tak/nie/nie wiem
function PytanieTak({ pytanie, value = "nie wiem", onChange, active, onActivate }) {
  return (
    <div className={"pyt survey-question" + (active ? " is-current" : "")} role="group" aria-label={pytanie} onFocusCapture={onActivate} onPointerDown={onActivate}>
      <p className="pyt__q">{pytanie}</p>
      <div className="pyt__opts">
        {OPCJE.map((o) => (
          <button
            type="button"
            key={o}
            className={
              "pyt__btn pyt__btn--" + (o === "tak" ? "yes" : o === "nie" ? "no" : "unknown") + (value === o ? " is-on" : "")
            }
            aria-pressed={value === o}
            onClick={() => onChange(value === o ? undefined : o)}
          >
            <span aria-hidden="true">{o === "tak" ? "✓" : o === "nie" ? "×" : "?"}</span> {o === "tak" ? "Tak" : o === "nie" ? "Nie" : "Nie wiem"}
          </button>
        ))}
      </div>
    </div>
  );
}

function SkalaOceny({ value = 0, onChange }) {
  return (
    <div className="skala">
      <button
        type="button"
        className={"skala__seg skala__seg--nw" + (value === 0 ? " is-on" : "")}
        onClick={() => onChange(value === 0 ? undefined : 0)}
        aria-pressed={value === 0}
        aria-label="nie wiem"
      >
        nie wiem
      </button>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <button
          type="button"
          key={n}
          className={"skala__seg" + (value === n ? " is-on" : "")}
          style={{ "--rating-color": KOLORY[n - 1] }}
          onClick={() => onChange(value === n ? undefined : n)}
          aria-pressed={value === n}
          aria-label={n + " z 6"}
        >
          {n}
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
  const [activeQuestion, setActiveQuestion] = useState("1-0");
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
  // Postęp uwzględnia jawne odpowiedzi, a nie domyślne „nie wiem”.
  const pageAnswers = [ogolne, oceny, szczegolowe][krok - 1];
  const pageQuestionCount = [
    PYTANIA_OGOLNE.length,
    KATEGORIE_OCENY.length,
    PYTANIA_SZCZEGOLOWE.length,
  ][krok - 1];
  const pageCompletion = Object.keys(pageAnswers).length / pageQuestionCount;
  const progressPercent = Math.min(100, ((krok - 1 + pageCompletion) / 2) * 100);

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

  useEffect(() => {
    const body = document.querySelector(".modal--review .krok");
    if (body) body.scrollTop = 0;
  }, [krok]);

  // jeden setter, klucz = numer pytania
  const updateAnswer = (setter, i, val) => setter((answers) => {
    const next = { ...answers };
    if (val === undefined) delete next[i];
    else next[i] = val;
    return next;
  });
  const setOgolneOdp = (i, val) => updateAnswer(setOgolne, i, val);
  const setOcena = (i, val) => updateAnswer(setOceny, i, val);
  const setSzczeg = (i, val) => updateAnswer(setSzczegolowe, i, val);
  const setWstepnaOdp = (id, val) =>
    setWstepne((o) => ({ ...o, [id]: val }));

  const pytWstepne = PYTANIA_WSTEPNE[introKrok];
  const odpWstepna = wstepne[pytWstepne.id];
  // przy „Inna" doprecyzowanie roli też jest wymagane
  const rolaBezTekstu =
    pytWstepne.id === "rola" &&
    Array.isArray(odpWstepna) &&
    odpWstepna.includes("Inna") &&
    !(wstepne.rolaInna || "").trim();
  const brakOdp =
    odpWstepna == null ||
    (Array.isArray(odpWstepna) && odpWstepna.length === 0) ||
    rolaBezTekstu;

  function goToStep(nextStep) {
    if (nextStep === 3 && !zaakceptowanoOstrzezenie) {
      setPokazOstrzezenie(true);
      return;
    }
    setKrok(nextStep);
    setActiveQuestion(`${nextStep}-0`);
  }

  function handleSend() {
    if (onSubmit) {
      onSubmit({
        author: "Ty",
        verified: true,
        type: "ankieta",
        wstepne,
        visited: ZRODO_NA_VISITED[wstepne.zrodlo] || "indirect",
        ogolne: completeAnswers(PYTANIA_OGOLNE, ogolne, "nie wiem"),
        oceny: completeAnswers(KATEGORIE_OCENY, oceny, 0),
        szczegolowe: completeAnswers(PYTANIA_SZCZEGOLOWE, szczegolowe, "nie wiem"),
        text: text.trim(),
        likes: 0,
        replies: [],
      });
      return;
    }
    setSent(true);
  }

  return createPortal(
    <div className="modal__backdrop modal__backdrop--review" onClick={onClose}>
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
              {pytWstepne.id === "rola" &&
                (wstepne.rola || []).includes("Inna") && (
                  <input
                    className="pyt__inna"
                    type="text"
                    value={wstepne.rolaInna || ""}
                    onChange={(e) => setWstepnaOdp("rolaInna", e.target.value)}
                    placeholder="np. opiekun tymczasowy, transport…"
                    aria-label="Opisz swoją rolę"
                  />
                )}
              <p className={"intro__req" + (brakOdp ? " is-on" : "")}>
                {brakOdp ? "Wybierz odpowiedź, aby przejść dalej" : ""}
              </p>
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
                    disabled={brakOdp}
                    onClick={() => setIntroKrok(introKrok + 1)}
                    aria-label="Następne pytanie"
                  >
                    →
                  </button>
                </>
              ) : (
                <button
                  className="modal__send intro__cta"
                  disabled={brakOdp}
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
                  setActiveQuestion("3-0");
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

            <div className="survey-progress">
              <nav className="survey-steps" aria-label="Etapy ankiety">
                <div className="survey-steps__track" role="progressbar" aria-label="Postęp ankiety" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progressPercent)} aria-valuetext={`${["Ogólnie", "Oceny", "Szczegóły"][krok - 1]}: ${Object.keys(pageAnswers).length} z ${pageQuestionCount} odpowiedzi`}>
                  <span style={{ width: `${progressPercent}%` }} />
                </div>
                {["Ogólnie", "Oceny", "Szczegóły"].map((label, i) => {
                  const complete = i + 1 < krok;
                  return <button type="button" key={label} className={"survey-steps__step" + (krok === i + 1 ? " is-active" : "") + (complete ? " is-complete" : "")} aria-current={krok === i + 1 ? "step" : undefined} onClick={() => goToStep(i + 1)}>
                    <span className="survey-steps__icon" aria-hidden="true">{complete ? "✓" : ["✓", "☆", "☷"][i]}</span>
                    <span>{i + 1}. {label}</span>
                  </button>;
                })}
              </nav>
            </div>

            <p className="modal__intro">{INFO_ANKIETY}</p>

            {krok === 1 && (
              <div className="krok" key="ogolne">
                {PYTANIA_OGOLNE.map((p, i) => (
                  <PytanieTak
                    key={i}
                    pytanie={`${i + 1}. ${p}`}
                    active={activeQuestion === `1-${i}`}
                    onActivate={() => setActiveQuestion(`1-${i}`)}
                    value={ogolne[i]}
                    onChange={(v) => setOgolneOdp(i, v)}
                  />
                ))}
              </div>
            )}

            {krok === 2 && (
              <div className="krok" key="oceny">
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
                  <div className={"ocena survey-question" + (activeQuestion === `2-${i}` ? " is-current" : "")} key={i} onFocusCapture={() => setActiveQuestion(`2-${i}`)} onPointerDown={() => setActiveQuestion(`2-${i}`)}>
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
                      value={oceny[i]}
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
              <div className="krok" key="szczegolowe">
                {PYTANIA_SZCZEGOLOWE.map((p, i) => (
                  <PytanieTak
                    key={i}
                    pytanie={`${i + 1}. ${p}`}
                    active={activeQuestion === `3-${i}`}
                    onActivate={() => setActiveQuestion(`3-${i}`)}
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

            <div className="krok__nav survey-navigation">
              <button
                className="intro__round intro__round--ghost"
                aria-label="Wstecz"
                onClick={() => {
                  if (krok === 1) {
                    // wracamy na ostatni ekran pytań wstępnych,
                    // żeby jednym kliknięciem wrócić do ankiety
                    setIntroZrobione(false);
                    setIntroKrok(PYTANIA_WSTEPNE.length - 1);
                  } else {
                    goToStep(krok - 1);
                  }
                }}
              >
                ←
              </button>
              {krok < 3 ? (
                <button
                  className="modal__send"
                  onClick={() => goToStep(krok + 1)}
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
