import {
  getUserAttendanceDate,
  getUserProgressWithSubscribedCourse,
  getUserSubscription,
} from "@/db/queries";
import { UserProgress } from "./user-progress";
import { redirect } from "next/navigation";

export const StickyContent = async () => {
  const userProgressPromise = getUserProgressWithSubscribedCourse();
  const userSubscriptionPromise = getUserSubscription();
  const userAttendanceDatePromise = getUserAttendanceDate();

  const [userProgress, userSubscription, userAttendanceDate] =
    await Promise.all([
      userProgressPromise,
      userSubscriptionPromise,
      userAttendanceDatePromise,
    ]);

  if (!userProgress) {
    redirect("/courses");
  }

  if (!userProgress?.activeCourse) {
    return <div>No active course found</div>;
  }

  const today = new Date().toISOString().split("T")[0];
  const attendanceDate = userAttendanceDate?.attendanceDate
    ?.toISOString()
    .split("T")[0];
  const lastAttendanceDate = userAttendanceDate?.lastAttendanceDate
    ?.toISOString()
    .split("T")[0];

  const hasAttendedToday =
    attendanceDate === today && lastAttendanceDate === today;

  const streak = userProgress.streakCount ? userProgress.streakCount : 0;

  return (
    <UserProgress
      activeCourse={userProgress.activeCourse}
      hearts={userProgress.hearts}
      points={userProgress.points}
      streak={streak}
      hasCompletedLessonToday={hasAttendedToday}
      subscribedCourses={userProgress.subscribedCourses}
      hasActiveSubscription={!!userSubscription?.isActive}
    />
  );
};
