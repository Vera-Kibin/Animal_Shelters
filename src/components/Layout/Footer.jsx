import "./Footer.css";

const AH = "https://www.animalhelper.pl";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <div className="brand">
            <span className="brand__mark" aria-hidden>
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <ellipse cx="12" cy="16" rx="5" ry="4" />
                <circle cx="5.5" cy="9.5" r="2" />
                <circle cx="9.5" cy="6" r="2" />
                <circle cx="14.5" cy="6" r="2" />
                <circle cx="18.5" cy="9.5" r="2" />
              </svg>
            </span>
            <span className="brand__text">Mapa Schronisk</span>
          </div>
          <p>
            Projekt studencki powiązany z fundacją Animal Helper. Niezależny
            katalog schronisk, bez reklam i prowizji. Dane zbierane i
            aktualizowane ręcznie.
          </p>
          <a
            className="site-footer__ah"
            href={AH}
            target="_blank"
            rel="noreferrer"
          >
            Poznaj Animal Helper ↗
          </a>
        </div>

        <div className="site-footer__col">
          <h4>Eksploruj</h4>
          <a href="#browse">Mapa i lista</a>
          <a href="#about">O projekcie</a>
          <a href="#owner">Dla schronisk</a>
        </div>

        <div className="site-footer__col">
          <h4>Animal Helper</h4>
          {/* TODO: dokładne adresy z ich strony */}
          <a href={AH} target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href={AH} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={AH} target="_blank" rel="noreferrer">
            animalhelper.pl
          </a>
        </div>

        <div className="site-footer__col">
          <h4>Kontakt</h4>
          <a href="mailto:kontakt@example.com">kontakt@example.com</a>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <span>© 2026 Mapa Schronisk</span>
        <span>projekt studencki · pl</span>
      </div>
    </footer>
  );
}
