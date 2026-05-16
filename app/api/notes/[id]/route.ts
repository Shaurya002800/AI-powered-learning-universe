import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { buildTitle } from "@/lib/notes";
import { getNoteByIdForUser, updateNote } from "@/lib/store";
import { noteSchema } from "@/lib/validators";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  const { id } = await params;
  const body = await request.json();
  const result = noteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid note payload." }, { status: 400 });
  }

  const existing = getNoteByIdForUser(id, user.id);

  if (!existing) {
    return NextResponse.json({ error: "Note not found." }, { status: 404 });
  }

  const note = updateNote({
    id,
    userId: user.id,
    title: buildTitle(result.data.title, result.data.content),
    content: result.data.content,
    category: result.data.category || "General",
    tags: result.data.tags,
    isArchived: result.data.isArchived ?? existing.isArchived,
    isPublic: result.data.isPublic ?? existing.isPublic
  });

  return NextResponse.json({ note });
}
