import React from "react";
import Image from "next/image";

type Props = {
  correctInARow: number;
};

export const MessageDisplay = ({ correctInARow }: Props) => {
  return (
    <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
      <h1 className="text-xl lg:text-3xl font-bold text-neutral-70">
        {correctInARow} in a row
      </h1>
      <Image
        src="/logo/mascot.svg"
        alt="Finish"
        className="hidden lg:block"
        height={100}
        width={100}
      />
      <Image
        src="/logo/mascot.svg"
        alt="Finish"
        className="block lg:hidden"
        height={50}
        width={50}
      />
    </div>
  );
};
