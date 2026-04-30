import { formatNip } from "../utils/formatters.jsx";

function ShelterCard({ shelter }) {
  return (
    <article className="shelter-card">
      <h3>{shelter["Imię i nazwisko / nazwa, siedziba i adres podmiotu"]}</h3>

      <p>{shelter["Miejsce prowadzenia działalności"]}</p>

      <p>NIP: {formatNip(shelter["NIP"])}</p>

      <p>
        Nr wet.:{" "}
        {shelter["Weterynaryjny nr identyfikacyjny / nr siedziby stada"] ||
          "brak danych"}
      </p>
    </article>
  );
}
export default ShelterCard;
