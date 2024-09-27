import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { courseSections } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
  if (!getIsAdmin()) {
    return new NextResponse("Unauthorized Request", { status: 403 });
  }
  // Fetch all course sections
  const courseSections = await db.query.courseSections.findMany();

  // Fetch related course and section titles
  const courses = await db.query.courses.findMany();
  const sections = await db.query.sections.findMany();

  // Create a map for quick access to course and section titles
  const courseMap = new Map(courses.map((course) => [course.id, course.title]));
  const sectionMap = new Map(
    sections.map((section) => [section.id, section.title])
  );

  // Combine the data with concatenated titles
  const data = courseSections.map((section) => ({
    ...section,
    title: `${courseMap.get(section.courseId)} - ${sectionMap.get(
      section.sectionId
    )}`, // Create the title
  }));

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
