import "./Hero.css";
import { Dog } from "../../assets/Animals";

const REPORT_URL = "https://zglos.animalhelper.pl";

export default function Hero({ shelters }) {
  const total = shelters.length;
  const active = shelters.filter((s) => s.status?.value === "active").length;
  const onMap = shelters.filter((s) =>
    (s.locations || []).some((l) => l.latitude != null),
  ).length;
  const cities = new Set(
    shelters.flatMap((s) =>
      (s.locations || []).map((l) => l.city).filter(Boolean),
    ),
  ).size;

  const stats = [
    { value: total, label: "schronisk w bazie" },
    { value: active, label: "aktywnych" },
    { value: onMap, label: "na mapie" },
    { value: "—", label: "zweryfikowanych" },
  ];

  return (
    <section className="hero">
      <div className="container hero__inner">
        <span className="eyebrow">Niezależny katalog · cała Polska</span>
        <h1 className="hero__title">
          Schroniska, którym
          <br />
          możesz <span>zaufać.</span>
        </h1>
        <p className="hero__lead">
          To nie jest zwykła mapa. To miejsce, w którym ludzie pomagają
          zwierzętom, dzieląc się tym, co wiedzą. Dane zbieramy i aktualizujemy
          ręcznie, a Twoja szczera opinia pomaga innym wybrać dobre schronisko.
          Pomagać można za darmo.
        </p>

        <div className="hero__cta">
          <a href="#browse" className="hero__btn hero__btn--yellow">
            Przeglądaj schroniska
          </a>
          <a
            href={REPORT_URL}
            target="_blank"
            rel="noreferrer"
            className="hero__btn hero__btn--ghost"
          >
            Znalazłeś zwierzę? Zgłoś →
          </a>
        </div>

        <div className="hero__stats">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat__value">{s.value}</span>
              <span className="stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
