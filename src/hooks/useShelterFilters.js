// import { useState, useMemo } from "react";

// function matchesCategory(shelter, category) {
//   if (category === "all") return true;
//   const types = shelter.details?.animalTypes || [];
//   if (category === "dogs") return types.includes("dogs");
//   if (category === "cats") return types.includes("cats");
//   if (category === "other")
//     return types.some((t) => t !== "dogs" && t !== "cats");
//   return true;
// }

// export default function useShelterFilters(shelters) {
//   const [query, setQuery] = useState("");
//   const [category, setCategory] = useState("all"); // all | dogs | cats | other
//   const [activeOnly, setActiveOnly] = useState(true);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return shelters.filter((s) => {
//       if (activeOnly && s.status?.value !== "active") return false;
//       if (!matchesCategory(s, category)) return false;
//       if (q) {
//         const name = (s.name || "").toLowerCase();
//         const cities = (s.locations || []).map((l) =>
//           (l.city || "").toLowerCase(),
//         );
//         const hit = name.includes(q) || cities.some((c) => c.includes(q));
//         if (!hit) return false;
//       }
//       return true;
//     });
//   }, [shelters, query, category, activeOnly]);

//   return {
//     filtered,
//     query,
//     setQuery,
//     category,
//     setCategory,
//     activeOnly,
//     setActiveOnly,
//     count: filtered.length,
//   };
// }
// ============================================================
// useShelterFilters — CAŁA logika filtrowania W JEDNYM miejscu.
// Teraz też: geolokalizacja użytkownika + sortowanie wg odległości.
// ============================================================

import { useState, useMemo } from "react";

function matchesCategory(shelter, category) {
  if (category === "all") return true;
  const types = shelter.details?.animalTypes || [];
  if (category === "dogs") return types.includes("dogs");
  if (category === "cats") return types.includes("cats");
  if (category === "other")
    return types.some((t) => t !== "dogs" && t !== "cats");
  return true;
}

// odległość między dwoma punktami na Ziemi (wzór haversine), w km
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // promień Ziemi w km
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// najmniejsza odległość od użytkownika do którejkolwiek lokalizacji schroniska
function nearestDistance(shelter, pos) {
  let best = Infinity;
  for (const l of shelter.locations || []) {
    if (l.latitude != null && l.longitude != null) {
      const d = distanceKm(pos.lat, pos.lng, l.latitude, l.longitude);
      if (d < best) best = d;
    }
  }
  return best === Infinity ? null : best;
}

export default function useShelterFilters(shelters) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [activeOnly, setActiveOnly] = useState(true);

  // geolokalizacja
  const [userPos, setUserPos] = useState(null); // {lat, lng, accuracy} albo null
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  function requestLocation() {
    if (!navigator.geolocation) {
      setGeoError("Twoja przeglądarka nie wspiera lokalizacji.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setUserPos({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          accuracy: p.coords.accuracy, // promień niepewności w metrach
        });
        setLocating(false);
      },
      () => {
        setGeoError("Nie udało się ustalić lokalizacji.");
        setLocating(false);
      },
      // dokładniej + nie używaj starej, zcache'owanej pozycji
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  function clearLocation() {
    setUserPos(null);
    setGeoError(null);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = shelters.filter((s) => {
      if (activeOnly && s.status?.value !== "active") return false;
      if (!matchesCategory(s, category)) return false;
      if (q) {
        const name = (s.name || "").toLowerCase();
        const cities = (s.locations || []).map((l) =>
          (l.city || "").toLowerCase(),
        );
        if (!(name.includes(q) || cities.some((c) => c.includes(q))))
          return false;
      }
      return true;
    });

    // jeśli znamy pozycję użytkownika: dołącz odległość i posortuj rosnąco
    if (userPos) {
      list = list
        .map((s) => ({ ...s, _distanceKm: nearestDistance(s, userPos) }))
        .sort(
          (a, b) => (a._distanceKm ?? Infinity) - (b._distanceKm ?? Infinity),
        );
    }
    return list;
  }, [shelters, query, category, activeOnly, userPos]);

  return {
    filtered,
    query,
    setQuery,
    category,
    setCategory,
    activeOnly,
    setActiveOnly,
    count: filtered.length,
    // geolokalizacja na zewnątrz:
    userPos,
    locating,
    geoError,
    requestLocation,
    clearLocation,
  };
}
