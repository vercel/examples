"use client";

import React, { forwardRef } from "react";
import { MessageSquareQuote } from "lucide-react";
import Section from "../../Section/Section";
import SectionConfig from "../../../config/SectionConfig";
import MotionDiv from "../../animaiton/MotionDiv";
import { getIcon } from "../../icons/Icons";
import { zoomIn } from "../../animaiton/presets";
import { TiltCard } from "../../TiltCard/TiltCard";
import ReviewsConfig, { Review } from "../../../config/ReviewsConfig";
import "./ReviewSection.scss";

const reviewSectionConfig = SectionConfig.find((section) => section.key === "review")!;

/** First letters of the first two whitespace-separated tokens. */
function initialsOf(name: string): string {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "?";
  if (tokens.length === 1) return tokens[0].slice(0, 1).toUpperCase();
  return (tokens[0].slice(0, 1) + tokens[1].slice(0, 1)).toUpperCase();
}

/**
 * Glass testimonial card. The 3D tilt behavior comes from the shared
 * TiltCard wrapper — this component only owns the card's content.
 */
function ReviewCard({ review }: { review: Review }) {
  const { reviewer } = review;
  const initials = initialsOf(reviewer.name);

  return (
    <TiltCard className="tilt-card review-card glass-card">
      <span className="review-card__quote-mark" aria-hidden="true">
        {getIcon("formatQuote")}
      </span>

      <blockquote className="review-card__body">{review.quote}</blockquote>

      {review.footnote && <p className="review-card__footnote">{review.footnote}</p>}

      <div className="review-card__footer">
        <span className="review-avatar" aria-hidden="true">
          {initials}
        </span>
        <span className="review-attribution">
          <span className="review-attribution__name">{reviewer.name}</span>
          <span className="review-attribution__meta">
            {reviewer.title} · {reviewer.company}
          </span>
        </span>
      </div>
    </TiltCard>
  );
}

const ReviewSection = forwardRef<HTMLDivElement>((_, ref) => (
  <Section ref={ref} sectionConfig={reviewSectionConfig}>
    <h3 className="reviews-intro">
      <MessageSquareQuote /> What do others say?
    </h3>
    <div className="reviews-grid">
      {ReviewsConfig.reviews.map((review, i) => (
        <MotionDiv
          key={review.reviewer.name}
          variants={zoomIn}
          delay={i * 0.12}
          className="reviews-grid__cell"
        >
          <ReviewCard review={review} />
        </MotionDiv>
      ))}
    </div>
  </Section>
));

ReviewSection.displayName = "ReviewSection";

export default ReviewSection;
