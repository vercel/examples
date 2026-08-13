"use client";

import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~components/ui/accordion";

interface TimelineItemProps {
  title: string;
  summary: string;
  children: React.ReactNode;
}

function TimelineItem({ title, summary, children }: TimelineItemProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    triggerRef.current?.click();
  };

  return (
    <AccordionItem value={title} className="border-none pb-2">
      <div className="relative">
        {/* Title + summary + chevron (click to toggle) */}
        <div className="cursor-pointer" onClick={handleClick}>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-lg mb-1">{title}</h4>
            <AccordionTrigger ref={triggerRef} className="hover:no-underline py-0 shrink-0 mt-1" />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Expanded content */}
        <AccordionContent>
          <div className="mt-4 rounded-lg bg-muted/50 px-5 py-4">
            <div className="prose dark:prose-invert prose-sm max-w-none [&>p]:mb-3 [&>p]:leading-relaxed [&>ul]:my-2 [&>blockquote]:my-3">
              {children}
            </div>
          </div>
        </AccordionContent>
      </div>
    </AccordionItem>
  );
}

interface TimelineProps {
  children: React.ReactNode;
}

function Timeline({ children }: TimelineProps) {
  return (
    <Accordion type="multiple" className="not-prose my-8 space-y-6">
      {children}
    </Accordion>
  );
}

export { Timeline, TimelineItem };
