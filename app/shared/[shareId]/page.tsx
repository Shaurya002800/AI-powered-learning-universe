import { notFound } from "next/navigation";
import { getSharedNoteByShareId } from "@/lib/store";

export default async function SharedNotePage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params;
  const note = getSharedNoteByShareId(shareId);

  if (!note || !note.isPublic) {
    notFound();
  }

  return (
    <main className="marketing-layout">
      <article className="shell panel glass" style={{ maxWidth: 900 }}>
        <span className="pill">Public shared note</span>
        <h1>{note.title}</h1>
        <p className="muted">Category: {note.category || "General"}</p>
        <div className="row wrap" style={{ marginTop: 14 }}>
          {note.tags.map((tag) => (
            <span className="tag" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
        <div className="card" style={{ marginTop: 24, whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
          {note.content}
        </div>
        <div className="actions-grid" style={{ marginTop: 18 }}>
          <div className="card">
            <h3>AI summary</h3>
            <p className="muted tiny">{note.aiSummary || "No summary generated yet."}</p>
          </div>
          <div className="card">
            <h3>Suggested title</h3>
            <p className="muted tiny">{note.aiSuggestedTitle || "No suggested title yet."}</p>
          </div>
          <div className="card">
            <h3>Action items</h3>
            {note.aiActionItems.length ? (
              note.aiActionItems.map((item) => (
                <p className="muted tiny" key={item}>
                  • {item}
                </p>
              ))
            ) : (
              <p className="muted tiny">No extracted action items yet.</p>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
