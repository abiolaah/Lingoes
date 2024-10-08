// app/api/set-active-section/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { sectionId } = await req.json();

  if (!sectionId) {
    return NextResponse.json(
      { message: "sectionId is required" },
      { status: 400 }
    );
  }

  // Store the sectionId in cookies
  cookies().set("activeSectionId", sectionId, { maxAge: 3600 }); // Cookie will expire in 1 hour

  return NextResponse.json({ message: "Section ID set successfully" });
}
