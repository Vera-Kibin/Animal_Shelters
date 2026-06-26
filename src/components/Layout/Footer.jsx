import "./Footer.css";

const AH = "https://www.animalhelper.pl";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <div className="brand">
            <span className="brand__mark" aria-hidden>
              <img
                src="favicona-zolta.png"
                alt="Animal Helper Logo"
                className="logo"
              ></img>
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
          {/* TODO: podmień na dokładne adresy z ich strony */}
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
