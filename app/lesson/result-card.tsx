import Image from "next/image";

import { cn } from "@/lib/utils";

type Props = {
  variant: "points" | "hearts" | "percentage" | "time";
  value: number | string;
};

export const ResultCard = ({ variant, value }: Props) => {
  const imageSrc =
    variant === "hearts"
      ? "/icons/heart.svg"
      : variant === "points"
      ? "/icons/points.svg"
      : variant === "percentage"
      ? "/icons/percent.svg"
      : "/icons/timer.svg";

  const percentageHeaderText = (() => {
    const percentage =
      typeof value === "number" || !isNaN(Number(value)) ? Number(value) : null;
    const text =
      percentage !== null
        ? percentage >= 90
          ? "Amazing"
          : percentage >= 70
          ? "Great work"
          : percentage >= 50
          ? "Good Job"
          : percentage < 50
          ? "Practice More"
          : "Percentage Score"
        : "Percentage";
    return text;
  })();

  const getHeaderText = () => {
    const boxTitle =
      variant === "hearts"
        ? "Hearts Left"
        : variant === "points"
        ? "Total XP"
        : variant === "percentage"
        ? percentageHeaderText
        : "Quick";

    return boxTitle;
  };

  // const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

  // const percentageLabel
  return (
    <div
      className={cn(
        "rounded-2xl border-2 w-full",
        variant === "points" && "bg-orange-300 border-orange-300",
        variant === "hearts" && "bg-rose-500 border-orange-500",
        variant === "time" && "bg-blue-400 border-blue-400",
        variant === "percentage" && "bg-green-300 border-green-300"
      )}
    >
      <div
        className={cn(
          "p-1.5 text-white rounded-t-xl font-bold text-center uppercase text-xs",
          variant === "points" && "bg-orange-300",
          variant === "hearts" && "bg-rose-500",
          variant === "time" && "bg-blue-400",
          variant === "percentage" && "bg-green-300"
        )}
      >
        {getHeaderText()}
      </div>
      <div
        className={cn(
          "rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg",
          variant === "points" && "text-orange-300",
          variant === "hearts" && "text-rose-500",
          variant === "time" && "text-blue-400",
          variant === "percentage" && "text-green-300"
        )}
      >
        <Image
          alt={
            variant === "points"
              ? "Points"
              : variant === "hearts"
              ? "Hearts"
              : variant === "percentage"
              ? "Percentage"
              : "Time"
          }
          src={imageSrc}
          width={30}
          height={30}
          className="mr-1.5"
        />
        {variant === "time" ? value : Number(value)}
      </div>
    </div>
  );
};
