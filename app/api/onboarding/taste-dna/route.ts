import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { generateAndSaveTasteDna } from "@/lib/onboarding/taste-dna";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasteDna = await generateAndSaveTasteDna(session.user.id);

  return NextResponse.json({ tasteDna });
}
