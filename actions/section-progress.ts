"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { eq, and } from "drizzle-orm";
import db from "@/db/drizzle";
import { sectionProgress, units } from "@/db/schema";
import {
  getSectionCompletedStatus,
  getSectionActiveStatus,
} from "@/db/queries"; // Import the completion status query

export const updateSectionProgress = async (sectionId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check if the section is completed
  const isSectionCompleted = await getSectionCompletedStatus(sectionId);

  if (!isSectionCompleted) {
    throw new Error("Section not completed");
  }

  // Check if the section progress for this user and section already exists
  const existingSectionProgress = await db.query.sectionProgress.findFirst({
    where: and(
      eq(sectionProgress.courseSectionId, sectionId),
      eq(sectionProgress.userId, userId)
    ),
  });

  if (existingSectionProgress && existingSectionProgress.completed) {
    return; // Section already completed, no need to update
  }

  // Update or insert the section progress to mark it as completed
  if (existingSectionProgress) {
    await db
      .update(sectionProgress)
      .set({
        completed: true,
      })
      .where(eq(sectionProgress.id, existingSectionProgress.id));
  } else {
    await db.insert(sectionProgress).values({
      userId,
      courseSectionId: sectionId,
      completed: true,
    });
  }

  // Revalidate paths to refresh the progress in the UI
  revalidatePath("/learn");
  revalidatePath(`/section/${sectionId}`);
  revalidatePath("/leaderboard");
};

export const updateSectionProgressActiveStatus = async (sectionId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check if the section is completed
  const isSectionActive = await getSectionActiveStatus(sectionId);

  if (!isSectionActive) {
    throw new Error("Section not Active");
  }

  // Check if the section progress for this user and section already exists
  const existingSectionProgress = await db.query.sectionProgress.findFirst({
    where: and(
      eq(sectionProgress.courseSectionId, sectionId),
      eq(sectionProgress.userId, userId)
    ),
  });

  /*  if (existingSectionProgress && existingSectionProgress.completed) {
    return; // Section already completed, no need to update
  } */

  if (
    existingSectionProgress &&
    existingSectionProgress.completed &&
    !existingSectionProgress.active
  ) {
    return; // Section already completed, no need to update
  }

  // Update or insert the section progress to mark it as completed
  if (existingSectionProgress) {
    await db
      .update(sectionProgress)
      .set({
        active: true,
      })
      .where(eq(sectionProgress.id, existingSectionProgress.id));
  } else {
    await db.insert(sectionProgress).values({
      userId,
      courseSectionId: sectionId,
      active: true,
      completed: false,
    });
  }

  // Revalidate paths to refresh the progress in the UI
  revalidatePath("/learn");
  // revalidatePath(`/section/${sectionId}`);
  revalidatePath("/leaderboard");
};
