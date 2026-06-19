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

export default function useShelterFilters(shelters) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all"); // all | dogs | cats | other
  const [activeOnly, setActiveOnly] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shelters.filter((s) => {
      if (activeOnly && s.status?.value !== "active") return false;
      if (!matchesCategory(s, category)) return false;
      if (q) {
        const name = (s.name || "").toLowerCase();
        const cities = (s.locations || []).map((l) =>
          (l.city || "").toLowerCase(),
        );
        const hit = name.includes(q) || cities.some((c) => c.includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [shelters, query, category, activeOnly]);

  return {
    filtered,
    query,
    setQuery,
    category,
    setCategory,
    activeOnly,
    setActiveOnly,
    count: filtered.length,
  };
}
