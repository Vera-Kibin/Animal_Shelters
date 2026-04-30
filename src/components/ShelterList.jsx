import ShelterCard from "./ShelterCard";

function ShelterList({ shelters }) {
  return (
    <section className="shelter-list">
      {shelters.map((shelter) => (
        <ShelterCard key={shelter["Lp."]} shelter={shelter} />
      ))}
    </section>
  );
}
export default ShelterList;
