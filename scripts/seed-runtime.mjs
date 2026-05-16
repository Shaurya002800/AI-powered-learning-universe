import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

const configuredPath = process.env.DATABASE_PATH || "./data/peblo-notes.db";
const resolvedPath = path.isAbsolute(configuredPath)
  ? configuredPath
  : path.join(process.cwd(), configuredPath);

fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
const db = new Database(resolvedPath, { timeout: 5000 });
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    category TEXT,
    is_archived INTEGER NOT NULL DEFAULT 0,
    is_public INTEGER NOT NULL DEFAULT 0,
    share_id TEXT UNIQUE,
    ai_summary TEXT,
    ai_suggested_title TEXT,
    ai_action_items TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS note_tags (
    note_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ai_usage_events (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    note_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
  );
`);

const existing = db.prepare("SELECT id FROM users WHERE email = ?").get("demo@peblo.app");

if (!existing) {
  const userId = crypto.randomUUID();
  const now = new Date().toISOString();
  db.prepare("INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(userId, "Peblo Demo", "demo@peblo.app", bcrypt.hashSync("Demo@12345", 10), now);

  const notes = [
    {
      title: "Sprint Planning Notes",
      category: "Work",
      content:
        "Discussed workspace onboarding, AI summary flow, and public sharing. Action: prepare final UI polish. Action: validate metrics cards before shipping.",
      tags: ["planning", "ai", "delivery"]
    },
    {
      title: "Founder Research",
      category: "Ideas",
      content:
        "Peblo should feel playful but trustworthy. Capture parent-safe design cues, fast note capture, and strong teacher collaboration use cases.",
      tags: ["research", "product"]
    },
    {
      title: "Weekly Review",
      category: "Personal",
      content:
        "Wins: shipped auth and auto-save. Blockers: edge cases around empty titles. Next step: clean dashboard copy and record demo video.",
      tags: ["review", "weekly", "shipping"]
    }
  ];

  for (const note of notes) {
    const noteId = crypto.randomUUID();
    db.prepare(
      `INSERT INTO notes (id, user_id, title, content, category, ai_summary, ai_suggested_title, ai_action_items, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      noteId,
      userId,
      note.title,
      note.content,
      note.category,
      note.content.slice(0, 120),
      note.title,
      JSON.stringify(
        note.content
          .split(".")
          .map((part) => part.trim())
          .filter((part) => part.toLowerCase().startsWith("action:"))
          .map((part) => part.replace(/^action:\s*/i, ""))
      ),
      now,
      now
    );

    for (const tagName of note.tags) {
      let tag = db.prepare("SELECT id FROM tags WHERE name = ?").get(tagName);

      if (!tag) {
        tag = { id: crypto.randomUUID() };
        db.prepare("INSERT INTO tags (id, name, created_at) VALUES (?, ?, ?)").run(tag.id, tagName, now);
      }

      db.prepare("INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)").run(noteId, tag.id);
    }
  }
}

console.log("Demo user ensured: demo@peblo.app / Demo@12345");
