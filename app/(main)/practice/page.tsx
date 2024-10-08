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
import { Button } from "@/components/ui/button";
import { Leaderboard } from "@/components/leaderboard";
import { StickyContent } from "@/components/sticky-content";

const PracticePage = async () => {
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
        {!isPro ? <Promo /> : <Leaderboard data={leaderboardData} />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Today&apos;s review
          </h1>
          <div className="bg-gradient-to-b from-[#204C54] to-[#36DBD9] w-full flex flex-col items-center h-40 justify-evenly">
            <p className="text-white text-center font-bold text-2xl my-2">
              Target Practice
            </p>
            <p className="text-white text-center text-lg mb-2">
              Tackle weak areas with this customized session
            </p>
            <Button variant="pro">Start +20XP</Button>
          </div>
          <Separator className=" mt-4 mb-6 h-0.5 rounded-full dark:border-slate-400 border-neutral-800" />
          <div className="flex flex-col items-start w-full">
            <div className="lg:hidden flex flex-col mb-6">
              <p className="text-left font-bold text-neutral-800 text-2xl my-2">
                Conversation
              </p>
              <Button className="w-96 mb-4  flex justify-between">
                Video Call
                <Image
                  src="/icons/video-call.svg"
                  alt="Video call"
                  width={40}
                  height={40}
                />
              </Button>
              <Button className="w-96  flex justify-between">
                Roleplay
                <Image
                  src="/icons/role-play.svg"
                  alt="Roleplay"
                  width={60}
                  height={60}
                />
              </Button>
            </div>

            <div className="flex flex-col mb-6">
              <p className="text-left font-bold text-neutral-800 text-2xl my-2">
                Skill Practice
              </p>
              <Button className="w-96 mb-4 flex justify-between">
                Mistakes
                <Image
                  src="/icons/mistakes.svg"
                  alt="Mistakes"
                  width={40}
                  height={40}
                />
              </Button>
              <Button className="w-96 mb-4 flex justify-between">
                Words
                <Image
                  src="/icons/words.svg"
                  alt="Words"
                  width={70}
                  height={70}
                />
              </Button>
              <Button className="w-96 mb-4 flex justify-between">
                Speak
                <Image
                  src="/icons/speak.svg"
                  alt="Speak"
                  width={40}
                  height={40}
                />
              </Button>
              <Button className="w-96 flex justify-between">
                Listen
                <Image
                  src="/icons/listen.svg"
                  alt="Listen"
                  width={60}
                  height={60}
                />
              </Button>
            </div>

            <div className="flex flex-col mb-6">
              <p className="text-left font-bold text-neutral-800 text-2xl my-2">
                Collections
              </p>
              <Button className="w-96 flex justify-between">
                Stories
                <Image
                  src="/icons/stories.svg"
                  alt="Stories"
                  width={40}
                  height={40}
                />
              </Button>
            </div>
          </div>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default PracticePage;
