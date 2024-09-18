import {
  getCourseSections,
  getLesson,
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import { sectionNote, allCEFRLevels } from "@/lib/data/sectiondata";
import { redirect } from "next/navigation";
import { Guide } from "./guide";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Leaderboard } from "@/components/leaderboard";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { Header } from "../../header";

type Props = {
  params: {
    sectionId: number;
  };
};

const SectionDetailsPage = async ({ params }: Props) => {
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

  const sectionId = params.sectionId;
  const notes = sectionNote.flat();

  const section = notes.find((note) => note.id === Number(sectionId));

  if (!section) {
    return <div>Section not found</div>;
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
        <Header href="/sections" text="Sections" />
        <Guide
          id={section.id}
          level={section.level}
          title={section.title}
          description={section.description}
          overview={section.overviewNote}
          generalExample={section.generalExample}
          concepts={section.concepts}
          levels={allCEFRLevels}
        />
      </FeedWrapper>
    </div>
  );
};

export default SectionDetailsPage;
