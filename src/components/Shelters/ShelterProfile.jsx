import { useState } from "react";
import { createPortal } from "react-dom";
import CommentModal from "./CommentModal";
import {
  getDemoReviews,
  getLocalReviews,
  addLocalReview,
} from "../../data/reviewsData";
import "./ShelterProfile.css";

const ANIMAL_LABELS = {
  dogs: "psy",
  cats: "koty",
  horses: "konie",
  rabbits: "króliki",
  birds: "ptaki",
  rodents: "gryzonie",
  reptiles: "gady",
  fish: "ryby",
  cows: "krowy",
  pigs: "świnie",
  goats: "kozy",
  sheep: "owce",
  farm_animals: "zwierzęta gospodarskie",
  wild_animals: "dzikie",
  small_mammals: "małe ssaki",
  unknown: "inne",
};

const CRIT_LABELS = {
  clean_rooms: "Czystość pomieszczeń",
  clean_cages: "Czystość klatek",
  animal_state: "Stan zwierząt",
  staff: "Opiekunowie",
  openness: "Otwartość",
};

function Stars({ value }) {
  return (
    <span className="rv__stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? "on" : ""}>
          ★
        </span>
      ))}
    </span>
  );
}

function ReviewItem({ r }) {
  const [likes, setLikes] = useState(r.likes || 0);
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikes((n) => (liked ? n - 1 : n + 1));
  };

  return (
    <div className="rv">
      <div className="rv__head">
        <span className="rv__author">
          {r.author}
          {r.verified && <span className="rv__badge">✓ zweryfikowany</span>}
        </span>
        <span className="rv__date">{r.when}</span>
      </div>

      {r.type === "detailed" && r.ratings && (
        <div className="rv__crits">
          {Object.entries(r.ratings).map(([k, v]) => (
            <span key={k} className="rv__crit">
              {CRIT_LABELS[k] || k}: <Stars value={v} />
            </span>
          ))}
        </div>
      )}
      {r.type === "quick" && r.sentiment && (
        <span className={"rv__sent " + r.sentiment}>
          {r.sentiment === "pos" ? "👍 Pozytywna" : "👎 Negatywna"}
        </span>
      )}
      {r.visited === "no" && <span className="rv__hear">ze słyszenia</span>}

      {r.text && <p className="rv__text">{r.text}</p>}

      <div className="rv__actions">
        <button
          className={"rv__like" + (liked ? " is-on" : "")}
          onClick={toggleLike}
        >
          ♥ {likes}
        </button>
        <button className="rv__reply" disabled title="Wkrótce">
          Odpowiedz
        </button>
      </div>

      {(r.replies || []).map((rep, i) => (
        <div key={i} className="rv rv--reply">
          <div className="rv__head">
            <span className="rv__author">
              {rep.author}
              {rep.verified && <span className="rv__badge">✓</span>}
            </span>
            <span className="rv__date">{rep.when}</span>
          </div>
          <p className="rv__text">{rep.text}</p>
        </div>
      ))}
    </div>
  );
}

export default function ShelterProfile({ shelter, onClose }) {
  const [writing, setWriting] = useState(false);
  const [localReviews, setLocalReviews] = useState(() =>
    getLocalReviews(shelter.id),
  );

  const demo = getDemoReviews(shelter.id);
  const reviews = [...localReviews, ...demo];

  const loc = shelter.locations || [];
  const c = shelter.contact || {};
  const d = shelter.details || {};

  function handleSubmit(review) {
    const updated = addLocalReview(shelter.id, review);
    setLocalReviews(updated);
    setWriting(false);
  }

  return createPortal(
    <div className="profile">
      <div className="profile__bar">
        <button className="profile__back" onClick={onClose}>
          ← Wróć do mapy
        </button>
      </div>

      <div className="profile__inner">
        <div className="profile__top">
          <div className="profile__info">
            <h2>{shelter.name}</h2>
            {loc[0] && (
              <p className="profile__addr">
                {loc[0].address}
                {loc[0].city ? `, ${loc[0].city}` : ""}
              </p>
            )}

            <div className="profile__tags">
              {(d.animalTypes || []).map((t) => (
                <span key={t} className="profile__tag">
                  {ANIMAL_LABELS[t] || t}
                </span>
              ))}
            </div>

            <div className="profile__facts">
              {loc.length > 1 && (
                <div>
                  <b>Lokalizacje:</b> {loc.length}
                </div>
              )}
              {c.phone && (
                <div>
                  <b>Telefon:</b> {c.phone}
                </div>
              )}
              {c.email && (
                <div>
                  <b>E-mail:</b> {c.email}
                </div>
              )}
              {c.website && (
                <div>
                  <b>Strona:</b>{" "}
                  <a href={c.website} target="_blank" rel="noreferrer">
                    {c.website}
                  </a>
                </div>
              )}
              {c.facebook && (
                <div>
                  <b>Facebook:</b>{" "}
                  <a href={c.facebook} target="_blank" rel="noreferrer">
                    link
                  </a>
                </div>
              )}
              {c.instagram && (
                <div>
                  <b>Instagram:</b>{" "}
                  <a href={c.instagram} target="_blank" rel="noreferrer">
                    link
                  </a>
                </div>
              )}
              {c.nip && (
                <div>
                  <b>NIP:</b> {c.nip}{" "}
                  <span className="profile__muted">· dane publiczne</span>
                </div>
              )}
              {c.vetId && (
                <div>
                  <b>VET ID:</b> {c.vetId}{" "}
                  <span className="profile__muted">
                    · wpis w rejestrze Inspekcji Weterynaryjnej
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="profile__photo" aria-hidden>
            zdjęcie schroniska
          </div>
        </div>

        <div className="profile__score">
          <div>
            <span className="profile__big">—</span>
            <small>ocena ogólna</small>
          </div>
          <div>
            <span className="profile__big">{reviews.length}</span>
            <small>opinii</small>
          </div>
          <p className="profile__muted">
            Wskaźnik zaufania w przygotowaniu. Brak opinii nie oznacza złej
            oceny — to po prostu brak danych.
          </p>
        </div>

        <div className="profile__reviews">
          <div className="profile__rvhead">
            <h3>Opinie</h3>
            <button className="profile__add" onClick={() => setWriting(true)}>
              + Dodaj opinię
            </button>
          </div>
          <p className="profile__muted">
            Opinie mogą dodawać tylko zweryfikowani użytkownicy (weryfikacja
            numerem telefonu).
          </p>

          {reviews.length === 0 ? (
            <p className="profile__empty">
              Brak opinii. Bądź pierwszą osobą, która pomoże innym.
            </p>
          ) : (
            reviews.map((r, i) => <ReviewItem key={i} r={r} />)
          )}
        </div>
      </div>

      {writing && (
        <CommentModal
          shelter={shelter}
          onClose={() => setWriting(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>,
    document.body,
  );
}
