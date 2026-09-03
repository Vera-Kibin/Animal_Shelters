import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const __filename = import.meta.url;
const __dirname = path.dirname(new URL(__filename).pathname);
const DATA_FILE = path.join(__dirname, "users.json");

const SALT_ROUNDS = 12;

let writeLock = false;

async function acquireLock() {
  while (writeLock) {
    await new Promise((r) => setTimeout(r, 10));
  }
  writeLock = true;
}

function releaseLock() {
  writeLock = false;
}

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

export async function getUsers() {
  return readUsers();
}

export async function findUser(id) {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

export async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find((u) => u.email === email);
}

export async function createUser({ email, password, name }) {
  await acquireLock();
  try {
    const users = await readUsers();
    const exists = users.some((u) => u.email === email);
    if (exists) throw new Error("Duplicate email");

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role: "volunteer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(user);
    await writeUsers(users);
    return user;
  } finally {
    releaseLock();
  }
}

export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function updateUser(id, updates) {
  await acquireLock();
  try {
    const users = await readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }

    users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
    await writeUsers(users);
    return users[idx];
  } finally {
    releaseLock();
  }
}

export async function deleteUser(id) {
  await acquireLock();
  try {
    const users = await readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found");
    const [removed] = users.splice(idx, 1);
    await writeUsers(users);
    return removed;
  } finally {
    releaseLock();
  }
}
