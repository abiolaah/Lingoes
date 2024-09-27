import { sectionDetails } from "@/lib/data/sectiondata";
import {
  getCourseSections,
  getUserProgress,
  getTotalUnitsInSection,
  getCompletedUnits,
  getUserSubscription,
  getTopTenUsers,
  getCourseSectionInfo,
} from "@/db/queries";

import { List } from "./list";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Promo } from "@/components/promo";
import { Leaderboard } from "@/components/leaderboard";
import { Quests } from "@/components/quests";
import { redirect } from "next/navigation";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Header } from "./header";

const SectionPage = async () => {
  const courseSectionInfoPromise = getCourseSectionInfo();
  const userProgressPromise = getUserProgress();
  const userSubscriptionPromise = getUserSubscription();
  const leaderboardPromise = getTopTenUsers();

  const [sectionsInfo, userProgress, userSubscription, leaderboardData] =
    await Promise.all([
      courseSectionInfoPromise,
      userProgressPromise,
      userSubscriptionPromise,
      leaderboardPromise,
    ]);

  if (!sectionsInfo) {
    redirect("/courses");
  }

  // Check if sectionsInfo has the correct structure
  const sectionsInfoData = sectionsInfo.map((section: any) => ({
    sectionId: section.sectionId || 0, // Ensure sectionId is provided or default to 0
    title: section.title || "Untitled", // Fallback for missing title
    level: section.level || "Beginner", // Default level if not provided
    sectionPhrase: section.sectionPhrase || "Default Phrase",
    totalUnits: section.totalUnits || 0, // Ensure totalUnits is a number
    completedUnits: section.completedUnits || 0, // Ensure completedUnits is a number
    progress: section.progress || 0, // Ensure progress is a number
    completed: section.completed || false, // Fallback to false if not completed
    active: section.active || false, // Fallback to false if not active
  }));

  if (!userProgress) {
    redirect("/courses");
  }

  // console.log("SECTION INFO @page.tsx", sectionsInfo);

  const isPro = !!userSubscription?.isActive;

  if (!userProgress?.activeCourse) {
    return <div>No active course found</div>;
  }

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
        <Header href="/learn" text="Back" />
        <List details={sectionsInfoData} />
        {/* <List details={sectionDetails} /> */}
      </FeedWrapper>
    </div>
  );
};

export default SectionPage;
