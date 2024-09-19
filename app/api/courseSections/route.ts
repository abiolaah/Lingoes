import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { courseSections } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized Request", { status: 403 });
  }
  const data = await db.query.courseSections.findMany();

  return NextResponse.json(data);
};

export const POST = async (request: Request) => {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized Request", { status: 403 });
  }

  const body = await request.json();

  const data = await db
    .insert(courseSections)
    .values({ ...body })
    .returning();

  return NextResponse.json(data[0]);
};
