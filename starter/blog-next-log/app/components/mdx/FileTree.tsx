"use client";

import {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  Children,
  type ReactNode,
} from "react";

const INDENT = 20;

const DepthContext = createContext(0);

/* ── Lucide-style icons (stroke-based, 24x24) ── */

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-muted-foreground transition-transform duration-200"
      style={{ width: 16, height: 16, transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function FolderIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-muted-foreground"
      style={{ width: 16, height: 16 }}
    >
      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  ) : (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-muted-foreground"
      style={{ width: 16, height: 16 }}
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-muted-foreground"
      style={{ width: 16, height: 16 }}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

/* ── Animated collapse wrapper ── */

function Collapsible({ open, children }: { open: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(open ? "auto" : 0);
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    if (!ref.current) return;
    if (open) {
      const h = ref.current.scrollHeight;
      setHeight(h);
      const timer = setTimeout(() => setHeight("auto"), 200);
      return () => clearTimeout(timer);
    } else {
      setHeight(ref.current.scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  return (
    <div
      ref={ref}
      style={{
        height,
        overflow: "hidden",
        transition: height === "auto" ? "none" : "height 200ms ease",
      }}
    >
      {children}
    </div>
  );
}

/* ── Tree lines ── */

function TreeLine({ depth }: { depth: number }) {
  if (depth === 0) return null;
  return (
    <>
      {Array.from({ length: depth }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0 bottom-0"
          style={{
            left: 20 + i * INDENT,
            width: 1,
            backgroundColor: "var(--border)",
          }}
        />
      ))}
    </>
  );
}

/* ── FileTree (root) ── */

interface FileTreeProps {
  children: ReactNode;
}

function FileTree({ children }: FileTreeProps) {
  return (
    <div
      className="not-prose relative my-8 font-mono text-[13px]"
      style={{ padding: "48px 0" }}
    >
      {/* grid background with edge fade */}
      <div
        className="absolute inset-y-0 -inset-x-8"
        style={{
          backgroundImage: [
            "linear-gradient(color-mix(in srgb, var(--border) 70%, transparent) 1px, transparent 1px)",
            "linear-gradient(90deg, color-mix(in srgb, var(--border) 70%, transparent) 1px, transparent 1px)",
            "linear-gradient(color-mix(in srgb, var(--border) 30%, transparent) 1px, transparent 1px)",
            "linear-gradient(90deg, color-mix(in srgb, var(--border) 30%, transparent) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "96px 96px, 96px 96px, 24px 24px, 24px 24px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div
        className="relative mx-auto max-w-xs overflow-hidden rounded-xl"
        style={{
          backgroundColor: "color-mix(in srgb, var(--background) 60%, transparent)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 0 0 1px color-mix(in srgb, var(--border) 30%, transparent), 0 2px 12px color-mix(in srgb, var(--foreground) 4%, transparent), 0 8px 32px color-mix(in srgb, var(--foreground) 6%, transparent)",
        }}
      >
        <DepthContext.Provider value={0}>{children}</DepthContext.Provider>
      </div>
    </div>
  );
}

/* ── Folder ── */

interface FolderProps {
  name: string;
  defaultOpen?: boolean;
  children?: ReactNode;
}

function Folder({ name, defaultOpen = false, children }: FolderProps) {
  const [open, setOpen] = useState(defaultOpen);
  const depth = useContext(DepthContext);
  const hasChildren = !!children;

  return (
    <div>
      <button
        type="button"
        onClick={() => hasChildren && setOpen((v) => !v)}
        className="relative flex w-full items-center gap-2 text-left transition-colors hover:bg-muted/50 active:scale-[0.99]"
        style={{
          paddingLeft: 12 + depth * INDENT,
          paddingRight: 12,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <TreeLine depth={depth} />
        {hasChildren ? <ChevronIcon open={open} /> : <span style={{ width: 16, height: 16 }} className="shrink-0 inline-block" />}
        <FolderIcon open={open} />
        <span className="text-foreground truncate">{name}</span>
      </button>
      {hasChildren && (
        <Collapsible open={open}>
          <DepthContext.Provider value={depth + 1}>
            {children}
          </DepthContext.Provider>
        </Collapsible>
      )}
    </div>
  );
}

/* ── File ── */

interface FileProps {
  name: string;
}

function File({ name }: FileProps) {
  const depth = useContext(DepthContext);

  return (
    <div
      className="relative flex items-center gap-2"
      style={{
        paddingLeft: 12 + depth * INDENT,
        paddingRight: 12,
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      <TreeLine depth={depth} />
      <span style={{ width: 16, height: 16 }} className="shrink-0 inline-block" />
      <FileIcon />
      <span className="text-foreground truncate">{name}</span>
    </div>
  );
}

export { FileTree, Folder, File };
