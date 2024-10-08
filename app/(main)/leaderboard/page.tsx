import { redirect } from "next/navigation";
import Image from "next/image";

import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { Leaderboard } from "@/components/leaderboard";
import { StickyContent } from "@/components/sticky-content";

const LeaderboardPage = async () => {
  const userProgressPromise = getUserProgress();
  const userSubscriptionPromise = getUserSubscription();
  const leaderboardPromise = getTopTenUsers();

  const [userProgress, userSubscription, leaderboardData] = await Promise.all([
    userProgressPromise,
    userSubscriptionPromise,
    leaderboardPromise,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <StickyContent />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src="/menu/leaderboard-header.svg"
            alt="Leaderboard"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See where you stand with the other learners in the community
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />
          {leaderboardData.map((userProgress, index) => {
            return (
              <div
                key={userProgress.userId}
                className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50"
              >
                <p className="font-bold text-lime-700 mr-4">{index + 1}</p>
                <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6">
                  <AvatarImage
                    className="object-cover"
                    src={userProgress.userImageSrc}
                  />
                </Avatar>
                <p className="font-bold text-neutral-800 flex-1">
                  {userProgress.userName}
                </p>
                <p className="text-muted-foreground">
                  {userProgress.points} XP
                </p>
              </div>
            );
          })}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;
