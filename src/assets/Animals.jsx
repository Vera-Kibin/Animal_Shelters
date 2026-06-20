// ============================================================
// Animals — własne, cienkie ikony liniowe (rysowane od zera,
// żeby nie używać cudzych assetów). Styl: linia, dziedziczy
// kolor przez currentColor, więc kolorujesz przez CSS (color).
// Użycie: <Dog className="..." />  /  <Paw />  itd.
// ============================================================

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function Dog({ className, ...p }) {
  return (
    <svg className={className} {...base} {...p} aria-hidden>
      {/* głowa psa: uszy, pysk */}
      <path d="M14 14c-2-3-2-6-1-8 3 1 5 3 6 6" />
      <path d="M34 14c2-3 2-6 1-8-3 1-5 3-6 6" />
      <path d="M14 18c0-5 4-8 10-8s10 3 10 8c0 4-2 6-2 9 0 4-3 7-8 7s-8-3-8-7c0-3-2-5-2-9Z" />
      <circle cx="20" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="28" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <path d="M24 25v3M21 29c1 1 5 1 6 0" />
    </svg>
  );
}

export function Cat({ className, ...p }) {
  return (
    <svg className={className} {...base} {...p} aria-hidden>
      {/* głowa kota: spiczaste uszy, wąsy */}
      <path d="M14 16l-2-7 7 3M34 16l2-7-7 3" />
      <path d="M13 18c0-5 5-8 11-8s11 3 11 8c0 5-4 10-11 10s-11-5-11-10Z" />
      <circle cx="20" cy="19" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="28" cy="19" r="1.3" fill="currentColor" stroke="none" />
      <path d="M24 23v2M22 25c1 .8 3 .8 4 0" />
      <path d="M16 22l-5-1M16 24l-5 1M32 22l5-1M32 24l5 1" />
    </svg>
  );
}

export function Paw({ className, ...p }) {
  return (
    <svg className={className} {...p} viewBox="0 0 48 48" fill="currentColor" aria-hidden>
      <ellipse cx="24" cy="32" rx="9" ry="7.5" />
      <circle cx="11" cy="19" r="4" />
      <circle cx="19" cy="13" r="4" />
      <circle cx="29" cy="13" r="4" />
      <circle cx="37" cy="19" r="4" />
    </svg>
  );
}

export function Home({ className, ...p }) {
  return (
    <svg className={className} {...base} {...p} aria-hidden>
      {/* domek / buda ze schronieniem */}
      <path d="M8 22 24 9l16 13" />
      <path d="M12 20v17h24V20" />
      <path d="M20 37v-8h8v8" />
    </svg>
  );
}
