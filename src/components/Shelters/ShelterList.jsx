import ShelterCard from "./ShelterCard";
import "./ShelterList.css";

export default function ShelterList({
  shelters,
  query,
  selectedId,
  onSelect,
  onOpenProfile,
}) {
  if (shelters.length === 0) {
    return (
      <div className="shelter-list__empty">
        Brak schronisk dla tych kryteriów. Zmień wyszukiwanie lub filtry.
      </div>
    );
  }

  return (
    <div className="shelter-list">
      {shelters.map((shelter) => (
        <ShelterCard
          key={shelter.id}
          shelter={shelter}
          query={query}
          selected={shelter.id === selectedId}
          onSelect={onSelect}
          onOpenProfile={onOpenProfile}
        />
      ))}
    </div>
  );
}
