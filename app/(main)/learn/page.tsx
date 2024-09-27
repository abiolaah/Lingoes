import { redirect } from "next/navigation";
// import { redirect, useRouter } from "next/navigation";
// import { useRouter } from "next/router";

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
  getUserProgress,
  getUserSubscription,
  getUnitsBySectionId,
  getSectionTitleBySectionId,
} from "@/db/queries";
import { Unit } from "./unit";
import { lessons, units as unitsSchema } from "@/db/schema";
import { Leaderboard } from "@/components/leaderboard";
import Link from "next/link";
// import { ArrowBigLeft } from "lucide-react";

type Props = {
  searchParams: { sectionId: string }; // Use `searchParams` for sectionId from URL query
};

const LearnPage = async ({ searchParams }: Props) => {
  // Extra sectionId from router query
  const sectionId = searchParams.sectionId;

  // Guard clause: Redirect to courses if no sectionId is available
  // if (!sectionId) {
  //   // redirect("/learn");
  //   //TODO: Figure out how to get the active section and use the active section's id to direct
  //   return null;
  // }

  const userProgressPromise = getUserProgress();
  const courseProgressPromise = getCourseProgress();
  const lessonPercentagePromise = getLessonPercentage();
  // const sectionUnitsPromise = getUnitsBySectionId(Number(sectionId));
  const unitsPromise = getUnits();
  const userSubscriptionPromise = getUserSubscription();
  const leaderboardPromise = getTopTenUsers();

  const [
    userProgress,
    // sectionUnits,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
    leaderboardData,
  ] = await Promise.all([
    userProgressPromise,
    // sectionUnitsPromise,
    unitsPromise,
    courseProgressPromise,
    lessonPercentagePromise,
    userSubscriptionPromise,
    leaderboardPromise,
  ]);

  // if (!sectionUnits) return <div>No data</div>;

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  if (!courseProgress) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  const unitSectionId = units[0].courseSectionId;

  const sectionTitleData = await getSectionTitleBySectionId(unitSectionId);
  const sectionTitle =
    typeof sectionTitleData === "string"
      ? sectionTitleData
      : sectionTitleData?.sectionTitle || "Section Title";

  const unitData = units;
  // const unitData = sectionUnits;

  return (
    <div className="flex flex-row-reverse items-center justify-center gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={!!userSubscription?.isActive}
        />
        {!isPro ? <Promo /> : <Leaderboard data={leaderboardData} />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Link href="/sections">
          <Header title={userProgress.activeCourse.title} />
        </Link>
        {unitData.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              // section={unit.sectionTitle}
              section={sectionTitle}
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
