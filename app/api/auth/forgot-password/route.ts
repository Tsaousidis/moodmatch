import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import crypto from "crypto";

import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/db/schema";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    // We return success even if user doesn't exist to prevent email enumeration attacks,
    // but we won't have a token to return for the demo.
    return NextResponse.json({ success: true, message: "If an account exists, a reset link was generated." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token,
    expiresAt,
  });

  return NextResponse.json({ success: true, token }, { status: 200 });
}
