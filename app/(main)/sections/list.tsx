"use client";

import { useRouter } from "next/navigation";

import { courseSections, userProgress } from "@/db/schema";

import { Card } from "./card";
import { upsertSectionProgress } from "@/actions/sections-progress";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { getCourseSectionDetails } from "@/db/queries";

type Props = {
  details: any[];
};

export const List = ({ details }: Props) => {
  // Debug log
  console.log("DETAILS:", details);
  return (
    <div className="flex flex-col gap-2 items-center justify-center lg:pt-6 lg:flex lg:flex-col lg:gap-4">
      {details.map((detail) => (
        <Card
          key={detail.id}
          id={detail.id}
          title={detail.title}
          level={detail.level}
          totalUnit={detail.totalUnit}
          phrase={detail.phrase}
          percentage={detail.percentage}
          disabled={!detail.active}
          completed={detail?.completed}
          active={detail.active}
        />
      ))}
    </div>
  );
};
