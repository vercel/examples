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

function Toolbar() {
  return (
    <span className="rounded-full border border-secondary bg-[rgba(0,0,0,.8)] w-[24px] h-[24px] inline-flex items-center justify-center align-middle">
      <svg
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-flex"
      >
        <g clip-path="url(#clip0_7590_8914)">
          <circle
            cx="23"
            cy="20"
            r="3.65625"
            fill="white"
            stroke="white"
            stroke-width="1.6875"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M23 17.5801L25.4844 21.9277H20.5156L23 17.5801Z"
            fill="#1A1A1A"
          />
        </g>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.75 10H9V11.5H9.75H22.25H23V10H22.25H9.75ZM9.75 20H9V21.5H9.75H17.189C17.0656 21.0206 17 20.5179 17 20H9.75ZM18.126 16.5H9.75H9V15H9.75H19.6822C19.0774 15.4022 18.5497 15.9111 18.126 16.5Z"
          fill="#EDEDED"
        />
        <defs>
          <clipPath id="clip0_7590_8914">
            <rect
              width="9"
              height="9"
              fill="white"
              transform="translate(18.5 15.5)"
            />
          </clipPath>
        </defs>
      </svg>
    </span>
  );
}

export default function Home() {
  const [nextUrl, setNextUrl] = useState("#");
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;

    if (host !== "localhost") {
      setNextUrl(
        `https://vercel.com/vercel-tutor/step?origin=${encodeURIComponent(
          host,
        )}&stepName=helpful-links`,
      );
    } else {
      setIsLocalhost(true);
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
        {isLocalhost ? (
          <div className="text-left font-[family-name:var(--font-geist-sans)] leading-relaxed">
            <h1 className="mb-6 font-semibold">
              Please deploy this template to Vercel to continue.
            </h1>
          </div>
        ) : (
          <>
            <div className="text-left font-[family-name:var(--font-geist-sans)] leading-relaxed">
              <h1 className="mb-6 font-semibold">
                Congratulations! You&apos;ve created your first preview
                deployment.
              </h1>
              <ul>
                <li className="flex gap-3 items-start mb-6">
                  <span className="inline-flex mt-[0.3rem]">
                    <Check />
                  </span>
                  <span className="text-secondary">
                    <del>
                      Next, let&apos;s try to improve this page. Maybe the
                      triangle logo is too big. To make it easy for you,
                      we&apos;ve already created a pull request to make the
                      triangle smaller. Check it out:
                    </del>
                  </span>
                </li>
                <li className="flex gap-3 items-start mb-6">
                  <span className="inline-flex mt-[0.3rem]">
                    <Circle />
                  </span>
                  <span className="text-secondary">
                    Vercel lets you collaborate with others by commenting
                    directly on a preview deployment. First, click the Vercel
                    Toolbar icon <Toolbar /> on the page. Then, select{" "}
                    <span className="text-foreground">“Comment”</span> in the
                    toolbar menu. Now, click on the triangle logo at the top.
                    Leave a comment like{" "}
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
                    commit to add some helpful links on this page, and then
                    merge the pull request.
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
          </>
        )}
      </main>
    </div>
  );
}
