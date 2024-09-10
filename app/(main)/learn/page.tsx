import { redirect } from "next/navigation";

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
} from "@/db/queries";
import { Unit } from "./unit";
import { lessons, units as unitsSchema } from "@/db/schema";
import { Leaderboard } from "@/components/leaderboard";

const LearnPage = async () => {
  const userProgressPromise = getUserProgress();
  const courseProgressPromise = getCourseProgress();
  const lessonPercentagePromise = getLessonPercentage();
  const unitsPromise = getUnits();
  const userSubscriptionPromise = getUserSubscription();
  const leaderboardPromise = getTopTenUsers();

  const [
    userProgress,
    units,
    courseProgress,
    lessonPercentage,
    userSubscription,
    leaderboardData,
  ] = await Promise.all([
    userProgressPromise,
    unitsPromise,
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

  const isPro = !!userSubscription?.isActive;

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
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
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
