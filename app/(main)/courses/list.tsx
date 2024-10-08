"use client";

import { useRouter } from "next/navigation";

import { courses, userProgress, userSubscribedCourses } from "@/db/schema";

import { Card } from "./card";
import { upsertUserProgress } from "@/actions/user-progress";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
  subscribedCourses?: number[];
};
export const List = ({ courses, activeCourseId, subscribedCourses }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return; // if the state is pending, just break out of the function

    // if the user clicks on a course that is active for them, just break out of the function and redirect them to the learn page
    if (id === activeCourseId) {
      return router.push("/learn");
    }

    startTransition(() => {
      upsertUserProgress(id).catch(() => toast.error("Something went wrong."));
    });
  };
  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={false}
          active={course.id === activeCourseId}
          subscribed={subscribedCourses?.includes(course.id) ?? false} // Check if the course is subscribed
        />
      ))}
    </div>
  );
};
