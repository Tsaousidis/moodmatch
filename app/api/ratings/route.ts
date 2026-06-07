import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { saveRating } from "@/lib/ratings/save-rating";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    itemId?: unknown;
    rating?: unknown;
    likedTraits?: unknown;
    dislikedTraits?: unknown;
  };
  const rating = Number(body.rating);

  if (
    typeof body.itemId !== "string" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json({ error: "Invalid rating." }, { status: 400 });
  }

  try {
    const result = await saveRating({
      userId: session.user.id,
      itemId: body.itemId,
      rating,
      likedTraits: readTraits(body.likedTraits),
      dislikedTraits: readTraits(body.dislikedTraits),
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rating failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

function readTraits(value: unknown) {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter((item): item is string => typeof item === "string")
        ),
      ].slice(0, 8)
    : [];
}
