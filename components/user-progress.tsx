"use client";

import Link from "next/link";
import Image from "next/image";

import { InfinityIcon } from "lucide-react";

import { Button } from "./ui/button";
import { courses } from "@/db/schema";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { upsertUserProgress, unSubscribeCourse } from "@/actions/user-progress";
import { SubscribedCourses } from "./subscribed-courses";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  subscribedCourses: any[];
  hasActiveSubscription: boolean;
};

export const UserProgress = ({
  activeCourse,
  hearts,
  points,
  subscribedCourses,
  hasActiveSubscription,
}: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (courseId: number) => {
    if (pending) return; // if the state is pending, just break out of the function

    // if the user clicks on a course that is active for them, just break out of the function and redirect them to the learn page
    if (courseId === activeCourse.id) {
      return router.push("/learn");
    }

    console.log("COURSE ID from onClick", courseId);

    startTransition(() => {
      upsertUserProgress(courseId)
        .then(() => {
          // Optionally handle the success state
          router.push("/learn"); // Redirect to learn page after progress update
        })
        .catch(() => {
          toast.error("Something went wrong.");
        });
    });
  };

  const onUnSubscribe = async (courseId: number) => {
    try {
      console.log("COURSE ID from unsubscribed", courseId);
      await unSubscribeCourse(courseId); // Call the handleUnSubscribe function
      toast.success("You have unsubscribed from the course.");
      router.refresh(); // Reload the current page instead of redirecting
    } catch (error) {
      toast.error("Error unsubscribing from the course.");
    }
  };
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <Link href="/courses" className="flex lg:hidden">
        <Button variant="ghost">
          <Image
            src={activeCourse.imageSrc}
            alt={activeCourse.title}
            className="rounded-md border"
            width={32}
            height={32}
          />
        </Button>
      </Link>

      <SubscribedCourses
        activeCourse={activeCourse}
        subscribedCourses={subscribedCourses}
        handleUnSubscribe={onUnSubscribe}
        onClick={onClick}
      />

      <Link href="/shop">
        <Button variant="ghost" className="text-orange-500">
          <Image
            src="/icons/points.svg"
            alt="Points"
            height={28}
            width={28}
            className="mr-2"
          />
          {points}
        </Button>
      </Link>
      <Link href="/shop">
        <Button variant="ghost" className="text-rose-500">
          <Image
            src="/icons/heart.svg"
            alt="Hearts"
            height={22}
            width={22}
            className="mr-2"
          />
          {hasActiveSubscription ? (
            <InfinityIcon className="h-4 w-4 stroke-[3]" />
          ) : (
            hearts
          )}
        </Button>
      </Link>
    </div>
  );
};
