import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";

import { SidebarItem } from "./sidebar-items";
import { ModeToggle } from "./dark-light-toggle";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/logo/mascot.svg" alt="Mascot" height={40} width={40} />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            Lingoes
          </h1>
          <ModeToggle />
        </div>
      </Link>

      <div className="flex flex-col gap -y-2 flex-1">
        <SidebarItem label="Learn" href="/learn" iconSrc="/menu/learn.svg" />
        <SidebarItem
          label="Practice"
          href="/practice"
          iconSrc="/menu/practice.svg"
        />
        <SidebarItem
          label="Leaderboards"
          href="/leaderboard"
          iconSrc="/menu/leaderboard.svg"
        />
        <SidebarItem label="Quest" href="/quest" iconSrc="/menu/quest.svg" />
        <SidebarItem label="Shop" href="/shop" iconSrc="/menu/shop.svg" />
      </div>
      <div className="">
        <div className="p-4 ">
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>

          <ClerkLoaded>
            <UserButton afterSignOutUrl="/" />
            PROFILE
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
};
