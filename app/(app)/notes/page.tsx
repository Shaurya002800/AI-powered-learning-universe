import { NotesWorkspace } from "@/components/notes-workspace";
import { requireUser } from "@/lib/auth";
import { listNotesByUser, listTagsByUser } from "@/lib/store";

export default async function NotesPage() {
  const user = await requireUser();

  return (
    <NotesWorkspace
      initialNotes={listNotesByUser(user.id)}
      availableTags={listTagsByUser(user.id)}
    />
  );
}
