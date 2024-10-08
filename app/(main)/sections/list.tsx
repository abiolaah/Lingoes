"use client";

import { Card } from "./card";
// import { upsertSectionProgress } from "@/actions/sections-progress";

type Props = {
  details: {
    sectionId: number;
    title: string;
    level: string;
    sectionPhrase: string;
    totalUnits: number;
    completedUnits: number;
    progress: number;
    completed?: boolean;
    active?: boolean;
  }[];
};

export const List = ({ details }: Props) => {
  // Debug log
  // console.log("DETAILS:", details);
  return (
    <div className="flex flex-col gap-2 items-center justify-center lg:pt-6 lg:flex lg:flex-col lg:gap-4">
      {details.map((detail) => (
        <Card
          key={detail.sectionId}
          sectionId={detail.sectionId}
          title={detail.title}
          level={detail.level}
          sectionPhrase={detail.sectionPhrase}
          totalUnits={detail.totalUnits}
          completedUnits={detail.completedUnits}
          percentage={detail.progress}
          completed={detail?.completed}
          active={detail.active}
          disabled={!detail.active}
        />
      ))}
    </div>
  );
};
