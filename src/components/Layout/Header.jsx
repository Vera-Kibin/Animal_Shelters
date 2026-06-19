import "./Header.css";

const REPORT_URL = "https://zglos.animalhelper.pl";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="/">
          <span className="brand__mark" aria-hidden>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <ellipse cx="12" cy="16" rx="5" ry="4"/>
              <circle cx="5.5" cy="9.5" r="2"/><circle cx="9.5" cy="6" r="2"/>
              <circle cx="14.5" cy="6" r="2"/><circle cx="18.5" cy="9.5" r="2"/>
            </svg>
          </span>
          <span className="brand__text">Mapa Schronisk</span>
        </a>

        <nav className="site-nav">
          <a href="#browse">Schroniska</a>
          <a href="#about">O projekcie</a>
        </nav>

        <div className="site-header__actions">
          <a className="btn-ghost" href="#owner">Jesteś schroniskiem?</a>
          <a className="btn-yellow" href={REPORT_URL} target="_blank" rel="noreferrer">
            Znalazłeś zwierzę?
          </a>
        </div>
      </div>
    </header>
  );
}
