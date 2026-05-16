import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import { findUserByEmail } from "@/lib/store";
import { authSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const result = authSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Please provide a valid email and password." }, { status: 400 });
  }

  const user = findUserByEmail(result.data.email);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const matches = await verifyPassword(result.data.password, user.passwordHash);

  if (!matches) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await createSession(user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
}
