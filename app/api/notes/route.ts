import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { buildTitle } from "@/lib/notes";
import { createNote, listNotesByUser } from "@/lib/store";
import { noteSchema } from "@/lib/validators";

export async function GET() {
  const user = await requireUser();

  return NextResponse.json({
    notes: listNotesByUser(user.id)
  });
}

export async function POST(request: Request) {
  const user = await requireUser();
  const body = await request.json();
  const result = noteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid note payload." }, { status: 400 });
  }

  const note = createNote({
    id: crypto.randomUUID(),
    userId: user.id,
    title: buildTitle(result.data.title, result.data.content),
    content: result.data.content,
    category: result.data.category || "General",
    tags: result.data.tags
  });

  return NextResponse.json({ note });
}
