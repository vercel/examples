import json
from typing import Any

from agents import function_tool, RunContextWrapper
from src.agent.context import IDEContext
from src.sandbox.utils import autosync_after_fs_change


@function_tool
async def think(ctx: RunContextWrapper[IDEContext], thoughts: str) -> str:
    """Record a concise plan for the current task.

    Use this before non-trivial changes to outline intent (1-3 sentences).
    Keep it brief and high-signal; do not include secrets, urls, or sensitive data.

    Args:
        thoughts: Short plan or reasoning to log.
    Returns:
        The recorded plan text.
    """
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "think",
            "arguments": {"thoughts": thoughts},
        }
    )
    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "think",
            "output_data": thoughts,
        }
    )
    return thoughts


def _perform_edit_code(file_content: str, args: dict[str, Any]) -> dict[str, Any]:
    lines = file_content.split("\n")
    start_idx = int(args["find_start_line"]) - 1
    end_idx = int(args["find_end_line"]) - 1
    if start_idx < 0 or end_idx >= len(lines) or start_idx > end_idx:
        return {
            "error": "Line numbers out of range or invalid",
            "total_lines": len(lines),
        }
    existing_text = "\n".join(lines[start_idx : end_idx + 1])
    if str(args["find"]) not in existing_text:
        return {
            "error": "Find text not found at specified lines",
            "existing_text": existing_text,
        }
    new_text = existing_text.replace(str(args["find"]), str(args["replace"]))
    new_lines = lines[:start_idx] + new_text.split("\n") + lines[end_idx + 1 :]
    new_code = "\n".join(new_lines)
    return {
        "find": str(args["find"]),
        "find_start_line": int(args["find_start_line"]),
        "find_end_line": int(args["find_end_line"]),
        "replace": str(args["replace"]),
        "old_text": existing_text,
        "new_text": new_text,
        "new_code": new_code,
    }


@function_tool
async def edit_code(
    ctx: RunContextWrapper[IDEContext],
    file_path: str,
    find: str,
    find_start_line: int,
    find_end_line: int,
    replace: str,
) -> str:
    """Make a precise, in-place change within a file.

    Behavior:
    - Operates only on lines [find_start_line, find_end_line] (1-based, inclusive).
    - 'find' must appear within that range; only that matched text is replaced.
    - 'replace' is the full new text for the matched portion; no line numbers.
    - Content outside the selected range is preserved exactly.

    Guidelines:
    - Choose the smallest line range that brackets the intended change.
    - For multiple non-adjacent edits, call this tool multiple times.
    - Preserve formatting, imports, and surrounding structure.

    Args:
        file_path: Project-relative file path.
        find: Exact text to replace within the specified range.
        find_start_line: Start line (1-based, inclusive).
        find_end_line: End line (1-based, inclusive).
        replace: Replacement text (no line numbers).
    Returns:
        JSON string describing the edit or an error.
    """
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    args = {
        "file_path": file_path,
        "find": find,
        "find_start_line": find_start_line,
        "find_end_line": find_end_line,
        "replace": replace,
    }
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "edit_code",
            "arguments": args,
        }
    )
    if file_path not in ctx.context.project:
        output = {"error": f"File not found: {file_path}"}
    else:
        output = _perform_edit_code(ctx.context.project[file_path], args)
        if "new_code" in output:
            ctx.context.project[file_path] = output["new_code"]
            # enrich output with file info for the UI
            output = {
                **output,
                "file_path": file_path,
                "new_file_content": output["new_code"],
            }
            # best-effort autosync to running sandboxes
            try:
                await autosync_after_fs_change(
                    ctx, created_or_updated=[file_path]
                )
            except Exception:
                pass
    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "edit_code",
            "output_data": output,
        }
    )
    return json.dumps(output)
