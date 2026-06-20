import "./FilterBar.css";

const CATEGORIES = [
  { id: "all", label: "Wszystkie" },
  { id: "dogs", label: "Psy" },
  { id: "cats", label: "Koty" },
  { id: "other", label: "Inne" },
];

export default function FilterBar({
  query,
  setQuery,
  category,
  setCategory,
  activeOnly,
  setActiveOnly,
  count,
  userPos,
  locating,
  geoError,
  requestLocation,
  clearLocation,
}) {
  return (
    <div className="filterbar">
      <div className="filterbar__search">
        <span className="filterbar__icon">⌕</span>
        <input
          type="text"
          placeholder="Szukaj po nazwie lub mieście…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Szukaj schroniska"
        />
      </div>

      <div className="filterbar__cats">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={"chip" + (category === c.id ? " chip--active" : "")}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <label className="filterbar__toggle">
        <input
          type="checkbox"
          checked={activeOnly}
          onChange={(e) => setActiveOnly(e.target.checked)}
        />
        Tylko aktywne
      </label>

      <button
        className={"filterbar__geo" + (userPos ? " is-on" : "")}
        onClick={userPos ? clearLocation : requestLocation}
        disabled={locating}
        title="Pokaż najbliższe schroniska"
      >
        📍 {locating ? "Szukam…" : userPos ? "Pokaż wszystkie" : "Najbliższe"}
      </button>

      <span className="filterbar__count">{count} wyników</span>
      {userPos && userPos.accuracy > 50000 && (
        <span className="filterbar__geonote">lokalizacja przybliżona</span>
      )}
      {geoError && <span className="filterbar__geoerr">{geoError}</span>}
    </div>
  );
}
