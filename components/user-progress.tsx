import Link from "next/link";
import Image from "next/image";

import { InfinityIcon, SquarePlus } from "lucide-react";

import { Button } from "./ui/button";
import { courses } from "@/db/schema";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

type Props = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

// type Checked = DropdownMenuCheckboxItemProps["checked"];
export const UserProgress = ({
  activeCourse,
  hearts,
  points,
  hasActiveSubscription,
}: Props) => {
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
          <DropdownMenuItem className="flex gap-2 items-center justify-normal text-xl font-semibold mb-2">
            <Image
              src="/flags/l/fr.svg"
              alt="French"
              width={30}
              height={30}
              className="rounded"
            />
            French
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2 items-center justify-normal text-xl font-semibold">
            <Image
              src="/flags/l/es.svg"
              alt="Spanish"
              width={30}
              height={30}
              className="rounded"
            />
            Spanish
          </DropdownMenuItem>
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
