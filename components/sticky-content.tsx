import {
  getUserProgressWithSubscribedCourse,
  getUserSubscription,
} from "@/db/queries";
import { UserProgress } from "./user-progress";
import { redirect } from "next/navigation";

export const StickyContent = async () => {
  const userProgressPromise = getUserProgressWithSubscribedCourse();
  const userSubscriptionPromise = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressPromise,
    userSubscriptionPromise,
  ]);

  if (!userProgress) {
    redirect("/courses");
  }

  if (!userProgress?.activeCourse) {
    return <div>No active course found</div>;
  }

  return (
    <UserProgress
      activeCourse={userProgress.activeCourse}
      hearts={userProgress.hearts}
      points={userProgress.points}
      subscribedCourses={userProgress.subscribedCourses}
      hasActiveSubscription={!!userSubscription?.isActive}
    />
  );
};
