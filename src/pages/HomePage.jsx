import { useState, lazy, Suspense } from "react";
import useShelters from "../hooks/useShelters";
import useShelterFilters from "../hooks/useShelterFilters";
import Hero from "../components/Hero/Hero";
import FilterBar from "../components/Filters/FilterBar";
import ShelterList from "../components/Shelters/ShelterList";
import ShelterProfile from "../components/Shelters/ShelterProfile";
import About from "../components/About/About";
import AddAzylModal from "../components/Shelters/AddAzylModal";
import "./HomePage.css";

const ShelterMap = lazy(() => import("../components/Map/ShelterMap"));

export default function HomePage() {
  const { shelters, loading } = useShelters();
  const filters = useShelterFilters(shelters);
  const [selectedId, setSelectedId] = useState(null);
  const [profileShelter, setProfileShelter] = useState(null);
  const [showAzyl, setShowAzyl] = useState(false);

  if (loading) return <div className="page-loading">Ładowanie schronisk…</div>;

  return (
    <>
      <Hero shelters={shelters} />

      <section className="browse container" id="browse">
        <div className="browse__head">
          <span className="eyebrow">Przeglądaj</span>
          <h2>Schroniska w całej Polsce</h2>
          <p className="browse__note">
            Niezależny katalog schronisk w Polsce. Trwają prace nad systemem
            ocen, by łatwiej było poznać, komu można zaufać.
          </p>
        </div>
        <FilterBar {...filters} />
        <button className="add-azyl" onClick={() => setShowAzyl(true)}>
          <span className="add-azyl__plus">+</span> Dodaj azyl
        </button>{" "}
        <div className="browse__split">
          <ShelterList
            shelters={filters.filtered}
            query={filters.query}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onOpenProfile={setProfileShelter}
          />
          <Suspense fallback={null}>
            <ShelterMap
              shelters={filters.filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
              userPos={filters.userPos}
            />
          </Suspense>
        </div>
      </section>

      <About />

      {profileShelter && (
        <ShelterProfile
          shelter={profileShelter}
          onClose={() => setProfileShelter(null)}
        />
      )}

      {showAzyl && <AddAzylModal onClose={() => setShowAzyl(false)} />}
    </>
  );
}
