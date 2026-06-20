// ============================================================
// reviewsData — DEMO opinii (frontend). Pokazuje, jak będzie
// wyglądać wątek opinii. Prawdziwe opinie przyjdą z backendu.
// Imiona są pseudonimami: numeru telefonu (weryfikacja) NIE pokazujemy.
// ============================================================

// pula przykładowych opinii — przypisujemy je deterministycznie
// do każdego schroniska, żeby wątek nie był pusty.
const SAMPLE = [
  {
    author: "Ania K.",
    verified: true,
    type: "detailed",
    visited: "yes",
    when: "2026-05-12",
    ratings: { clean_rooms: 5, clean_cages: 4, animal_state: 5, staff: 5, openness: 4 },
    text: "Byłam osobiście, bardzo zadbane zwierzęta i pomocni opiekunowie. Pokazali wszystko, o co pytałam.",
    likes: 7,
    replies: [
      { author: "Marek W.", verified: true, when: "2026-05-13", text: "Potwierdzam, też miałem dobre wrażenie." },
    ],
  },
  {
    author: "Użytkownik zweryfikowany",
    verified: true,
    type: "quick",
    visited: "indirect",
    when: "2026-05-03",
    sentiment: "pos",
    text: "Adoptowałam stąd kota, kontakt super.",
    likes: 3,
    replies: [],
  },
  {
    author: "Tomek",
    verified: true,
    type: "quick",
    visited: "no",
    when: "2026-04-21",
    sentiment: "neg",
    text: "Słyszałem różne opinie, ciężko się dodzwonić.",
    likes: 1,
    replies: [],
  },
];

// prosty, stabilny "hash" z id schroniska -> ile opinii pokazać (0..3)
function countFor(id) {
  return Number(id) % 4; // 0,1,2,3 — część schronisk bez opinii (to OK: brak danych != zła ocena)
}

// opinie demo dla danego schroniska
export function getDemoReviews(shelterId) {
  const n = countFor(shelterId);
  return SAMPLE.slice(0, n);
}

// ---- lokalne opinie użytkownika (tylko w tej przeglądarce) ----
// To NIE jest prawdziwa baza. Pokazuje tylko, że "twój wpis się pojawia".
const KEY = "demo_reviews_v1";

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
}

export function getLocalReviews(shelterId) {
  return loadLocal()[shelterId] || [];
}

export function addLocalReview(shelterId, review) {
  const all = loadLocal();
  all[shelterId] = [{ ...review, when: new Date().toISOString().slice(0, 10), local: true }, ...(all[shelterId] || [])];
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) { /* brak miejsca */ }
  return all[shelterId];
}
