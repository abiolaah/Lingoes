// components/SpeechBubble.tsx
import React from "react";
import { cn } from "@/lib/utils";

type SpeechBubbleProps = {
  position: string; // pbottom, ptop, pleft, pright
  align: string; // aleft, acenter, aright, abottom, atop
  flip?: boolean;
  bbColor: string;
  title: string;
};

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  position,
  align,
  flip,
  bbColor,
  title,
}) => {
  return (
    <div
      className={cn(
        "relative rounded-md p-4 text-white", // Basic styling
        position === "pbottom" && "mb-6",
        position === "ptop" && "mt-6",
        position === "pleft" && "ml-6",
        position === "pright" && "mr-6"
      )}
      style={{ backgroundColor: bbColor }}
    >
      <div className="font-semibold mb-2 text-white">{title}</div>

      {/* Add Tailwind-specific positioning for the arrow */}
      <div
        className={cn(
          "absolute w-0 h-0 border-solid",
          position === "pbottom" && [
            "border-t-[1rem]",
            "border-t-transparent",
            "border-r-[0.75rem] border-l-[0.75rem]",
            "border-l-transparent border-r-transparent",
            align === "aleft" && "left-4 bottom-[-1rem]",
            align === "acenter" &&
              "left-1/2 transform -translate-x-1/2 bottom-[-1rem]",
            align === "aright" && "right-4 bottom-[-1rem]",
          ],
          position === "ptop" && [
            "border-b-[1rem]",
            "border-b-transparent",
            "border-r-[0.75rem] border-l-[0.75rem]",
            "border-l-transparent border-r-transparent",
            align === "aleft" && "left-4 top-[-1rem]",
            align === "acenter" &&
              "left-1/2 transform -translate-x-1/2 top-[-1rem]",
            align === "aright" && "right-4 top-[-1rem]",
          ],
          position === "pleft" && [
            "border-r-[1rem]",
            "border-r-transparent",
            "border-t-[0.75rem] border-b-[0.75rem]",
            "border-t-transparent border-b-transparent",
            align === "atop" && "top-4 left-[-1rem]",
            align === "acenter" &&
              "top-1/2 transform -translate-y-1/2 left-[-1rem]",
            align === "abottom" && "bottom-4 left-[-1rem]",
          ],
          position === "pright" && [
            "border-l-[1rem]",
            "border-l-transparent",
            "border-t-[0.75rem] border-b-[0.75rem]",
            "border-t-transparent border-b-transparent",
            align === "atop" && "top-4 right-[-1rem]",
            align === "acenter" &&
              "top-1/2 transform -translate-y-1/2 right-[-1rem]",
            align === "abottom" && "bottom-4 right-[-1rem]",
          ],
          flip && "transform scale-x-[-1]"
        )}
        style={{ borderColor: bbColor }}
      ></div>
    </div>
  );
};
