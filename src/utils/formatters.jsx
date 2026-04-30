export function normalizeNip(nip) {
  if (!nip) return "brak danych";
  return String(nip).replace(/\D/g, "");
}
export function formatNip(nip) {
  const clean = normalizeNip(nip);
  if (clean === "brak danych") return clean;
  if (clean.length !== 10) return clean;
  return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 8)}-${clean.slice(8, 10)}`;
}
