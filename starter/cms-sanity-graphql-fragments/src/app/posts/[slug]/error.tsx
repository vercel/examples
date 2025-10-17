"use client";

import ErrorComponent from "@/components/general/error";

export default function PostErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return <ErrorComponent title="Error loading post" error={error} />;
}
