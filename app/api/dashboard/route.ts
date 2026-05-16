import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/store";

export async function GET() {
  const user = await requireUser();
  const stats = getDashboardStats(user.id);

  return NextResponse.json({
    totalNotes: stats.totalNotes,
    recentEdits: stats.recentEdits,
    aiRuns: stats.aiRuns,
    topTags: stats.topTags
  });
}
