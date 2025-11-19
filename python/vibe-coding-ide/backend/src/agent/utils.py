import os
from typing import Any


def build_project_input(
    query: str,
    project: dict[str, str],
    prior_assistant_messages: list[Any] | None = None,
) -> str:
    """Render a multi-file project into a single prompt-friendly string.

    The format lists all file paths first, then prints each file's contents with line numbers.
    """
    prior_block = ""
    if prior_assistant_messages:
        # Accept either list[str] (legacy assistant-only) or list[dict{role,content}] (full dialogue)
        if isinstance(
            prior_assistant_messages[0] if len(prior_assistant_messages) > 0 else None,
            dict,
        ):
            lines: list[str] = []
            for m in prior_assistant_messages:  # type: ignore[assignment]
                role = str(m.get("role", ""))
                content = str(m.get("content", ""))
                if not content:
                    continue
                lines.append(f"- {role}: {content}")
            if lines:
                prior_block = (
                    "\n---\nPrevious conversation (for context):\n"
                    + "\n".join(lines)
                    + "\n"
                )
        else:
            joined = "\n\n".join([f"- {m}" for m in prior_assistant_messages])
            prior_block = (
                f"\n---\nPrevious assistant answers (for context only):\n{joined}\n"
            )

    # Compose a bounded project view to stay under model limits
    max_total_chars = int(os.getenv("AGENT_MAX_PROJECT_CHARS", "60000"))
    max_per_file_chars = int(os.getenv("AGENT_MAX_PER_FILE_CHARS", "10000"))
    max_list_entries = int(os.getenv("AGENT_MAX_PATH_LIST", "500"))

    sorted_paths = sorted(project.keys())
    # Truncate path list for very large projects; include a tail note
    listed_paths = sorted_paths[:max_list_entries]
    file_list = "\n".join(
        listed_paths
        + (
            [f"... ({len(sorted_paths) - len(listed_paths)} more omitted)"]
            if len(sorted_paths) > len(listed_paths)
            else []
        )
    )

    files_rendered: list[str] = []
    remaining = max_total_chars
    for path in sorted_paths:
        if remaining <= 0:
            break
        content = project[path] or ""
        c = (
            content
            if len(content) <= max_per_file_chars
            else content[:max_per_file_chars]
        )
        rendered = f"FILE: {path}\n{display_code_with_line_numbers(c)}"
        if len(rendered) > remaining:
            # last-chance trim
            head = max(0, remaining - len(f"FILE: {path}\n"))
            c2 = (content or "")[: max(0, head)]
            rendered = f"FILE: {path}\n{display_code_with_line_numbers(c2)}"
        files_rendered.append(rendered)
        remaining -= len(rendered)

    # Trim prior messages block to avoid overflow
    max_history_chars = int(os.getenv("AGENT_MAX_HISTORY_CHARS", "20000"))
    prior_block_trimmed = prior_block
    if len(prior_block_trimmed) > max_history_chars:
        prior_block_trimmed = prior_block_trimmed[-max_history_chars:]

    return (
        "Project files (paths):\n"
        f"{file_list}\n---\n"
        "Project contents (with line numbers):\n"
        f"\n\n".join(files_rendered)
        + "\n---\n"
        + f"Query: {query}{prior_block_trimmed}"
        + "\n---\nGuidance: For code changes, always call edit_code(file_path, find, find_start_line, find_end_line, replace) with an exact line range and the precise text to replace. Do not include line numbers in replacement text. For multiple non-adjacent changes, call edit_code multiple times. Preserve existing formatting and make minimal, targeted edits.\nIf the user requests a new feature, large refactor, or rebuild, you may also use create_file, rename_file/rename_folder, and delete_file/delete_folder. Prefer archiving via rename into a 'legacy/' path over deletion unless the user explicitly wants removal. After moves, update imports/usages with edit_code, and consider request_code_execution to validate."
    )


def display_code_with_line_numbers(code: str) -> str:
    return "\n".join([f"[{i + 1}]{line}" for i, line in enumerate(code.split("\n"))])


# ----------------------------
# Ignore pattern utilities
# ----------------------------

DEFAULT_AGENT_IGNORE_PATTERNS: list[str] = [
    "__pycache__/",
    "*.pyc",
    ".DS_Store",
    "node_modules/",
    "vendor/",
    "dist/",
    "build/",
    ".venv/",
    "venv/",
    "env/",
    "*.log",
    ".bundle/",
    "tmp/",
    "log/",
    "logs/",
    "coverage/",
    ".cache/",
    ".next/",
    "public/assets/",
    ".git/",
]


def _parse_ignore_lines(text: str) -> list[str]:
    lines: list[str] = []
    if not text:
        return lines
    for raw in text.splitlines():
        s = raw.strip()
        if not s or s.startswith("#"):
            continue
        lines.append(s)
    return lines


def make_ignore_predicate(project: dict[str, str]) -> "callable[[str], bool]":
    """Create a simple ignore predicate based on `.agentignore`, `.gitignore`, and defaults.

    Supported patterns (subset):
    - Trailing-slash directory rules, e.g. `node_modules/`, `__pycache__/`
    - Simple filenames, e.g. `.DS_Store`
    - Basic `*`/`?` globs on basenames, e.g. `*.pyc`, `*.log`
    The semantics are intentionally simple and operate on basenames for globs.
    """

    agentignore = project.get(".agentignore", "") or ""
    gitignore = project.get(".gitignore", "") or ""
    patterns: list[str] = [
        *DEFAULT_AGENT_IGNORE_PATTERNS,
        *_parse_ignore_lines(gitignore),
        *_parse_ignore_lines(agentignore),
    ]

    # Also include nested ignore files by prefixing their folder path onto rules
    try:
        for path, text in project.items():
            if not path or "/.gitignore" not in path and "/.agentignore" not in path:
                continue
            # folder prefix (strip the ".gitignore" or ".agentignore" filename)
            base = path.rsplit("/", 1)[0].lstrip("/")
            if not base:
                continue
            for rule in _parse_ignore_lines(text or ""):
                r = rule.strip()
                if not r:
                    continue
                if r.endswith("/"):
                    # directory rule stays a directory rule under base
                    patterns.append(f"{base}/{r}")
                else:
                    # file/glob rule under base; keep relative to base
                    patterns.append(f"{base}/{r}")
    except Exception:
        # best-effort; ignore errors loading nested ignore files
        pass

    def to_predicate(pat: str):
        pattern = pat.lstrip("/").strip()
        if not pattern:
            return lambda _p: False

        # Directory match (e.g. foo/). If pattern includes a slash, treat as anchored path prefix.
        if pattern.endswith("/"):
            directory = pattern[:-1].lstrip("/")

            def _dir(path: str) -> bool:
                n = (path or "").lstrip("/")
                if not directory:
                    return False
                if "/" in directory:
                    # anchored subpath: match exact or prefix (e.g., "frontend/node_modules/")
                    return n == directory or n.startswith(directory + "/")
                # segment match anywhere (e.g., any "node_modules" segment in the path)
                parts = n.split("/") if n else []
                return directory in parts

            return _dir

        # Exact basename match
        if ("*" not in pattern) and ("?" not in pattern):

            def _exact(path: str) -> bool:
                n = (path or "").lstrip("/")
                base = n.split("/")[-1] if n else n
                return base == pattern

            return _exact

        # Basic glob on basename
        import re

        regex_str = (
            "^"
            + "".join(
                (".*" if tok == "*" else "." if tok == "?" else re.escape(tok))
                for tok in [t for t in re.split(r"([*?])", pattern) if t != ""]
            )
            + "$"
        )
        compiled = re.compile(regex_str)

        def _glob(path: str) -> bool:
            n = (path or "").lstrip("/")
            base = n.split("/")[-1] if n else n
            return bool(compiled.match(base))

        return _glob

    predicates = [to_predicate(p) for p in patterns]

    def is_ignored(path: str) -> bool:
        for fn in predicates:
            try:
                if fn(path):
                    return True
            except Exception:
                # Be conservative: ignore errors and treat as not matching
                continue
        return False

    return is_ignored
