// app/learn/page.tsx
"use server";
import { cookies } from "next/headers"; // Use cookies to read activeSectionId
import { redirect, useRouter } from "next/navigation";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { Header } from "./header";
import {
  getCourseProgress,
  getLessonPercentage,
  getTopTenUsers,
  getUnits,
  getUnitsBySectionId,
  getUserProgressWithSubscribedCourse,
  getUserSubscription,
} from "@/db/queries";
import { Unit } from "./unit";
import { lessons, units as unitsSchema } from "@/db/schema";
import { Leaderboard } from "@/components/leaderboard";
import Link from "next/link";
import { toast } from "sonner";
import { unSubscribeCourse, upsertUserProgress } from "@/actions/user-progress";
import { useTransition } from "react";
import { StickyContent } from "@/components/sticky-content";

const LearnPage = async () => {
  const cookieStore = cookies(); // Get the cookie store
  const sectionId = cookieStore.get("activeSectionId")?.value; // Retrieve the sectionId from cookies

  const userProgressPromise = getUserProgressWithSubscribedCourse();
  const courseProgressPromise = getCourseProgress();
  const lessonPercentagePromise = getLessonPercentage();
  const userSubscriptionPromise = getUserSubscription();
  const leaderboardPromise = getTopTenUsers();

  const [
    userProgress,
    courseProgress,
    lessonPercentage,
    userSubscription,
    leaderboardData,
  ] = await Promise.all([
    userProgressPromise,
    courseProgressPromise,
    lessonPercentagePromise,
    userSubscriptionPromise,
    leaderboardPromise,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  if (!courseProgress) {
    redirect("/courses");
  }

  // If there's no sectionId in the cookies, fall back to the activeSectionId from user progress
  const activeSectionId = sectionId
    ? parseInt(sectionId)
    : courseProgress.activeSectionId;

  if (!activeSectionId) {
    toast.info("No active section found.");
    redirect("/sections");
  }

  const sectionUnitsPromise = getUnitsBySectionId(activeSectionId as number);
  const sectionUnits = await sectionUnitsPromise;

  const units = sectionUnits;

  console.log("SECTIONS UNITS", units);

  if (!units) {
    toast.info("Section does not have any units and lessons yet");
    redirect("/sections");
  }

  const sectionLessons = units.map((unit) => {
    return unit.lessons.map((lesson) => ({
      ...lesson,
    }));
  });
  console.log("SECTIONS UNITS' LESSONS", sectionLessons);

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse items-center justify-center gap-[48px] px-6">
      <StickyWrapper>
        <StickyContent />
        {!isPro ? <Promo /> : <Leaderboard data={leaderboardData} />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Link href="/sections">
          <Header title={userProgress.activeCourse.title} />
        </Link>
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              section={unit.sectionTitle}
              // section={sectionTitle}
              lessons={unit.lessons}
              activeLesson={
                courseProgress.activeLesson as
                  | (typeof lessons.$inferSelect & {
                      unit: typeof unitsSchema.$inferSelect;
                    })
                  | undefined
              }
              activeLessonPercentage={lessonPercentage}
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
