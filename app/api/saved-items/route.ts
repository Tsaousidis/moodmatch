import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import {
  toggleSavedItem,
  updateSavedItemMoods,
} from "@/lib/saved-items/service";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    itemId?: unknown;
    action?: unknown;
    moodTags?: unknown;
  };

  if (typeof body.itemId !== "string") {
    return NextResponse.json({ error: "Invalid item." }, { status: 400 });
  }

  try {
    if (body.action === "update-moods") {
      const moodTags = Array.isArray(body.moodTags)
        ? body.moodTags.filter((tag): tag is string => typeof tag === "string")
        : [];
      return NextResponse.json(
        await updateSavedItemMoods(session.user.id, body.itemId, moodTags)
      );
    }

    return NextResponse.json(
      await toggleSavedItem(session.user.id, body.itemId)
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
