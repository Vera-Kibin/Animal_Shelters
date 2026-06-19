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

      <span className="filterbar__count">{count} wyników</span>
    </div>
  );
}
