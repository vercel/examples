"use client";

import ErrorComponent from "@/components/general/error";

export default function GeneralPageError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return <ErrorComponent title="Error loading page" error={error} />;
}
