import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const candidates = [
  path.join(here, ".env"),
  path.join(here, "..", ".env"),
];

for (const file of candidates) {
  if (!existsSync(file)) continue;
  try {
    process.loadEnvFile(file);
  } catch (err) {
    console.warn(`[env] failed to parse ${file}: ${err.message}`);
  }
}
