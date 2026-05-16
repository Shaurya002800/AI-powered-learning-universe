import { Sparkles, TrendingUp, Target, Zap } from "lucide-react";

type DashboardViewProps = {
  stats: {
    totalNotes: number;
    archivedNotes: number;
    recentEdits: number;
    aiRuns: number;
    topTags: Array<{ name: string; count: number }>;
    weeklyActivity: Array<{ day: string; count: number }>;
  };
};

export function DashboardView({ stats }: DashboardViewProps) {
  return (
    <div className="editor-grid">
      <section className="panel glass">
        <span className="pill">Workspace analytics</span>
        <h1 style={{ marginBottom: 8, fontSize: "2.2rem" }}>A cleaner view of your note activity</h1>
        <p className="muted" style={{ lineHeight: 1.6 }}>
          Monitor note volume, weekly engagement, organization patterns, and how often AI is used across the workspace.
        </p>
      </section>

      <section className="stats-grid">
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Sparkles size={20} style={{ color: "var(--accent-warm)" }} />
            <div className="tiny muted">Total notes</div>
          </div>
          <div className="metric-value">{stats.totalNotes}</div>
          <div className="tiny muted">Notes created in the workspace</div>
        </div>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Target size={20} style={{ color: "var(--accent-warm)" }} />
            <div className="tiny muted">Archived</div>
          </div>
          <div className="metric-value">{stats.archivedNotes}</div>
          <div className="tiny muted">Archived for later reference</div>
        </div>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <TrendingUp size={20} style={{ color: "var(--primary)" }} />
            <div className="tiny muted">Edited this week</div>
          </div>
          <div className="metric-value">{stats.recentEdits}</div>
          <div className="tiny muted">Notes touched in the last 7 days</div>
        </div>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Zap size={20} style={{ color: "var(--accent)" }} />
            <div className="tiny muted">AI runs</div>
          </div>
          <div className="metric-value">{stats.aiRuns}</div>
          <div className="tiny muted">AI generations completed</div>
        </div>
      </section>

      <section className="actions-grid">
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Most-used tags</h3>
          <div className="insight-list">
            {stats.topTags.length ? (
              stats.topTags.map((tag) => (
                <div
                  className="row between"
                  key={tag.name}
                  style={{ padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--line)" }}
                >
                  <span className="tag">#{tag.name}</span>
                  <span className="muted tiny" style={{ fontWeight: 700 }}>{tag.count} notes</span>
                </div>
              ))
            ) : (
              <p className="muted tiny">Start tagging notes to surface organization patterns.</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>Weekly activity</h3>
          <div className="insight-list">
            {stats.weeklyActivity.map((entry) => (
              <div
                className="row between"
                key={entry.day}
                style={{ padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--line)" }}
              >
                <span style={{ fontWeight: 600 }}>{entry.day}</span>
                <strong style={{ color: "var(--text)" }}>{entry.count} edits</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: 16 }}>What this tells you</h3>
          <p className="muted tiny" style={{ lineHeight: 1.8, margin: 0 }}>
            This dashboard keeps the insights practical: how much you write, how often you revisit notes,
            how you organize information, and whether AI is becoming part of your regular workflow.
          </p>
        </div>
      </section>
    </div>
  );
}
