"use client";

import Image from "next/image";
import Link from "next/link";
import CommonConfig from "../config/CommonConfig";
import { getIcon } from "./icons/Icons";
import { playSound } from "@/lib/sound";

interface Props {
  link?: string;
}

// Prefer the Medium entry in CommonConfig.social; fall back to no link if the
// user hasn't configured one. Avoids a stale hardcoded fallback URL.
const mediumLink = CommonConfig.social.find((s) => s.iconKey === "medium")?.link;

export default function AboutWriter({ link }: Props) {
  return (
    <div className="mt-16 border-t pt-10 flex flex-col md:flex-row items-center gap-6">
      {/* Avatar */}
      <Image
        src={CommonConfig.avatarImage}
        alt={CommonConfig.avatarImageAlt}
        width={200}
        height={274}
        className="object-cover"
      />

      {/* Text */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">About the Writer</h2>
        <p className="leading-relaxed mb-4">{CommonConfig.writerBio}</p>

        {link && (
          <Link
            href={link}
            target="_blank"
            className="arrow-nudge inline-block bg-[var(--brand-color)] !text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition duration-300"
            onMouseEnter={() => playSound("hover")}
            onClick={() => playSound("select")}
          >
            Originally posted on Medium
            <span className="arrow-nudge__icon inline-flex">{getIcon("arrowOutward")}</span>
          </Link>
        )}
        {!link && mediumLink && (
          <Link
            href={mediumLink}
            target="_blank"
            className="arrow-nudge inline-block bg-[var(--brand-color)] !text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition duration-300"
            onMouseEnter={() => playSound("hover")}
            onClick={() => playSound("select")}
          >
            Visit my Medium
            <span className="arrow-nudge__icon inline-flex">{getIcon("arrowOutward")}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
