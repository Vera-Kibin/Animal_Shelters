import { useState } from "react";
import RepModal from "./RepModal";
import "./About.css";

export default function About() {
  const [showRep, setShowRep] = useState(false);

  return (
    <section className="about" id="about">
      <div className="container about__grid">
        <div className="about__text">
          <span className="eyebrow">O projekcie</span>
          <h2>Mapa, której można zaufać</h2>
          <p>
            Mapa Schronisk to projekt studencki powiązany z projektem Animal
            Helper, czyli pierwszym w Polsce 112 dla zwierząt. Zamiast danych
            pobieranych automatycznie z Google Maps, zbieramy je ręcznie i na
            bieżąco aktualizujemy.
          </p>
          <p>
            Pracujemy też nad wskaźnikiem wiarygodności. Wylicza się go z ocen i
            opinii ludzi, którzy naprawdę odwiedzili schronisko, żeby od razu
            było widać, komu można zaufać. Pomagać można za darmo. Wystarczy
            podzielić się szczerą opinią.
          </p>
          <p className="about__contact">
            Coś nie działa albo masz uwagi? Napisz:{" "}
            <a href="mailto:kontakt@example.com">kontakt@example.com</a>
          </p>
        </div>

        <aside className="about__rep" id="owner">
          <span className="eyebrow">Dla schronisk</span>
          <h3>Reprezentujesz schronisko?</h3>
          <p>
            Zgłoś się jako oficjalny przedstawiciel. Publikuj aktualności i
            wydarzenia, buduj zaufanie i status schroniska, i spraw, by znalazło
            je więcej osób.
          </p>
          <button className="about__btn" onClick={() => setShowRep(true)}>
            Jestem przedstawicielem schroniska
          </button>
          <small>
            Rejestracja wymaga weryfikacji (m.in. numerem telefonu).
          </small>
        </aside>
      </div>

      {showRep && <RepModal onClose={() => setShowRep(false)} />}
    </section>
  );
}
