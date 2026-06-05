import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { userSliderDefaults } from "@/lib/db/schema";

function normalizeSlider(value: unknown) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return 50;
  }

  return Math.min(100, Math.max(0, Math.round(numberValue)));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { rows?: unknown };
  const rows = Array.isArray(body.rows) ? body.rows : [];

  const values = rows
    .filter(
      (row): row is Record<string, unknown> =>
        typeof row === "object" && row !== null && typeof row.categoryId === "string"
    )
    .map((row) => ({
      userId: session.user.id,
      categoryId: String(row.categoryId),
      novelty: normalizeSlider(row.novelty),
      comfort: normalizeSlider(row.comfort),
      depth: normalizeSlider(row.depth),
      energy: normalizeSlider(row.energy),
      weirdness: normalizeSlider(row.weirdness),
      social: normalizeSlider(row.social),
    }));

  if (values.length === 0) {
    return NextResponse.json(
      { error: "No slider values provided." },
      { status: 400 }
    );
  }

  await db
    .delete(userSliderDefaults)
    .where(eq(userSliderDefaults.userId, session.user.id));

  await db.insert(userSliderDefaults).values(values);

  return NextResponse.json({ rows: values });
}
