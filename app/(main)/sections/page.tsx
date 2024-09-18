import { sectionDetails } from "@/lib/data/sectiondata";
import {
  getCourseSections,
  getUserProgress,
  getCourseSectionDetails,
  getUserSubscription,
  getTopTenUsers,
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
  const courseSectionPromise = getCourseSections();
  const userProgressPromise = getUserProgress();
  const userSubscriptionPromise = getUserSubscription();
  const leaderboardPromise = getTopTenUsers();

  const [sections, userProgress, userSubscription, leaderboardData] =
    await Promise.all([
      courseSectionPromise,
      userProgressPromise,
      userSubscriptionPromise,
      leaderboardPromise,
    ]);

  if (!userProgress) {
    redirect("/courses");
  }

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
        <List details={sectionDetails} />
      </FeedWrapper>
    </div>
  );
};

export default SectionPage;
