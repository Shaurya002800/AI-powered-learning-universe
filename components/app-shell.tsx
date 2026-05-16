"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, FileText, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type AppShellProps = {
  user: {
    name: string;
    email: string;
  };
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const links = [
    { href: "/notes" as Route, label: "Workspace", icon: FileText },
    { href: "/dashboard" as Route, label: "Insights", icon: BarChart3 }
  ];

  return (
    <div className="shell workspace-layout">
      <aside className="sidebar">
        <div className="panel glass">
          <div className="row" style={{ marginBottom: 16 }}>
            <div className="brand-mark">
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Peblo Notes</div>
              <div className="muted tiny">AI workspace</div>
            </div>
          </div>

          <div className="editor-grid">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} className={cn("nav-link", pathname === href && "active")} href={href}>
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel glass">
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            Signed in
          </div>
          <div style={{ fontWeight: 700 }}>{user.name}</div>
          <div className="muted tiny">{user.email}</div>
          <button className="button secondary row" onClick={logout} style={{ marginTop: 16 }}>
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      <section className="workspace-main">{children}</section>
    </div>
  );
}
