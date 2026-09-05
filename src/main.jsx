import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Dev: убить устаревшие Service Worker'ы на localhost (наследие старых
// экспериментов). Их fetch-хендлер ломает загрузку vite-модулей (ERR_FAILED).
if (import.meta.env.DEV && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) =>
    regs.forEach((r) => {
      console.info(`[dev] unregistering stale service worker: ${r.scope}`);
      r.unregister();
    }),
  );
  caches?.keys?.().then((keys) => keys.forEach((k) => caches.delete(k)));
}

createRoot(document.getElementById("root")).render(<App />);
