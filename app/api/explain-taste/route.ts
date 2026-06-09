import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { answerTasteQuestion } from "@/lib/ai/explain-taste";
import { authOptions } from "@/lib/auth";
import { getTasteDnaPageData } from "@/lib/taste-dna/page-data";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { question?: unknown };
  const question =
    typeof body.question === "string" ? body.question.trim().slice(0, 500) : "";

  if (question.length < 3) {
    return NextResponse.json(
      { error: "Ask a slightly longer question." },
      { status: 400 }
    );
  }

  const dna = await getTasteDnaPageData(session.user.id);

  if (!dna) {
    return NextResponse.json(
      { error: "Generate your Taste DNA first." },
      { status: 400 }
    );
  }

  const result = await answerTasteQuestion(question, dna);
  return NextResponse.json(result);
}
