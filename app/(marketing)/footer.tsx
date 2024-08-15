import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
      <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/flags/l/us.svg"
            alt="english"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          English
        </Button>

        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/flags/l/es.svg"
            alt="Spanish"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Spanish
        </Button>

        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/flags/l/fr.svg"
            alt="French"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          French
        </Button>

        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/flags/l/it.svg"
            alt="Italian"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Italian
        </Button>

        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/flags/l/kr.svg"
            alt="Korean"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Korean
        </Button>

        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/flags/l/jp.svg"
            alt="Japanese"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Japanese
        </Button>

        <Button size="lg" variant="ghost" className="w-full">
          <Image
            src="/flags/l/cn.svg"
            alt="Chinese"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Chinese
        </Button>
      </div>
    </footer>
  );
};
