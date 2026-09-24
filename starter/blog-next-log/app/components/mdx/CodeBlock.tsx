"use client";

import { useState, useRef } from "react";

export function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const code = preRef.current?.querySelector("code")?.textContent || "";
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-muted/80 hover:bg-muted text-muted-foreground"
        aria-label="Copy code"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre ref={preRef} {...props} />
    </div>
  );
}
