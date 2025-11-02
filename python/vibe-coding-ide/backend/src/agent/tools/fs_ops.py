import json

from agents import function_tool, RunContextWrapper
from src.agent.context import IDEContext
from src.sandbox.utils import autosync_after_fs_change


@function_tool
async def create_file(
    ctx: RunContextWrapper[IDEContext], file_path: str, content: str
) -> str:
    """Create a new file with the provided content (for new features or rebuilds).

    Guidelines:
    - Provide the full file contents. Create siblings/modules as needed.
    - Prefer small, focused files in idiomatic locations.
    - Does not overwrite an existing file; returns an error instead. Use rename_* to archive or move old files first.

    Args:
        file_path: Project-relative path for the new file.
        content: Full content of the file.
    Returns:
        JSON string describing the creation or an error.
    """
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    args = {"file_path": file_path, "content": content}
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "create_file",
            "arguments": args,
        }
    )

    if file_path in ctx.context.project:
        output = {"error": f"File already exists: {file_path}", "file_path": file_path}
    else:
        ctx.context.project[file_path] = str(content)
        # best-effort autosync to running sandboxes
        output = {
            "file_path": file_path,
            "new_file_content": str(content),
            "created": True,
        }
        try:
            await autosync_after_fs_change(ctx, created_or_updated=[file_path])
        except Exception:
            pass

    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "create_file",
            "output_data": output,
        }
    )
    return json.dumps(output)


@function_tool
async def delete_file(ctx: RunContextWrapper[IDEContext], file_path: str) -> str:
    """Delete an existing file (use sparingly; archive first when possible).

    Use with caution. Prefer edits or renames when appropriate. For rebuilds, consider moving old code into a `legacy/` path instead of deleting unless the user insists on removal.

    Args:
        file_path: Path of the file to remove.
    Returns:
        JSON string indicating deletion or an error.
    """
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    args = {"file_path": file_path}
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "delete_file",
            "arguments": args,
        }
    )

    if file_path not in ctx.context.project:
        output = {"error": f"File not found: {file_path}", "file_path": file_path}
    else:
        # delete the file
        del ctx.context.project[file_path]
        # best-effort autosync to running sandboxes
        output = {"file_path": file_path, "deleted": True}
        try:
            await autosync_after_fs_change(ctx, deleted_files=[file_path])
        except Exception:
            pass

    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "delete_file",
            "output_data": output,
        }
    )
    return json.dumps(output)


@function_tool
async def rename_file(
    ctx: RunContextWrapper[IDEContext], old_path: str, new_path: str
) -> str:
    """Rename or move a file.

    Behavior:
    - Moves content from old_path to new_path; may overwrite if destination exists.
    - Does not automatically update imports/references; follow up with edit_code().

    Args:
        old_path: Current file path.
        new_path: Destination path.
    Returns:
        JSON string describing the rename or an error.
    """
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    args = {"old_path": old_path, "new_path": new_path}
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "rename_file",
            "arguments": args,
        }
    )

    if old_path not in ctx.context.project:
        output = {
            "error": f"File not found: {old_path}",
            "old_path": old_path,
            "new_path": new_path,
        }
    else:
        content = ctx.context.project[old_path]
        overwritten = new_path in ctx.context.project
        if overwritten:
            # Overwrite destination
            ctx.context.project[new_path] = content
        else:
            ctx.context.project[new_path] = content
        del ctx.context.project[old_path]
        # best-effort autosync to running sandboxes
        output = {
            "old_path": old_path,
            "new_path": new_path,
            "renamed": True,
            **({"overwritten": True} if overwritten else {}),
        }
        try:
            await autosync_after_fs_change(
                ctx, created_or_updated=[new_path], deleted_files=[old_path]
            )
        except Exception:
            pass

    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "rename_file",
            "output_data": output,
        }
    )
    return json.dumps(output)


@function_tool
async def create_folder(ctx: RunContextWrapper[IDEContext], folder_path: str) -> str:
    """Declare a folder in the virtual project (no files created).

    This is a UI-level structure; it does not write files. Fails if a file with
    the same path exists.

    Args:
        folder_path: Folder path to declare.
    Returns:
        JSON string indicating creation or an error.
    """
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    args = {"folder_path": folder_path}
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "create_folder",
            "arguments": args,
        }
    )

    # Folders are not tracked in project mapping; just emit event for UI
    # But validate that it does not conflict with existing file
    conflict = folder_path in ctx.context.project
    if conflict:
        output = {
            "error": f"Conflicts with existing file: {folder_path}",
            "folder_path": folder_path,
        }
    else:
        output = {"folder_path": folder_path, "created": True}

    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "create_folder",
            "output_data": output,
        }
    )
    return json.dumps(output)


@function_tool
async def delete_folder(ctx: RunContextWrapper[IDEContext], folder_path: str) -> str:
    """Delete a folder and all files beneath it in the project mapping (for large cleanups only).

    Use with caution; this removes every file under the path. Prefer rename_folder to archive first when possible.

    Args:
        folder_path: Folder path to remove.
    Returns:
        JSON string including count of removed files.
    """
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    args = {"folder_path": folder_path}
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "delete_folder",
            "arguments": args,
        }
    )

    normalized = folder_path.rstrip("/")
    removed = 0
    removed_paths: list[str] = []
    remaining: dict[str, str] = {}
    for path, content in ctx.context.project.items():
        if path == normalized or path.startswith(normalized + "/"):
            removed += 1
            removed_paths.append(path)
            continue
        remaining[path] = content
    ctx.context.project = remaining

    # best-effort autosync to running sandboxes
    output = {"folder_path": folder_path, "deleted": True, "removed_files": removed}
    try:
        await autosync_after_fs_change(
            ctx, deleted_files=removed_paths, deleted_dirs=[normalized]
        )
    except Exception:
        pass

    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "delete_folder",
            "output_data": output,
        }
    )
    return json.dumps(output)


@function_tool
async def rename_folder(
    ctx: RunContextWrapper[IDEContext], old_path: str, new_path: str
) -> str:
    """Rename or move a folder and all contained files.

    Behavior:
    - Rewrites affected file paths by replacing prefix old_path with new_path.
    - Does not update imports or references; follow up with edit_code() as needed.

    Args:
        old_path: Existing folder path.
        new_path: New folder path.
    Returns:
        JSON string describing the rename.
    """
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    args = {"old_path": old_path, "new_path": new_path}
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "rename_folder",
            "arguments": args,
        }
    )

    old_norm = old_path.rstrip("/")
    new_norm = new_path.rstrip("/")
    moved = 0
    next_project: dict[str, str] = {}
    deleted_paths: list[str] = []
    created_paths: list[str] = []
    for path, content in ctx.context.project.items():
        if path == old_norm or path.startswith(old_norm + "/"):
            suffix = path[len(old_norm) :]
            new_file_path = (new_norm + suffix).lstrip("/")
            next_project[new_file_path] = content
            moved += 1
            deleted_paths.append(path)
            created_paths.append(new_file_path)
        else:
            next_project[path] = content
    ctx.context.project = next_project

    # best-effort autosync to running sandboxes
    output = {
        "old_path": old_path,
        "new_path": new_path,
        "renamed": True,
        "moved_files": moved,
    }
    try:
        await autosync_after_fs_change(
            ctx,
            created_or_updated=created_paths,
            deleted_files=deleted_paths,
            deleted_dirs=[old_norm],
        )
    except Exception:
        pass

    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "rename_folder",
            "output_data": output,
        }
    )
    return json.dumps(output)
