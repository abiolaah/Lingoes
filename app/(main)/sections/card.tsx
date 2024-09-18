import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { boolean } from "drizzle-orm/mysql-core";
import { Check, Dot, Lock, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Bubble } from "./bubble";
import { Button } from "@/components/ui/button";

type Props = {
  id: number;
  title: string;
  level: string;
  totalUnit: number;
  phrase: string;
  percentage: number;
  disabled?: boolean;
  completed?: boolean;
  active?: boolean;
};

export const Card = ({
  id,
  title,
  level,
  totalUnit,
  phrase,
  percentage,
  disabled,
  completed,
  active,
}: Props) => {
  return (
    <div
      className={cn(
        "h-[250px] w-[450px] flex flex-col-reverse lg:flex-row justify-between min-h-[100px] min-w-[250px] pt-2 pb-4 px-4 border-2 rounded-xl border-b-4 hover:bg-black/5 hover:dark:bg-white/5 cursor-pointer active:border-b-2 gap-2",
        !active && "bg-gray-200 text-slate-500",
        completed && "bg-opacity-5 text-slate-800 h-fit",
        active && "lg:bg-sky-100"
      )}
    >
      <div className={cn(active && "lg:h-[250px]")} id="">
        <div id="" className="">
          <div
            id="level-title"
            className="flex flex-row-reverse justify-between lg:flex-col lg:gap-3"
          >
            <div
              className={cn(completed && "lg:text-sm lg:text-nowrap")}
              id="level-details-div"
            >
              <Link
                href={`/sections/details/${id}`}
                className="flex text-sky-400 font-bold"
              >
                <p className="text-sky-400 font-bold">{level}</p>
                <Dot />
                SEE DETAILS
              </Link>
            </div>
            <h1
              className={cn(
                "text-neutral-600 font-bold text-2xl",
                completed && "lg:text-lg"
              )}
            >
              {title}
            </h1>
          </div>
          <div id="" className="">
            <div className={cn(completed && "flex")}>
              {completed && (
                <>
                  <div className="gap-1 hidden lg:flex">
                    <div className="rounded-full dark:bg-white bg-green-500 flex items-center justify-center p-1.5">
                      <Check className="dark:text-green-500 text-white stroke-[4] h-4 w-4" />
                    </div>
                    <h5 className="text-green-500 uppercase font-bold text-lg lg:text-sm">
                      Completed
                    </h5>
                  </div>

                  <div className="flex w-[400px] lg:hidden gap-0 ">
                    <Progress value={percentage} className="w-full" />
                    <Trophy className="text-green-500" width={30} height={30} />
                  </div>
                </>
              )}
            </div>

            {active ? (
              <div className="lg:mt-4 lg:gap-2 lg:w-full">
                <div className="w-[400px] flex lg:mb-10 lg:w-[200px]">
                  <Progress value={percentage} className="w-full" />
                  <Trophy className="text-green-500" width={30} height={30} />
                </div>
                <Button variant="primary" className="lg:flex hidden">
                  <Link href="/learn">Continue</Link>
                </Button>
              </div>
            ) : completed ? (
              <div className=""></div>
            ) : (
              <div className="lg:mt-24">
                <Button className="flex">
                  <Link href="/learn" className="text-sky-400">
                    Jump To {title}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        {!completed ? (
          <Bubble text={phrase} />
        ) : (
          <div className="hidden lg:flex lg:items-center lg:justify-end">
            <Button>
              <Link href="/learn" className="text-sky-400">
                Review
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
