import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Dot,
  NotepadTextIcon,
  Signal,
  Volume2,
  X,
} from "lucide-react";
import Link from "next/link";
import { Header } from "../../header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type Props = {
  id: number;
  level: string;
  title: string;
  description: string;
  overview: string;
  generalExample: string;
  concepts: any[];
  levels: any[];
};
export const Guide = ({
  id,
  level,
  title,
  description,
  overview,
  generalExample,
  concepts,
  levels,
}: Props) => {
  return (
    <div className="" id="guide">
      <div className="flex-1 z-0 min-w-0">
        <Link
          href="/sections"
          id="a"
          className="left-5 fixed top-5 z-[210] lg:hidden"
        >
          <X />
        </Link>
        <div id="_3sE1Y" className="flex flex-col gap-7">
          <div
            className="h-[207px] bg-orange-400 flex flex-col items-center justify-center py-0 px-6 fixed w-full z-10 lg:w-full lg:absolute lg:h-[150px] lg:rounded-lg"
            id="_3nRrq"
          >
            <Button variant="ghost" className="text-sky-500">
              {}
              <Dot />
              See Details
            </Button>
            <h1 className="text-2xl mb-2 font-bold">{title}</h1>
            <div className="opacity-100 text-xl overflow-hidden text-center">
              {description}
            </div>
          </div>
          <div className="h-[207px] lg:hidden" id="zioYB"></div>
          <div
            className="flex flex-col border-b-2 border-b-slate-300 mt-44"
            id="_179rq"
          >
            <div className="flex justify-start py-0 px-4">
              <Signal
                color="#273cdd"
                strokeWidth={3}
                size={24}
                className="border-none"
              />
              <h1 className="text-2xl ml-3 mr-0 mt-0 mb-0"> CEFR {level}</h1>
            </div>
            <span className="text-lg mb-4 py-0 px-4">
              <span>
                This section covers{" "}
                <b>
                  {overview} {level}
                </b>{" "}
                level of CEFR, an international standard of language
                proficiency.
              </span>
            </span>
            <span className="text-lg mb-4 py-0 px-4">
              Here&apos;s how someone at this level might communicate:
            </span>
            <div className="py-0 px-4" id="_2EIwv">
              <div className="flex" id="_1kJSC">
                <div className="box-border relative z-[150] ml-8px" id="_1UOaB">
                  <div
                    id="_1DLP9"
                    className="px-3 pt-2 pb-4 bg-slate-200 border-2 border-slate-300 border-solid rounded-2xl box-border overflow-hidden translate-z-0"
                  >
                    <div
                      className="grid justify-items-start items-center"
                      id="iS2Dl"
                    >
                      <span
                        id="fEd5"
                        className="self-start grid col-start-1 col-end-auto row-start-1 row-end-auto h-[39px] justify-self-end mr-2"
                      >
                        <Button variant="ghost">
                          <span>
                            <Volume2
                              strokeWidth={3}
                              size={24}
                              color="#8bcdea"
                            />
                          </span>
                        </Button>
                      </span>
                      <div
                        id="text-span"
                        className="col-start-2 col-end-auto row-start-1 row-end-auto"
                      >
                        <span>
                          <div className="inline-flex underline-offset-[13px]">
                            <span className="">
                              <span className="text-lg font-normal text-left whitespace-pre-wrap">
                                {generalExample}
                              </span>
                            </span>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="Vpm8y"
                    className="h-2 overflow-hidden w-5 box-border absolute top-2 -left-3 -rotate-90"
                  ></div>
                </div>
              </div>
            </div>
            <div>
              <div
                id="AdHI2 _1OHQd"
                className="flex cursor-pointer gap-2 font-bold text-lg justify-between mt-6 mb-3"
              >
                <Accordion
                  type="single"
                  collapsible
                  className="w-full hover:no-underline"
                >
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger>All CEFR levels</AccordionTrigger>
                    <AccordionContent>
                      {levels.map((item) => (
                        <span className="flex gap-4 text-justify text-slate-500 text-lg mb-2">
                          <p>{item.level}</p>
                          <p>{item.example}</p>
                        </span>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
          <div className="" id="empty">
            <div className="flex justify-start py-0 px-4" id="_3fXbG">
              <NotepadTextIcon
                strokeWidth={3}
                size={24}
                color="#8bcdea"
                className="border-none mr-2"
              />
              <h1 className="text-2xl my-0 mt-0 mb-3 font-bold">
                Grammar Concepts
              </h1>
            </div>
            <div id="_27Zqu" className="">
              <Accordion type="single" collapsible>
                {concepts.map((conceptDeets, index) => (
                  <AccordionItem value={`items-${index + 1}`} key={index}>
                    <AccordionTrigger className="text-lg font-bold">
                      {conceptDeets.concept}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-lg font-medium mb-2">
                        {conceptDeets.description}
                      </div>
                      <div />
                      <div
                        className={cn(
                          "flex gap-3 mt-2 mb-3",
                          !conceptDeets.example1 && "hidden"
                        )}
                      >
                        <Button size="sm">
                          <Volume2 strokeWidth={3} size={24} color="#8bcdea" />
                        </Button>
                        <p className="text-lg font-normal">
                          {conceptDeets.example1}
                        </p>
                      </div>
                      <div />
                      <div
                        className={cn(
                          "flex gap-3 mt-2 mb-3",
                          !conceptDeets.example2 && "hidden"
                        )}
                      >
                        <Button size="sm">
                          <Volume2 strokeWidth={3} size={24} color="#8bcdea" />
                        </Button>
                        <p className="text-lg font-normal">
                          {conceptDeets.example2}
                        </p>
                      </div>
                      <div />
                      <div className="text-lg font-medium mb-4 mt-4">
                        {conceptDeets.note1}
                      </div>
                      <div />
                      <div
                        className={cn(
                          "flex gap-3 mt-2 mb-3",
                          !conceptDeets.example3 && "hidden"
                        )}
                      >
                        <Button size="sm">
                          <Volume2 strokeWidth={3} size={24} color="#8bcdea" />
                        </Button>
                        <p className="text-lg font-normal">
                          {conceptDeets.example3}
                        </p>
                      </div>
                      <div />
                      <div
                        className={cn(
                          "flex gap-3 mt-2 mb-3",
                          !conceptDeets.example4 && "hidden"
                        )}
                      >
                        <Button size="sm">
                          <Volume2 strokeWidth={3} size={24} color="#8bcdea" />
                        </Button>
                        <p className="text-lg font-normal">
                          {conceptDeets.example4}
                        </p>
                      </div>
                      <div />
                      <div
                        className={cn(
                          "text-lg font-medium mb-4 mt-4",
                          !conceptDeets.note2 && "hidden"
                        )}
                      >
                        {conceptDeets.note2}
                      </div>
                      <div />
                      <div
                        className={cn(
                          "flex gap-3 mt-2 mb-3",
                          !conceptDeets.example5 && "hidden"
                        )}
                      >
                        <Button size="sm">
                          <Volume2 strokeWidth={3} size={24} color="#8bcdea" />
                        </Button>
                        <p className="text-lg font-normal">
                          {conceptDeets.example5}
                        </p>
                      </div>
                      <div />
                      <div
                        className={cn(
                          "flex gap-3 mt-2 mb-3",
                          !conceptDeets.example6 && "hidden"
                        )}
                      >
                        <Button size="sm">
                          <Volume2 strokeWidth={3} size={24} color="#8bcdea" />
                        </Button>
                        <p className="text-lg font-normal">
                          {conceptDeets.example6}
                        </p>
                      </div>
                      <div />
                      <div
                        className={cn(
                          "text-lg font-medium mb-4 mt-4",
                          !conceptDeets.note3 && "hidden"
                        )}
                      >
                        {conceptDeets.note3}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
