import { NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/store";
import { authSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const result = authSchema.safeParse(body);

  if (!result.success || !result.data.name) {
    return NextResponse.json({ error: "Please provide a valid name, email, and password." }, { status: 400 });
  }

  const existing = findUserByEmail(result.data.email);

  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const user = createUser({
    id: crypto.randomUUID(),
    name: result.data.name,
    email: result.data.email,
    passwordHash: await hashPassword(result.data.password)
  });

  await createSession(user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
}
