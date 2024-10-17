import React from "react";
import Image from "next/image";
import { SpeechBubble } from "@/components/custom-ui/speech-bubble";

export const ReviewDisplay = () => {
  return (
    <div className="flex gap-x-4 lg:gap-x-8 max-w-lg mx-auto text-center items-center justify-center h-full">
      <Image src="/logo/mascot.svg" alt="Mascot" height={100} width={100} />

      <SpeechBubble
        position="pleft"
        align="abottom"
        bbColor="#086899"
        title="Let's correct the exercises you missed"
      />
    </div>
  );
};
