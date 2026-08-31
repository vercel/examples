export type Review = {
  /** Testimonial body. Paragraph breaks are represented as \n\n and honored
   * via the CSS `white-space: pre-line` rule on the card body. */
  quote: string;
  /** Optional muted follow-up shown beneath the quote. */
  footnote?: string;
  reviewer: {
    name: string;
    title: string;
    company: string;
  };
};

export type ReviewsConfigType = {
  reviews: Review[];
};

// Placeholder review — replace each entry's quote / footnote / reviewer with
// real testimonials. The Section renders one card per review in this array.
const ReviewsConfig: ReviewsConfigType = {
  reviews: [
    {
      quote:
        "Replace this with a real testimonial. Keep it specific: what did the person work with you on, and what was the outcome? Two or three short paragraphs reads better than a wall of text.",
      reviewer: {
        name: "Colleague Name",
        title: "Engineering Manager",
        company: "Example Co.",
      },
    },
  ],
};

export default ReviewsConfig;
