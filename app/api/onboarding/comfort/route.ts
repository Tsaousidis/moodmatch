import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { contentComfortSettings } from "@/lib/db/schema";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    avoidSpoilers?: unknown;
    avoidExplicitContent?: unknown;
    avoidViolence?: unknown;
    avoidHorror?: unknown;
    avoidSadEndings?: unknown;
    customAvoidList?: unknown;
  };

  await db
    .delete(contentComfortSettings)
    .where(eq(contentComfortSettings.userId, session.user.id));

  const [settings] = await db
    .insert(contentComfortSettings)
    .values({
      userId: session.user.id,
      avoidSpoilers: Boolean(body.avoidSpoilers),
      avoidExplicitContent: Boolean(body.avoidExplicitContent),
      avoidViolence: Boolean(body.avoidViolence),
      avoidHorror: Boolean(body.avoidHorror),
      avoidSadEndings: Boolean(body.avoidSadEndings),
      customAvoidList: Array.isArray(body.customAvoidList)
        ? body.customAvoidList.filter(
            (item): item is string => typeof item === "string"
          )
        : [],
    })
    .returning();

  return NextResponse.json({ settings });
}
