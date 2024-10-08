"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import db from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import {
  getCourseById,
  getUserProgress,
  getUserSubscribedCoursesById,
  getUserSubscription,
} from "@/db/queries";
import {
  challengeProgress,
  challenges,
  userProgress,
  userSubscribedCourses,
} from "@/db/schema";
import { POINTS_TO_REFILL } from "@/constants";

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  const course = await getCourseById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  if (
    !course.sections.length ||
    !course.sections[0].units.length ||
    !course.sections[0].units[0].lessons.length
  ) {
    throw new Error("Course is empty");
  }

  // Ensure that the user progress exists or create it
  const existingUserProgress = await getUserProgress();

  if (!existingUserProgress) {
    // Insert user progress if not already created
    await db.insert(userProgress).values({
      userId,
      activeCourseId: courseId,
      userName: user.firstName || "User",
      userImageSrc: user.imageUrl || "/mascot.svg",
    });
  } else {
    // If user progress exists, update the active course
    await db
      .update(userProgress)
      .set({
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/mascot.svg",
      })
      .where(eq(userProgress.userId, userId));
  }

  // Check if the user is already subscribed to this course
  const existingSubscribedCourses = await getUserSubscribedCoursesById(
    courseId
  );

  if (!existingSubscribedCourses) {
    // If the user is not subscribed to the course, subscribe them
    await db.insert(userSubscribedCourses).values({
      userId,
      courseId,
    });
  }

  // Revalidate paths and redirect to learn page
  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};

export const reduceHearts = async (challengeId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentUserProgress = await getUserProgress();
  const userSubscription = await getUserSubscription();

  const existingChallengeProgress = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.challengeId, challengeId)
    ),
  });

  const isPractice = !!existingChallengeProgress;

  if (isPractice) {
    return { error: "practice" };
  }

  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  if (userSubscription?.isActive) {
    return { error: "subscription" };
  }

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
  });

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  const lessonId = challenge.lessonId;

  if (currentUserProgress.hearts === 0) {
    return { error: "hearts" };
  }

  await db
    .update(userProgress)
    .set({
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    })
    .where(eq(userProgress.userId, userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};

export const refillHearts = async () => {
  const currentUserProgress = await getUserProgress();

  if (!currentUserProgress) {
    throw new Error("User progress not found");
  }

  if (currentUserProgress.hearts === 5) {
    throw new Error("Hearts are already full");
  }

  if (currentUserProgress.points < POINTS_TO_REFILL) {
    throw new Error("Not enough points to refill hearts");
  }

  await db
    .update(userProgress)
    .set({
      hearts: 5,
      points: currentUserProgress.points - POINTS_TO_REFILL,
    })
    .where(eq(userProgress.userId, currentUserProgress.userId));

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};
