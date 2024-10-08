// app/learn/page.tsx
import { cookies } from "next/headers"; // Use cookies to read activeSectionId
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
  getUnitsBySectionId,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";
import { Unit } from "./unit";
import { lessons, units as unitsSchema } from "@/db/schema";
import { Leaderboard } from "@/components/leaderboard";
import Link from "next/link";
import { toast } from "sonner";

const LearnPage = async () => {
  const cookieStore = cookies(); // Get the cookie store
  const sectionId = cookieStore.get("activeSectionId")?.value; // Retrieve the sectionId from cookies

  const userProgressPromise = getUserProgress();
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

  if (!units) {
    toast.info("Section does not have any units and lessons yet");
    redirect("/sections");
  }

  const isPro = !!userSubscription?.isActive;
  const sectionTitle = "Section Title"; // Fetch section title if needed

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
