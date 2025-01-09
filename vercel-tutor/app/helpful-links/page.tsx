"use client";

import Image from "next/image";
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

export default function Home() {
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
            Let&apos;s ship things on Vercel.
          </h1>
          <ul>
            <li className="flex gap-3 items-start">
              <span className="inline-flex mt-[0.3rem]">
                <Circle />
              </span>
              <span className="text-secondary">
                Explore our plans and documentation to learn more.
              </span>
            </li>
          </ul>
        </div>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground font-medium text-background hover:bg-[#383838] dark:hover:bg-[#ccc] h-12 font-[family-name:var(--font-geist-sans)]"
            href="https://vercel.com/pricing?utm_source=vercel-tutor&utm_medium=template&utm_campaign=vercel-tutor"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Plans and Pricing
          </a>
          <a
            className="w-full rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent h-12"
            href="https://vercel.com/docs?utm_source=vercel-tutor&utm_medium=template&utm_campaign=vercel-tutor"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Documentation
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-secondary"
          href="https://vercel.com/dashboard?utm_source=vercel-tutor&utm_medium=template&utm_campaign=vercel-tutor"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to Dashboard →
        </a>
      </footer>
    </div>
  );
}
