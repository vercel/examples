"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import vercelSvg from "@/app/vercel.svg";

function Circle() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.25 8C15.25 12.0041 12.0041 15.25 8 15.25C3.99594 15.25 0.75 12.0041 0.75 8C0.75 3.99594 3.99594 0.75 8 0.75C12.0041 0.75 15.25 3.99594 15.25 8Z"
        stroke="var(--secondary)"
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg
      aria-hidden="true"
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM11.5303 6.53033L12.0607 6L11 4.93934L10.4697 5.46967L6.5 9.43934L5.53033 8.46967L5 7.93934L3.93934 9L4.46967 9.53033L5.96967 11.0303C6.26256 11.3232 6.73744 11.3232 7.03033 11.0303L11.5303 6.53033Z"
        fill="var(--secondary)"
      />
    </svg>
  );
}

export default function Home() {
  const [nextUrl, setNextUrl] = useState("#");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;

    if (host !== "localhost") {
      setNextUrl(
        `https://vercel.com/vercel-tutor/step?origin=${encodeURIComponent(
          host
        )}&stepName=helpful-links`
      );
    }
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-10 row-start-2 max-w-2xl w-full font-[family-name:var(--font-geist-sans)]">
        <Image
          className="invert dark:invert-0"
          src={vercelSvg}
          alt="Vercel logo"
          width={50}
          height={50}
          priority
        />
        <div className="text-left font-[family-name:var(--font-geist-sans)] leading-relaxed">
          <h1 className="mb-6 font-semibold">
            Congratulations! You&apos;ve created your first preview deployment.
          </h1>
          <ul>
            <li className="flex gap-3 items-start mb-6">
              <span className="inline-flex mt-[0.3rem]">
                <Check />
              </span>
              <span className="text-secondary">
                <del>
                  Next, let&apos;s try to improve this page. Maybe the triangle
                  logo is too big. To make it easy for you, we&apos;ve already
                  created a pull request to make the triangle smaller. Check it
                  out:
                </del>
              </span>
            </li>
            <li className="flex gap-3 items-start mb-6">
              <span className="inline-flex mt-[0.3rem]">
                <Circle />
              </span>
              <span className="text-secondary">
                Vercel lets you collaborate with others by commenting directly
                on a preview deployment. Press{" "}
                <span className="text-foreground">“c”</span> on your keyboard
                and click on the triangle logo at the top. Leave a comment like{" "}
                <span className="text-foreground">
                  “The triangle looks much better now!”
                </span>
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="inline-flex mt-[0.3rem]">
                <Circle />
              </span>
              <span className="text-secondary">
                Once you&apos;re done commenting, let&apos;s push one more
                commit to add some helpful links on this page, and then merge
                the pull request.
              </span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc] h-12 font-[family-name:var(--font-geist-sans)]"
            href={nextUrl}
            onClick={(e) => {
              if (isLoading) {
                e.preventDefault();
              } else {
                setIsLoading(true);
              }
            }}
          >
            {isLoading ? "Loading…" : "Push Commit and Merge Pull Request"}
          </a>
          <a
            className="font-[family-name:var(--font-geist-sans)] text-secondary hover:underline flex items-center justify-center h-12 font-medium"
            href="https://vercel.com/dashboard?utm_source=vercel-tutor&utm_medium=template&utm_campaign=vercel-tutor"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
