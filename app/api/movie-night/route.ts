import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import {
  getMovieNightRecommendations,
  type MovieNightInput,
} from "@/lib/movie-night/service";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<MovieNightInput>;
  const tastes = typeof body.tastes === "string" ? body.tastes.trim() : "";
  const alreadySeen =
    typeof body.alreadySeen === "string" ? body.alreadySeen.trim() : "";
  const vibe = typeof body.vibe === "string" ? body.vibe.trim() : "Balanced";
  const groupSize = Math.min(20, Math.max(2, Number(body.groupSize) || 2));

  if (tastes.length < 10) {
    return NextResponse.json(
      { error: "Describe the group's taste in a little more detail." },
      { status: 400 }
    );
  }

  try {
    return NextResponse.json(
      await getMovieNightRecommendations(session.user.id, {
        tastes: tastes.slice(0, 1200),
        alreadySeen: alreadySeen.slice(0, 1200),
        vibe: vibe.slice(0, 80),
        groupSize,
      })
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not plan movie night.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
