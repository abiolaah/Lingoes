import db from "@/db/drizzle";
import { courseSections } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { courseSectionId: number } }
) => {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized request", { status: 403 });
  }
  console.log("GET METHOD_PARAMS ", params.courseSectionId);

  const data = await db.query.courseSections.findFirst({
    where: eq(courseSections.id, params.courseSectionId),
  });

  return NextResponse.json(data);
};
export const PUT = async (
  req: Request,
  { params }: { params: { courseSectionId: number } }
) => {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const body = await req.json();

  const data = await db
    .update(courseSections)
    .set({
      ...body,
    })
    .where(eq(courseSections.id, params.courseSectionId))
    .returning();

  return NextResponse.json(data[0]);
};
export const DELETE = async (
  req: Request,
  { params }: { params: { courseSectionId: number } }
) => {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized request", { status: 403 });
  }

  const data = await db
    .delete(courseSections)
    .where(eq(courseSections.id, params.courseSectionId))
    .returning();

  return NextResponse.json(data[0]);
};
