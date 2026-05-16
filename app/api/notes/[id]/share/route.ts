import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getNoteByIdForUser, toggleShare } from "@/lib/store";

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

  const updated = toggleShare({
    id,
    userId: user.id,
    shareId: randomUUID()
  });

  return NextResponse.json({ note: updated });
}
