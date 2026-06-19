import { useState } from "react";
import CommentModal from "./CommentModal";
import "./ShelterCard.css";

const ANIMAL_LABELS = {
  dogs: "psy", cats: "koty", horses: "konie", rabbits: "króliki",
  birds: "ptaki", rodents: "gryzonie", reptiles: "gady", fish: "ryby",
  cows: "krowy", pigs: "świnie", goats: "kozy", sheep: "owce",
  farm_animals: "zwierzęta gospodarskie", wild_animals: "dzikie",
  small_mammals: "małe ssaki", unknown: "inne",
};

function Highlight({ text, query }) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

const Icon = {
  phone: <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11 11 0 003.4.55 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11 11 0 00.55 3.4 1 1 0 01-.24 1z"/></svg>,
  globe: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>,
  fb: <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M14 9h3V6h-3c-2 0-3 1-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V9z"/></svg>,
  ig: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
};

export default function ShelterCard({ shelter, query, selected, onSelect }) {
  const [showAllPhones, setShowAllPhones] = useState(false);
  const [copied, setCopied] = useState(null);
  const [showComment, setShowComment] = useState(false);

  const location = shelter.locations?.[0];
  const { name, contact, details } = shelter;
  const phones = (contact?.phone || "").split(",").map((p) => p.trim()).filter(Boolean);

  function copy(text, e) {
    e.stopPropagation();
    navigator.clipboard?.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1200);
  }
  const stop = (e) => e.stopPropagation();

  return (
    <article
      className={"shelter-card" + (selected ? " shelter-card--selected" : "")}
      onClick={() => onSelect?.(shelter.id)}
    >
      <div className="shelter-card__head">
        <h3 className="shelter-card__name"><Highlight text={name} query={query} /></h3>
        {location?.city && (
          <span className="shelter-card__city"><Highlight text={location.city} query={query} /></span>
        )}
      </div>

      {location?.address && <p className="shelter-card__addr">{location.address}</p>}

      <div className="shelter-card__tags">
        {(details?.animalTypes || []).slice(0, 4).map((t) => (
          <span key={t} className="shelter-card__tag">{ANIMAL_LABELS[t] || t}</span>
        ))}
      </div>

      {phones.length > 0 && (
        <div className="shelter-card__phones">
          {(showAllPhones ? phones : phones.slice(0, 1)).map((p) => (
            <div key={p} className="phone-row">
              <a href={"tel:" + p.replace(/\s/g, "")} onClick={stop} className="phone-row__call">
                {Icon.phone} {p}
              </a>
              <button className="phone-row__copy" onClick={(e) => copy(p, e)}>
                {copied === p ? "skopiowano" : "kopiuj"}
              </button>
            </div>
          ))}
          {phones.length > 1 && (
            <button className="shelter-card__more" onClick={(e) => { stop(e); setShowAllPhones((v) => !v); }}>
              {showAllPhones ? "ukryj numery" : "+" + (phones.length - 1) + " więcej numerów"}
            </button>
          )}
        </div>
      )}

      {contact?.nip && (
        <p className="shelter-card__nip">NIP {contact.nip} · dane publiczne</p>
      )}

      <div className="shelter-card__links">
        {contact?.website && (
          <a href={contact.website} target="_blank" rel="noreferrer" onClick={stop} title="Strona">{Icon.globe}</a>
        )}
        {contact?.facebook && (
          <a href={contact.facebook} target="_blank" rel="noreferrer" onClick={stop} title="Facebook">{Icon.fb}</a>
        )}
        {contact?.instagram && (
          <a href={contact.instagram} target="_blank" rel="noreferrer" onClick={stop} title="Instagram">{Icon.ig}</a>
        )}
        <button
          className="shelter-card__comment"
          onClick={(e) => { stop(e); setShowComment(true); }}
        >
          Opinie
        </button>
      </div>

      {showComment && (
        <CommentModal shelter={shelter} onClose={() => setShowComment(false)} />
      )}
    </article>
  );
}
