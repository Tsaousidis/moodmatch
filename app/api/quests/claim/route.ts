import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { claimQuest } from "@/lib/quests/service";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { userQuestId?: unknown };

  if (typeof body.userQuestId !== "string") {
    return NextResponse.json({ error: "Invalid quest." }, { status: 400 });
  }

  try {
    return NextResponse.json(
      await claimQuest(session.user.id, body.userQuestId)
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Claim failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
