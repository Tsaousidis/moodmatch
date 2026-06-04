import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq, inArray } from "drizzle-orm";

import { authOptions } from "@/lib/auth";
import { ensureDefaultCategories } from "@/lib/categories/defaults";
import { db } from "@/lib/db";
import { categories, userCategories } from "@/lib/db/schema";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { categoryIds?: unknown };
  const categoryIds = Array.isArray(body.categoryIds)
    ? [
        ...new Set(
          body.categoryIds.filter((id): id is string => typeof id === "string")
        ),
      ]
    : [];

  if (categoryIds.length === 0) {
    return NextResponse.json(
      { error: "Select at least one category." },
      { status: 400 }
    );
  }

  await ensureDefaultCategories();

  const validCategories = await db
    .select({ id: categories.id })
    .from(categories)
    .where(inArray(categories.id, categoryIds));

  const validCategoryIds = validCategories.map((category) => category.id);

  if (validCategoryIds.length === 0) {
    return NextResponse.json(
      { error: "No valid categories selected." },
      { status: 400 }
    );
  }

  await db
    .delete(userCategories)
    .where(eq(userCategories.userId, session.user.id));

  await db.insert(userCategories).values(
    validCategoryIds.map((categoryId) => ({
      userId: session.user.id,
      categoryId,
    }))
  );

  return NextResponse.json({ categoryIds: validCategoryIds });
}
