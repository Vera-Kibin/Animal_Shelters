import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

const __filename = import.meta.url;
const __dirname = path.dirname(new URL(__filename).pathname);
const DATA_FILE = path.join(__dirname, "data", "users.json");

async function readUsers() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

async function writeUsers(users) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function getUsers() {
  return readUsers();
}

export function findUser(id) {
  return readUsers().find((u) => u.id === id);
}

export function createUser({ email, password, name }) {
  const users = readUsers();
  const exists = users.some((u) => u.email === email);
  if (exists) throw new Error("Duplicate email");
  const user = {
    id: uuidv4(),
    email,
    password,
    name,
    role: "volunteer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export function updateUser(id, updates) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
  writeUsers(users);
  return users[idx];
}

export function deleteUser(id) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found");
  const [removed] = users.splice(idx, 1);
  writeUsers(users);
  return removed;
}