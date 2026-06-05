import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasteTags } from "@/lib/db/schema";
import { tagBelongsToUser } from "@/lib/onboarding/tags";

type TagDecision = "pending" | "confirmed" | "rejected";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    decisions?: { tagId?: unknown; decision?: unknown }[];
  };

  const decisions = Array.isArray(body.decisions) ? body.decisions : [];

  for (const item of decisions) {
    if (typeof item.tagId !== "string") {
      continue;
    }

    const decision: TagDecision =
      item.decision === "confirmed" || item.decision === "rejected"
        ? item.decision
        : "pending";

    await db
      .update(tasteTags)
      .set({
        isConfirmed: decision === "confirmed",
        isRejected: decision === "rejected",
        updatedAt: new Date(),
      })
      .where(tagBelongsToUser(session.user.id, item.tagId));
  }

  return NextResponse.json({ ok: true });
}
