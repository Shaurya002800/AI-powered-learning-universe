import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="auth-layout">
      <div>
        <AuthForm mode="login" />
        <p className="muted tiny" style={{ textAlign: "center", marginTop: 16 }}>
          New here? <Link href="/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
