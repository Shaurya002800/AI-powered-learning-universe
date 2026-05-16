import { DashboardView } from "@/components/dashboard-view";
import { requireUser } from "@/lib/auth";
import { getDashboardStats } from "@/lib/store";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function DashboardPage() {
  const user = await requireUser();
  const stats = getDashboardStats(user.id);

  const weeklyMap = days.reduce<Record<string, number>>((acc, day, index) => {
    const match = stats.weeklyActivity.find((entry) => Number(entry.weekday) === index);
    acc[day] = match?.count ?? 0;
    return acc;
  }, {});

  return (
    <DashboardView
      stats={{
        totalNotes: stats.totalNotes,
        archivedNotes: stats.archivedNotes,
        recentEdits: stats.recentEdits,
        aiRuns: stats.aiRuns,
        topTags: stats.topTags,
        weeklyActivity: days.map((day) => ({ day, count: weeklyMap[day] }))
      }}
    />
  );
}
