import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { generateNoteIntel } from "@/lib/ai";
import { getNoteByIdForUser, recordAiUsage, updateNoteAi } from "@/lib/store";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  const { id } = await params;

  const note = getNoteByIdForUser(id, user.id);

  if (!note) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  const ai = await generateNoteIntel(note.content);

  const updated = updateNoteAi({
    id,
    userId: user.id,
    summary: ai.summary,
    suggestedTitle: ai.suggestedTitle,
    actionItems: ai.actionItems
  });

  recordAiUsage({
    id: crypto.randomUUID(),
    userId: user.id,
    noteId: note.id,
    kind: ai.provider
  });

  return NextResponse.json({
    note: updated,
    provider: ai.provider
  });
}
