import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  getDiscoverRecommendations,
  type DiscoverFilters,
} from "@/lib/recommendations/discover";

function normalizeSlider(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue)
    ? Math.min(100, Math.max(0, Math.round(numberValue)))
    : 50;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<DiscoverFilters>;
  const results = await getDiscoverRecommendations(session.user.id, {
    vibe: typeof body.vibe === "string" ? body.vibe.slice(0, 500) : "",
    categoryId: typeof body.categoryId === "string" ? body.categoryId : null,
    novelty: normalizeSlider(body.novelty),
    comfort: normalizeSlider(body.comfort),
    energy: normalizeSlider(body.energy),
  });

  return NextResponse.json(results);
}
