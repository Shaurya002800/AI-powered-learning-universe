import { db, ensureSchema } from "@/lib/db";
import { normaliseTags, parseActionItems } from "@/lib/utils";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type NoteRecord = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  isArchived: boolean;
  isPublic: boolean;
  shareId: string | null;
  aiSummary: string | null;
  aiSuggestedTitle: string | null;
  aiActionItems: string[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

type NoteRow = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  is_archived: number;
  is_public: number;
  share_id: string | null;
  ai_summary: string | null;
  ai_suggested_title: string | null;
  ai_action_items: string | null;
  created_at: string;
  updated_at: string;
};

function mapUser(row: any): UserRecord | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at
  };
}

function mapNote(row: NoteRow): NoteRecord {
  const tags = db
    .prepare(
      `SELECT t.name
       FROM note_tags nt
       JOIN tags t ON t.id = nt.tag_id
       WHERE nt.note_id = ?
       ORDER BY t.name ASC`
    )
    .all(row.id) as Array<{ name: string }>;

  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    isArchived: Boolean(row.is_archived),
    isPublic: Boolean(row.is_public),
    shareId: row.share_id,
    aiSummary: row.ai_summary,
    aiSuggestedTitle: row.ai_suggested_title,
    aiActionItems: parseActionItems(row.ai_action_items),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tags: tags.map((tag) => tag.name)
  };
}

export function findUserByEmail(email: string) {
  ensureSchema();
  return mapUser(db.prepare("SELECT * FROM users WHERE email = ?").get(email));
}

export function findUserById(id: string) {
  ensureSchema();
  return mapUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id));
}

export function createUser(input: { id: string; name: string; email: string; passwordHash: string }) {
  ensureSchema();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(input.id, input.name, input.email, input.passwordHash, now);

  return findUserById(input.id)!;
}

export function listNotesByUser(userId: string) {
  ensureSchema();
  const rows = db
    .prepare(
      `SELECT *
       FROM notes
       WHERE user_id = ?
       ORDER BY datetime(updated_at) DESC`
    )
    .all(userId) as NoteRow[];

  return rows.map(mapNote);
}

export function listTagsByUser(userId: string) {
  ensureSchema();
  const rows = db
    .prepare(
      `SELECT DISTINCT t.name
       FROM tags t
       JOIN note_tags nt ON nt.tag_id = t.id
       JOIN notes n ON n.id = nt.note_id
       WHERE n.user_id = ?
       ORDER BY t.name ASC`
    )
    .all(userId) as Array<{ name: string }>;

  return rows.map((row) => row.name);
}

export function getNoteByIdForUser(id: string, userId: string) {
  ensureSchema();
  const row = db.prepare("SELECT * FROM notes WHERE id = ? AND user_id = ?").get(id, userId) as NoteRow | undefined;
  return row ? mapNote(row) : null;
}

export function getSharedNoteByShareId(shareId: string) {
  ensureSchema();
  const row = db.prepare("SELECT * FROM notes WHERE share_id = ?").get(shareId) as NoteRow | undefined;
  return row ? mapNote(row) : null;
}

export function createNote(input: {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}) {
  ensureSchema();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO notes (id, user_id, title, content, category, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(input.id, input.userId, input.title, input.content, input.category, now, now);

  syncNoteTags(input.id, input.tags);
  return getNoteByIdForUser(input.id, input.userId)!;
}

export function updateNote(input: {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isArchived: boolean;
  isPublic: boolean;
}) {
  ensureSchema();
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE notes
     SET title = ?, content = ?, category = ?, is_archived = ?, is_public = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`
  ).run(input.title, input.content, input.category, Number(input.isArchived), Number(input.isPublic), now, input.id, input.userId);

  syncNoteTags(input.id, input.tags);
  return getNoteByIdForUser(input.id, input.userId)!;
}

export function updateNoteAi(input: {
  id: string;
  userId: string;
  summary: string;
  suggestedTitle: string;
  actionItems: string[];
}) {
  ensureSchema();
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE notes
     SET ai_summary = ?, ai_suggested_title = ?, ai_action_items = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`
  ).run(input.summary, input.suggestedTitle, JSON.stringify(input.actionItems), now, input.id, input.userId);

  return getNoteByIdForUser(input.id, input.userId)!;
}

export function toggleShare(input: { id: string; userId: string; shareId: string }) {
  ensureSchema();
  const current = getNoteByIdForUser(input.id, input.userId);
  if (!current) {
    return null;
  }

  const now = new Date().toISOString();
  db.prepare(
    `UPDATE notes
     SET is_public = ?, share_id = ?, updated_at = ?
     WHERE id = ? AND user_id = ?`
  ).run(
    Number(!current.isPublic),
    current.isPublic ? current.shareId : current.shareId || input.shareId,
    now,
    input.id,
    input.userId
  );

  return getNoteByIdForUser(input.id, input.userId);
}

export function recordAiUsage(input: { id: string; userId: string; noteId: string; kind: string }) {
  ensureSchema();
  db.prepare(
    `INSERT INTO ai_usage_events (id, user_id, note_id, kind, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(input.id, input.userId, input.noteId, input.kind, new Date().toISOString());
}

export function getDashboardStats(userId: string) {
  ensureSchema();
  const totalNotes = (db.prepare("SELECT COUNT(*) as count FROM notes WHERE user_id = ?").get(userId) as { count: number }).count;
  const archivedNotes = (
    db.prepare("SELECT COUNT(*) as count FROM notes WHERE user_id = ? AND is_archived = 1").get(userId) as { count: number }
  ).count;
  const recentEdits = (
    db.prepare(
      `SELECT COUNT(*) as count
       FROM notes
       WHERE user_id = ? AND datetime(updated_at) >= datetime('now', '-7 days')`
    ).get(userId) as { count: number }
  ).count;
  const aiRuns = (
    db.prepare("SELECT COUNT(*) as count FROM ai_usage_events WHERE user_id = ?").get(userId) as { count: number }
  ).count;

  const topTags = db
    .prepare(
      `SELECT t.name, COUNT(*) as count
       FROM note_tags nt
       JOIN tags t ON t.id = nt.tag_id
       JOIN notes n ON n.id = nt.note_id
       WHERE n.user_id = ?
       GROUP BY t.name
       ORDER BY count DESC, t.name ASC
       LIMIT 5`
    )
    .all(userId) as Array<{ name: string; count: number }>;

  const weeklyActivity = db
    .prepare(
      `SELECT strftime('%w', updated_at) as weekday, COUNT(*) as count
       FROM notes
       WHERE user_id = ? AND datetime(updated_at) >= datetime('now', '-7 days')
       GROUP BY weekday`
    )
    .all(userId) as Array<{ weekday: string; count: number }>;

  return {
    totalNotes,
    archivedNotes,
    recentEdits,
    aiRuns,
    topTags,
    weeklyActivity
  };
}

function syncNoteTags(noteId: string, tags: string[]) {
  ensureSchema();
  db.prepare("DELETE FROM note_tags WHERE note_id = ?").run(noteId);

  for (const tagName of normaliseTags(tags)) {
    let tag = db.prepare("SELECT id FROM tags WHERE name = ?").get(tagName) as { id: string } | undefined;

    if (!tag) {
      const tagId = crypto.randomUUID();
      db.prepare("INSERT INTO tags (id, name, created_at) VALUES (?, ?, ?)").run(tagId, tagName, new Date().toISOString());
      tag = { id: tagId };
    }

    db.prepare("INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)").run(noteId, tag.id);
  }
}
