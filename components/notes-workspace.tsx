"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { Archive, Copy, Plus, Search, Sparkles, Wand2 } from "lucide-react";

type Note = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  isArchived: boolean;
  isPublic: boolean;
  shareId: string | null;
  aiSummary: string | null;
  aiSuggestedTitle: string | null;
  aiActionItems: string[];
  createdAt: string;
  updatedAt: string;
};

type NotesWorkspaceProps = {
  initialNotes: Note[];
  availableTags: string[];
};

export function NotesWorkspace({ initialNotes, availableTags }: NotesWorkspaceProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedId, setSelectedId] = useState(initialNotes[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [showArchived, setShowArchived] = useState(false);
  const [status, setStatus] = useState("All changes saved");
  const [copied, setCopied] = useState("");
  const [isPending, startTransition] = useTransition();
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const visibleNotes = useMemo(() => {
    return notes
      .filter((note) => (showArchived ? true : !note.isArchived))
      .filter((note) =>
        search
          ? [note.title, note.content, note.category ?? "", note.tags.join(" ")]
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase())
          : true
      )
      .filter((note) => (selectedTag === "all" ? true : note.tags.includes(selectedTag)))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [notes, search, selectedTag, showArchived]);

  const activeNoteId =
    selectedId && notes.some((note) => note.id === selectedId) ? selectedId : (visibleNotes[0]?.id ?? null);
  const selectedNote = notes.find((note) => note.id === activeNoteId) ?? null;

  async function createNote() {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Untitled note",
        content: "",
        category: "General",
        tags: []
      })
    });

    const payload = await response.json();
    setNotes((current) => [payload.note, ...current]);
    setSelectedId(payload.note.id);
  }

  function updateSelected(patch: Partial<Note>) {
    if (!selectedNote) {
      return;
    }

    const updated = { ...selectedNote, ...patch, updatedAt: new Date().toISOString() };
    setNotes((current) => current.map((note) => (note.id === updated.id ? updated : note)));
    setStatus("Saving...");

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      void persistNote(updated);
    }, 500);
  }

  async function persistNote(note: Note) {
    const response = await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags,
        isArchived: note.isArchived,
        isPublic: note.isPublic
      })
    });

    const payload = await response.json();
    if (response.ok) {
      setNotes((current) => current.map((item) => (item.id === note.id ? payload.note : item)));
      setStatus("All changes saved");
    } else {
      setStatus(payload.error || "Could not save");
    }
  }

  function updateTags(raw: string) {
    const tags = raw
      .split(",")
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean);

    updateSelected({ tags });
  }

  async function generateAi() {
    if (!selectedNote) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/notes/${selectedNote.id}/ai`, { method: "POST" });
      const payload = await response.json();

      if (response.ok) {
        setNotes((current) => current.map((item) => (item.id === selectedNote.id ? payload.note : item)));
      }
    });
  }

  async function toggleShare() {
    if (!selectedNote) {
      return;
    }

    const response = await fetch(`/api/notes/${selectedNote.id}/share`, {
      method: "POST"
    });
    const payload = await response.json();

    if (response.ok) {
      setNotes((current) => current.map((item) => (item.id === selectedNote.id ? payload.note : item)));
    }
  }

  async function copyShareLink() {
    if (!selectedNote?.shareId) {
      return;
    }

    const baseUrl = window.location.origin;
    const url = `${baseUrl}/shared/${selectedNote.shareId}`;
    await navigator.clipboard.writeText(url);
    setCopied("Share link copied");
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div className="note-shell">
      <section className="panel glass">
        <div className="workspace-header">
          <div className="workspace-toolbar">
            <div className="workspace-meta">
              <div className="pill">
                <Search size={16} />
                Search and organize
              </div>
              <h2>Your notes</h2>
              <p className="muted tiny">
                Find notes quickly, filter by tags, and jump back into recent work.
              </p>
            </div>
            <button className="button primary row" onClick={createNote}>
              <Plus size={16} />
              New note
            </button>
          </div>

          <div className="list-toolbar">
            <div className="row">
              <div className="pill">
                <Search size={16} />
                {visibleNotes.length} visible notes
              </div>
            </div>

            <input
              className="input"
              placeholder="Search titles, content, categories, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="row wrap">
              <select className="select" value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                <option value="all">All tags</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    #{tag}
                  </option>
                ))}
              </select>
              <button className="button secondary" onClick={() => setShowArchived((value) => !value)}>
                {showArchived ? "Hide archived" : "Show archived"}
              </button>
            </div>
          </div>
        </div>

        <div className="note-list" style={{ marginTop: 18 }}>
          {visibleNotes.map((note) => (
            <button
              key={note.id}
              className={`note-card ${activeNoteId === note.id ? "active" : ""}`}
              onClick={() => setSelectedId(note.id)}
            >
              <div className="row between">
                <strong>{note.title}</strong>
                <span className="tiny muted">{formatDistanceToNow(new Date(note.updatedAt))} ago</span>
              </div>
              <p className="muted tiny" style={{ margin: "8px 0 0", lineHeight: 1.6 }}>
                {note.content.slice(0, 120) || "Empty note"}
              </p>
              <div className="row wrap" style={{ marginTop: 10 }}>
                {note.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
                {note.isArchived ? <span className="tag">Archived</span> : null}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="panel glass">
        {selectedNote ? (
          <div className="editor-surface">
            <div className="workspace-toolbar">
              <div className="workspace-meta">
                <div className="status">{status}</div>
                <h2>Editor workspace</h2>
                <p className="muted tiny">
                  Write freely, then use AI to summarize, title, and extract next steps.
                </p>
              </div>
              <div className="row wrap">
                <button className="button secondary row" onClick={generateAi} disabled={isPending}>
                  <Wand2 size={16} />
                  {isPending ? "Generating..." : "Run AI"}
                </button>
                <button
                  className="button secondary row"
                  onClick={() => updateSelected({ isArchived: !selectedNote.isArchived })}
                >
                  <Archive size={16} />
                  {selectedNote.isArchived ? "Restore" : "Archive"}
                </button>
                <button className="button secondary row" onClick={toggleShare}>
                  <Sparkles size={16} />
                  {selectedNote.isPublic ? "Disable share" : "Generate link"}
                </button>
                {selectedNote.shareId ? (
                  <button className="button secondary row" onClick={copyShareLink}>
                    <Copy size={16} />
                    Copy link
                  </button>
                ) : null}
              </div>
            </div>

            <div className="field-grid">
              <div className="card">
                <div className="eyebrow" style={{ marginBottom: 10 }}>Category</div>
                <input
                  className="input"
                  value={selectedNote.category ?? ""}
                  onChange={(e) => updateSelected({ category: e.target.value })}
                />
              </div>
              <div className="card">
                <div className="eyebrow" style={{ marginBottom: 10 }}>Tags</div>
                <input
                  className="input"
                  value={selectedNote.tags.join(", ")}
                  onChange={(e) => updateTags(e.target.value)}
                />
              </div>
              <div className="card">
                <div className="eyebrow" style={{ marginBottom: 10 }}>Sharing</div>
                <p className="muted tiny">{selectedNote.isPublic ? "Public link is active" : "This note is private"}</p>
                {copied ? <div className="tiny" style={{ marginTop: 8, color: "var(--accent-alt)" }}>{copied}</div> : null}
              </div>
            </div>

            <label>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Title
              </div>
              <input
                className="input"
                value={selectedNote.title}
                onChange={(e) => updateSelected({ title: e.target.value })}
              />
            </label>

            <label>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                Content
              </div>
              <textarea
                className="textarea"
                value={selectedNote.content}
                onChange={(e) => updateSelected({ content: e.target.value })}
              />
            </label>

            <div className="actions-grid">
              <div className="card">
                <h3 style={{ marginTop: 0 }}>AI summary</h3>
                <p className="muted tiny" style={{ lineHeight: 1.7 }}>
                  {selectedNote.aiSummary || "Run AI to generate a summary."}
                </p>
              </div>
              <div className="card">
                <h3 style={{ marginTop: 0 }}>Suggested title</h3>
                <p className="muted tiny" style={{ lineHeight: 1.7 }}>
                  {selectedNote.aiSuggestedTitle || "AI title suggestions appear here."}
                </p>
              </div>
              <div className="card">
                <h3 style={{ marginTop: 0 }}>Action items</h3>
                <div className="insight-list">
                  {selectedNote.aiActionItems.length ? (
                    selectedNote.aiActionItems.map((item) => (
                      <div className="tiny muted" key={item}>
                        • {item}
                      </div>
                    ))
                  ) : (
                    <div className="tiny muted">No action items found yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">Create your first note to get started.</div>
        )}
      </section>
    </div>
  );
}
