import "./Header.css";

const REPORT_URL = "https://zglos.animalhelper.pl";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="/">
          <span className="brand__mark" aria-hidden>
            <img
              src="animal-helper-72.png"
              alt="Animal Helper Logo"
              className="logo"
            ></img>
          </span>
          <span className="brand__text">Mapa Schronisk</span>
        </a>

        <nav className="site-nav">
          <a href="#browse">Schroniska</a>
          <a href="#about">O projekcie</a>
        </nav>

        <div className="site-header__actions">
          <a className="btn-ghost" href="#owner">
            Prowadzisz schronisko?
          </a>
          <a
            className="btn-yellow"
            href={REPORT_URL}
            target="_blank"
            rel="noreferrer"
          >
            Znalazłeś zwierzę?
          </a>
        </div>
      </div>
    </header>
  );
}
