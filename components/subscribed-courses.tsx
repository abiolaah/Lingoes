import Link from "next/link";
import Image from "next/image";

import { OctagonXIcon, SquarePlus } from "lucide-react";

import { Button } from "./ui/button";
import { courses } from "@/db/schema";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { toast } from "sonner";
import { useMemo } from "react";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  subscribedCourses: any[];
  handleUnSubscribe: (courseId: number) => Promise<void>;
  onClick: (id: number) => void;
};

export const SubscribedCourses = ({
  activeCourse,
  subscribedCourses,
  handleUnSubscribe,
  onClick,
}: Props) => {
  // Sort subscribedCourses to ensure activeCourse is first in the list
  const sortedCourses = useMemo(() => {
    return [
      activeCourse,
      ...subscribedCourses.filter(
        (course) => course.courseId !== activeCourse.id
      ),
    ];
  }, [activeCourse, subscribedCourses]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hidden lg:flex">
        <Button variant="ghost">
          <Image
            src={activeCourse.imageSrc}
            alt={activeCourse.title}
            className="rounded-md border"
            width={32}
            height={32}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-lg text-neutral-400 font-bold text-center">
          My Courses
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-500 h-1 rounded" />
        {sortedCourses.map((course) => {
          return (
            <DropdownMenuItem
              key={course.id}
              className="w-full mb-2 justify-between gap-14"
            >
              <Button
                onClick={() => onClick(course.courseId)}
                className="flex gap-2 items-center justify-normal text-xl font-semibold"
              >
                <Image
                  src={course.imageSrc}
                  alt={course.title}
                  width={30}
                  height={30}
                  className="rounded"
                />
                {course.title}
              </Button>
              <div className="justify-items-end">
                <OctagonXIcon
                  className="text-red-600 mr-10"
                  onClick={() => handleUnSubscribe(course.courseId)}
                />
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator className="bg-neutral-500 h-1 rounded" />
        <DropdownMenuItem>
          <Link href="/courses" className="">
            <Button
              variant="ghost"
              className="flex items-center justify-normal gap-2 text-sm"
            >
              <SquarePlus
                color="#b2b3b3"
                className="justify-items-start"
                size={35}
              />
              Add New Course
            </Button>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
