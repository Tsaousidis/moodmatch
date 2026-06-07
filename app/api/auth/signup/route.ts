import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { hashPassword } from "@/lib/auth/password";
import { db } from "@/lib/db";
import { users, xpLog } from "@/lib/db/schema";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  const name = body.name?.trim() || null;
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const [createdUser] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
    });

  await db.insert(xpLog).values({
    userId: createdUser.id,
    action: "signup",
    points: 25,
  });

  return NextResponse.json({ user: createdUser }, { status: 201 });
}
