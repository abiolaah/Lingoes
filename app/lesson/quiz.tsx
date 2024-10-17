"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useEffect, useState, useTransition } from "react";
import { useAudio, useWindowSize, useMount } from "react-use";
import Confetti from "react-confetti";

import { toast } from "sonner";

import {
  challengeOptions,
  challenges,
  userProgress,
  userSubscription,
} from "@/db/schema";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import {
  reduceHearts,
  updateAttendanceStreak,
  updatePoints,
} from "@/actions/user-progress";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { ResultCard } from "./result-card";

type Props = {
  initialLessonId: number;
  initialLessonChallenge: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  initialHearts: number;
  initialPercentage: number;
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean;
      })
    | null;
};

export const Quiz = ({
  initialLessonId,
  initialLessonChallenge,
  initialHearts,
  initialPercentage,
  userSubscription,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();

  const MAX_PERCENTAGE = 100;
  const CHALLENGE_WEIGHT = MAX_PERCENTAGE / initialLessonChallenge.length;

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const { width, height } = useWindowSize();

  const router = useRouter();

  const [finishAudio] = useAudio({ src: "/audio/finish.mp3", autoPlay: true });

  const [correctAudio, _c, correctControls] = useAudio({
    src: "/audio/correct.wav",
  });

  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/audio/incorrect.wav",
  });

  const [pending, startTransition] = useTransition();

  const [lessonId] = useState(initialLessonId);

  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });

  const [lessonPercentage, setLessonPercentage] = useState(0);

  const [challenges] = useState(initialLessonChallenge);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // New state to track incorrect challenges
  const [incorrectChallenges, setIncorrectChallenges] = useState<number[]>([]);
  const [correctChallenges, setCorrectChallenges] = useState<number[]>([]);
  const [isReviewingIncorrect, setIsReviewingIncorrect] = useState(false);
  const [hasMarkedAttendance, setHasMarkedAttendance] = useState(false);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  // Prevent the quiz from being stuck on last question
  const isQuizCompleted =
    activeIndex >= challenges.length && incorrectChallenges.length === 0;

  // Select challenge based on review mode or regular mode
  const challenge = isQuizCompleted
    ? null
    : isReviewingIncorrect && incorrectChallenges.length > 0
    ? challenges[incorrectChallenges[activeIndex]]
    : challenges[activeIndex];

  const options = challenge?.challengeOptions ?? [];

  useEffect(() => {
    //Start the timer when the component mounts
    setStartTime(new Date());
  }, []);

  const onNext = () => {
    if (isReviewingIncorrect) {
      // If currently reviewing incorrect challenges
      if (activeIndex < incorrectChallenges.length) {
        // Continue reviewing incorrect challenges
        setActiveIndex((current) => current + 1);
      } else {
        // Finished reviewing incorrect challenges
        setIsReviewingIncorrect(false); // Exit review mode
        setActiveIndex(challenges.length); // Optionally set this to end or leave it
      }
    } else {
      // Not in review mode
      if (activeIndex < challenges.length - 1) {
        // Move to next challenge in normal mode
        setActiveIndex((current) => current + 1);
      } else if (incorrectChallenges.length > 0) {
        // If there are incorrect challenges, start reviewing
        setActiveIndex(0);
        setIsReviewingIncorrect(true);
      } else {
        // If no more challenges, mark quiz as completed
        setActiveIndex(challenges.length); // Move to the end
      }
    }
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;

    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!challenge) return; // No challenge to continue

    if (!selectedOption) return;

    const correctOption = options.find((option) => option.correct);

    if (status === "wrong") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (!correctOption) return;

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            correctControls.play();
            setStatus("correct");

            if (!isReviewingIncorrect) {
              // Only update percentage if not in review mode
              setPercentage((prev) => prev + 100 / challenges.length);
              setLessonPercentage((prev) => Math.ceil(prev + CHALLENGE_WEIGHT));
              setCorrectChallenges((prev) => [...prev, activeIndex]);
            }

            if (!isReviewingIncorrect && initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }

            if (isReviewingIncorrect) {
              // Remove the challenge from the incorrect challenges list
              setIncorrectChallenges((prev) =>
                prev.filter((_, index) => index !== activeIndex)
              );
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again"));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            incorrectControls.play();
            setStatus("wrong");
            setLessonPercentage((prev) => {
              const weight = CHALLENGE_WEIGHT;
              if (prev === 0 || (prev > 0 && prev < weight)) return 0;
              return Math.ceil(prev - weight);
            });

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }

            if (!isReviewingIncorrect) {
              setIncorrectChallenges((prev) => [...prev, activeIndex]);
            }
          })
          .catch(() => toast.error("Something went wrong! Please try again"));
      });
    }
  };

  useEffect(() => {
    if (isQuizCompleted) {
      setEndTime(new Date());

      // Ensure points are calculated only from correct challenges
      const pointsFromCorrectChallenges = correctChallenges.length * 10;

      setTotalPoints(pointsFromCorrectChallenges);

      updatePoints(pointsFromCorrectChallenges);
    }
  }, [isQuizCompleted, correctChallenges.length]);

  useEffect(() => {
    if (isQuizCompleted && !hasMarkedAttendance) {
      updateAttendanceStreak()
        .then(() => {
          setHasMarkedAttendance(true); // Mark attendance successfully
          toast.info("Attendance has been marked");
        })
        .catch((error) => {
          if (error.message !== "Attendance already marked for today") {
            toast.error("Failed to update attendance. Try again.");
          }
        });
    }
  }, [isQuizCompleted, hasMarkedAttendance]);

  const formatTimeTaken = (start: Date | null, end: Date | null): string => {
    if (!start || !end) return "0:00";

    const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds}`;
  };

  const timeTaken = formatTimeTaken(startTime, endTime);

  if (isQuizCompleted) {
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
            Great job! <br /> You&apos;ve completed the lesson.
          </h1>
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
  }
  if (!challenge) {
    return <div>No Challenge Found</div>;
  }
  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question; //TODO: Add more types
  return (
    <div>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div className="">
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOptions={selectedOption}
                disabled={pending}
                type={challenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </div>
  );
};
