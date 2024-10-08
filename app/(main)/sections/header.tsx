import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  href: string;
  text: string;
};
export const Header = ({ href, text }: Props) => {
  return (
    <div className="sticky top-0 bg-background pb-3 lg:pt-[28px] lg:mt-[-28px] flex items-center justify-between border-b-2 mb-5 text-neutral-400 lg:z-50">
      <Link href={href}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
        </Button>
      </Link>
      <h1 className="font-bold text-lg">{text}</h1>
      <div />
    </div>
  );
};
