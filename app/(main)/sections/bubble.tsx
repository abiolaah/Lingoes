import Image from "next/image";

type Props = {
  text: string;
};
export const Bubble = ({ text }: Props) => {
  return (
    <div className="flex flex-col items-center gap-x-4 mt-6 mb-6 lg:mx-0 lg:pt-0 lg:h-[250px] lg:gap-x-0 lg:w-max">
      <div className="flex justify-start">
        <div className="bg-white relative py-2 px-4 lg:pt-0 lg:mt-0 lg:top-0 border-2 border-white rounded-xl text-sm lg:text-base lg:w-[220px]">
          <span className="block">{text}</span>
          <div className="absolute bottom-0 right-3 -mb-3 w-0 h-0 border-t-[10px] border-t-red-300 border-r-[10px] border-r-transparent"></div>
        </div>
      </div>

      <Image
        src="/characters/boy.svg"
        alt="Mascot"
        height={80}
        width={80}
        className="flex"
      />
    </div>
  );
};
