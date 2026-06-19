import { useState } from "react";
import "./About.css";

export default function RepModal({ onClose }) {
  const [sent, setSent] = useState(false);

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__x" onClick={onClose} aria-label="Zamknij">
          ×
        </button>

        {sent ? (
          <div className="modal__thanks">
            <h3>Dziękujemy za zgłoszenie!</h3>
            <p>
              Rejestracja przedstawicieli jest w przygotowaniu. Po jej
              uruchomieniu zweryfikujemy zgłoszenie (m.in. numerem telefonu) i
              skontaktujemy się z Tobą.
            </p>
            <button className="modal__send" onClick={onClose}>
              Zamknij
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Dla schronisk</span>
            <h3 className="modal__title">Zostań oficjalnym przedstawicielem</h3>
            <p className="modal__intro">
              Publikuj aktualności i wydarzenia, buduj zaufanie do swojego
              schroniska i spraw, by znalazło je więcej osób.
            </p>

            <div className="form-grid">
              <input placeholder="Nazwa schroniska" />
              <input placeholder="Imię i nazwisko" />
              <input placeholder="Twoja rola (np. wolontariusz)" />
              <input placeholder="Telefon (do weryfikacji)" />
              <input placeholder="E-mail" />
            </div>
            <textarea rows={3} placeholder="Kilka słów o schronisku…" />

            <button className="modal__send" onClick={() => setSent(true)}>
              Wyślij zgłoszenie
            </button>
          </>
        )}
      </div>
    </div>
  );
}
