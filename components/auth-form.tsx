"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, AlertCircle } from "lucide-react";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(mode === "login" ? "demo@peblo.app" : "");
  const [password, setPassword] = useState(mode === "login" ? "Demo@12345" : "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error || "Something went wrong");
      setIsSubmitting(false);
      return;
    }

    router.push("/notes");
    router.refresh();
  }

  return (
    <form className="panel glass auth-card" onSubmit={handleSubmit}>
      <span className="pill">🌿 {mode === "login" ? "Access Gateway" : "Grow Together"}</span>
      <h1 style={{ fontSize: "2.6rem", marginBottom: 8 }}>
        {mode === "login" ? "Welcome back" : "Join our community"}
      </h1>
      <p className="muted" style={{ lineHeight: 1.7, marginBottom: 24 }}>
        {mode === "login"
          ? "Try demo@peblo.app / Demo@12345 or use your credentials"
          : "Encrypted session management. Your data, your control."}
      </p>

      <div className="editor-grid" style={{ marginTop: 24 }}>
        {mode === "signup" ? (
          <label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <User size={16} style={{ color: "var(--primary)" }} />
              <span className="tiny" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Full name
              </span>
            </div>
            <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        ) : null}

        <label>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Mail size={16} style={{ color: "var(--accent-alt)" }} />
            <span className="tiny" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Email
            </span>
          </div>
          <input
            className="input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Lock size={16} style={{ color: "var(--accent)" }} />
            <span className="tiny" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Password
            </span>
          </div>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>

      {error ? (
        <div 
          className="card" 
          style={{ 
            marginTop: 20,
            background: "linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(255, 0, 0, 0.1))",
            border: "1px solid rgba(255, 107, 107, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >
          <AlertCircle size={18} style={{ color: "#ff6b6b", flexShrink: 0 }} />
          <span style={{ color: "#ff9999", fontSize: "0.95rem", fontWeight: 600 }}>{error}</span>
        </div>
      ) : null}

      <div style={{ marginTop: 28 }}>
        <button className="button primary" style={{ width: "100%", justifyContent: "center" }} disabled={isSubmitting}>
          {isSubmitting ? "Securing session..." : mode === "login" ? "Sign in →" : "Create account →"}
        </button>
      </div>

      <p className="muted tiny" style={{ marginTop: 16, textAlign: "center", lineHeight: 1.6 }}>
        {mode === "login" ? (
          <>
            Don&apos;t have an account? <a href="/signup" style={{ color: "var(--primary)", fontWeight: 700, cursor: "pointer" }}>Sign up here</a>
          </>
        ) : (
          <>
            Already have an account? <a href="/login" style={{ color: "var(--primary)", fontWeight: 700, cursor: "pointer" }}>Sign in here</a>
          </>
        )}
      </p>
    </form>
  );
}
