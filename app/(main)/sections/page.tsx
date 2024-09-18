import { sectionDetails } from "@/lib/data/sectiondata";
import {
  getCourseSections,
  getUserProgress,
  getTotalUnitsInSection,
  getCompletedUnits,
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
import { number } from "react-admin";

const SectionPage = async () => {
  let section_id = 0;
  let user_id = "";

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

  if (!sections) {
    redirect("/courses");
  }

  const details = sections
    .flat()
    .find((section) => section.courseId === userProgress.activeCourseId);

  if (!details) return null;

  const totalUnit = await getTotalUnitsInSection(details?.id);
  const completedUnit = await getCompletedUnits(
    details?.id,
    userProgress.userId
  );

  // console.log("SECTION DATA", sections);
  console.log("SECTION Title", details.section.title);
  console.log("SECTION Level", details.section.level);
  console.log("SECTION Description", details.section.description);
  console.log("SECTION Phrase", details.sectionPhrase);
  console.log("SECTION Units", totalUnit);
  console.log("SECTION Completed Units", completedUnit);

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
