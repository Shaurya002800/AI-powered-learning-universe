import Link from "next/link";
import { Sparkles, Share2, ShieldCheck, BarChart3 } from "lucide-react";
import { getSessionUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <main className="marketing-layout">
      <div className="shell">
        <section className="hero-grid">
          <div className="panel glass">
            <span className="pill">Collaborative AI workspace</span>
            <h1 style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", marginBottom: 12 }}>
              Clean thinking, structured notes, meaningful AI.
            </h1>
            <p className="muted" style={{ fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 720 }}>
              A focused full-stack notes product built for speed, clarity, and real utility: secure auth,
              organized writing, AI assistance, public sharing, and a dashboard that turns activity into insight.
            </p>
            <div className="row wrap" style={{ marginTop: 32, gap: 12 }}>
              <Link className="button primary" href={user ? "/notes" : "/signup"}>
                {user ? "Open workspace" : "Create account"}
              </Link>
              <Link className="button secondary" href={user ? "/dashboard" : "/login"}>
                {user ? "View insights" : "Use demo login"}
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="eyebrow">Fast workflow</div>
                <div style={{ fontWeight: 800, fontSize: "1.25rem", marginTop: 8 }}>Auto-save editor</div>
              </div>
              <div className="hero-stat">
                <div className="eyebrow">AI support</div>
                <div style={{ fontWeight: 800, fontSize: "1.25rem", marginTop: 8 }}>Summaries and actions</div>
              </div>
              <div className="hero-stat">
                <div className="eyebrow">Sharing</div>
                <div style={{ fontWeight: 800, fontSize: "1.25rem", marginTop: 8 }}>Public links in one click</div>
              </div>
            </div>
          </div>

          <div className="panel glass" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="feature-grid">
              <div className="card">
                <Sparkles size={20} style={{ color: "var(--primary)" }} />
                <h3 style={{ fontSize: "1.1rem", margin: "12px 0 8px 0" }}>AI intelligence</h3>
                <p className="muted tiny">Generate summaries, titles, and action items from raw notes.</p>
              </div>
              <div className="card">
                <Share2 size={20} style={{ color: "var(--accent)" }} />
                <h3 style={{ fontSize: "1.1rem", margin: "12px 0 8px 0" }}>Public sharing</h3>
                <p className="muted tiny">Turn any note into a public page without exposing private content.</p>
              </div>
              <div className="card">
                <ShieldCheck size={20} style={{ color: "var(--accent-alt)" }} />
                <h3 style={{ fontSize: "1.1rem", margin: "12px 0 8px 0" }}>Secure access</h3>
                <p className="muted tiny">Cookie-backed sessions, hashed passwords, and protected routes.</p>
              </div>
              <div className="card">
                <BarChart3 size={20} style={{ color: "var(--primary-glow)" }} />
                <h3 style={{ fontSize: "1.1rem", margin: "12px 0 8px 0" }}>Product insights</h3>
                <p className="muted tiny">Track note activity, top tags, weekly edits, and AI usage volume.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
