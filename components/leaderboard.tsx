import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { userProgress } from "@/db/schema";

type Props = {
  data: (typeof userProgress.$inferSelect)[] | any[];
  showHeader?: boolean;
  showViewAllButton?: boolean;
};

export const Leaderboard = ({
  data,
  showHeader = true,
  showViewAllButton = true,
}: Props) => {
  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between w-full space-y-2">
          <h3 className="font-bold text-lg">Leaderboard</h3>
          {showViewAllButton && (
            <Link href="/leaderboard">
              <Button size="sm" variant="primaryOutline">
                View All
              </Button>
            </Link>
          )}
        </div>
      )}
      <div className="w-full flex flex-col items-center">
        {data.map((user, index) => {
          return (
            <div
              key={user.userId}
              className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50"
            >
              <p className="font-bold text-lime-700 mr-4">{index + 1}</p>
              <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6">
                <AvatarImage className="object-cover" src={user.userImageSrc} />
              </Avatar>
              <p className="font-bold text-neutral-800 flex-1">
                {user.userName}
              </p>
              <p className="text-muted-foreground">{user.points} XP</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
