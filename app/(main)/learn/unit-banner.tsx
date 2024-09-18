import { Button } from "@/components/ui/button";
import { ArrowLeft, NotepadText } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  section: string;
  description: string;
};

export const UnitBanner = ({ title, section, description }: Props) => {
  return (
    <div className="w-full rounded-xl bg-green-500 p-5 text-white flex items-center justify-between">
      <div className="flex flex-col items-center justify-between">
        <div className=" flex gap-1">
          <Link href="/sections">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-500" />
            </Button>
          </Link>
          <h3 className="text-lg">
            {section}, {title}
          </h3>
        </div>
        <div className="space-y-2.5">
          <p className="text-2xl font-bold">{description}</p>
        </div>
      </div>

      <Link href="/lesson" />
      <Button
        size="lg"
        variant="secondary"
        className="hidden xl:flex border-2 border-b-4 active:border-b-2"
      >
        <NotepadText className="mr-2" />
        {/* Continue */}
      </Button>
    </div>
  );
};
