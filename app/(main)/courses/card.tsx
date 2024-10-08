import { cn } from "@/lib/utils";
import { boolean } from "drizzle-orm/mysql-core";
import { BadgeCheck, Check } from "lucide-react";
import Image from "next/image";

type Props = {
  id: number;
  title: string;
  imageSrc: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  active?: boolean;
  subscribed?: boolean;
};

export const Card = ({
  id,
  title,
  imageSrc,
  onClick,
  disabled,
  active,
  subscribed,
}: Props) => {
  return (
    <div
      className={cn(
        "h-full border-2 rounded-xl border-b-4 hover:bg-black/5 hover:dark:bg-white/5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[200px]",
        disabled && "pointer-events-none opacity-50"
      )}
      onClick={() => onClick(id)}
    >
      <div className="relative w-full flex flex-row-reverse justify-between">
        <div className="min-[24px] w-full flex justify-end">
          {active && (
            <div className="rounded-md dark:bg-white bg-green-500 flex justify-center p-1.5">
              <Check className="dark:text-green-500 text-white stroke-[4] h-4 w-4" />
            </div>
          )}
        </div>
        <div className="min-[24px] w-full flex justify-start">
          {subscribed && (
            <div className="rounded-md dark:bg-white bg-blue-600 flex justify-center p-1.5">
              <BadgeCheck className="dark:text-green-500 text-white stroke-[4] h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      <Image
        src={imageSrc}
        alt={title}
        width={93.33}
        height={70}
        className="rounded-lg drop-shadow-md border object-cover"
      />
      <p className="text-neutral-700 text-center dark:text-neutral-300 font-bold mt-3">
        {title}
      </p>
    </div>
  );
};
