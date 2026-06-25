import { useState, useMemo, useEffect, useRef } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import ShelterCard from "./ShelterCard";
import "./ShelterList.css";

const PER_PAGE = 10;

export default function ShelterList({
  shelters,
  query,
  selectedId,
  onSelect,
  onOpenProfile,
}) {
  const isMobile = useIsMobile();
  const [page, setPage] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    if (!selectedId) return;
    const el = listRef.current?.querySelector(
      `[data-shelter-id="${selectedId}"]`,
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedId]);

  const totalPages = Math.ceil(shelters.length / PER_PAGE);

  const visible = useMemo(() => {
    if (!isMobile) return shelters;
    return shelters.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  }, [shelters, page, isMobile]);

  if (shelters.length === 0) {
    return (
      <div className="shelter-list__empty">
        Brak schronisk dla tych kryteriów. Zmień wyszukiwanie lub filtry.
      </div>
    );
  }

  return (
    <>
      <div className="shelter-list" ref={listRef}>
        {visible.map((shelter) => (
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
      {isMobile && totalPages > 1 && (
        <div className="shelter-pagination">
          <button
            className="shelter-pagination__btn"
            disabled={page === 0}
            onClick={() => {
              setPage((p) => p - 1);
              document.querySelector(".browse__split")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            ‹
          </button>
          <span className="shelter-pagination__info">
            {page + 1} / {totalPages}
          </span>
          <button
            className="shelter-pagination__btn"
            disabled={page >= totalPages - 1}
            onClick={() => {
              setPage((p) => p + 1);
              document.querySelector(".browse__split")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
