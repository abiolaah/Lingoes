import React from "react";
import { useAudio, useWindowSize } from "react-use";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import Image from "next/image";
import { ResultCard } from "./result-card";
import { Footer } from "./footer";

type Props = {
  totalPoints: number;
  hearts: number;
  lessonPercentage: number;
  timeTaken: string;
  lessonId: number;
};

export const FinishDisplay = ({
  totalPoints,
  hearts,
  lessonPercentage,
  timeTaken,
  lessonId,
}: Props) => {
  const { width, height } = useWindowSize();
  const router = useRouter();
  const [finishAudio] = useAudio({ src: "/audio/finish.mp3", autoPlay: true });

  const mainHeader = (() => {
    const percentage = lessonPercentage;
    const text =
      percentage !== null
        ? percentage === 100
          ? `Perfect Lesson!`
          : percentage >= 90
          ? `Great job!`
          : percentage >= 70
          ? `Great job!`
          : percentage < 50
          ? `Great job!`
          : `Good job!`
        : "Good Job";
    return text;
  })();

  const paragraph = (() => {
    const percentage = lessonPercentage;
    const text =
      percentage !== null
        ? percentage === 100
          ? `Take a bow!.`
          : percentage >= 90
          ? `You&apos;ve completed the lesson.`
          : percentage >= 70
          ? `Way to go.`
          : percentage < 50
          ? `You need to practice more`
          : `You&apos;ve completed the lesson.`
        : "";
    return text;
  })();

  return (
    <div>
      {finishAudio}
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        tweenDuration={10000}
      />
      <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
        <Image
          src="/icons/finish.svg"
          alt="Finish"
          className="hidden lg:block"
          height={100}
          width={100}
        />
        <Image
          src="/icons/finish.svg"
          alt="Finish"
          className="block lg:hidden"
          height={50}
          width={50}
        />
        <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
          {mainHeader}
        </h1>
        <p className="text-lg lg:text-2xl font-normal text-neutral-700">
          {paragraph}
        </p>

        <div className="flex items-center gap-x-4 w-full justify-evenly">
          <ResultCard variant="points" value={totalPoints} />
          <ResultCard variant="hearts" value={hearts} />
          <ResultCard variant="percentage" value={lessonPercentage} />
          <ResultCard variant="time" value={timeTaken} />
        </div>
      </div>
      <Footer
        lessonId={lessonId}
        status="completed"
        onCheck={() => router.push("/learn")}
      />
    </div>
  );
};
