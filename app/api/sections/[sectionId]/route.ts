import db from "@/db/drizzle";
import { sections } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { sectionId: number } }
) => {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized request", { status: 403 });
  }
  console.log("GET METHOD_PARAMS ", params.sectionId);

  const data = await db.query.sections.findFirst({
    where: eq(sections.id, params.sectionId),
  });

  return NextResponse.json(data);
};
export const PUT = async (
  req: Request,
  { params }: { params: { sectionId: number } }
) => {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await req.json();

  const data = await db
    .update(sections)
    .set({
      ...body,
    })
    .where(eq(sections.id, params.sectionId))
    .returning();

  return NextResponse.json(data[0]);
};
export const DELETE = async (
  req: Request,
  { params }: { params: { sectionId: number } }
) => {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized request", { status: 403 });
  }

  const data = await db
    .delete(sections)
    .where(eq(sections.id, params.sectionId))
    .returning();

  return NextResponse.json(data[0]);
};
