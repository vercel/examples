from vercel.sandbox import AsyncSandbox as Sandbox
from agents import RunContextWrapper
from typing import Any

from src.agent.context import IDEContext
from src.run_store import get_user_sandboxes
from src.agent.utils import make_ignore_predicate


def normalize_sandbox_name(ctx: RunContextWrapper[IDEContext], name: str | None) -> str:
    """Resolve the effective sandbox name.

    Prefers the provided name; otherwise uses the active name if set; otherwise "default".
    Also sets the active name if not set previously.
    """
    n = (name or ctx.context.active_sandbox or "default").strip() or "default"
    if not ctx.context.active_sandbox:
        ctx.context.active_sandbox = n
    return n


async def snapshot_files_into_context(
    ctx: RunContextWrapper[IDEContext], sandbox: Sandbox, name: str
) -> None:
    """Snapshot filesystem and record per-sandbox state."""
    try:
        cmd_ls = await sandbox.run_command(
            "bash",
            [
                "-lc",
                (
                    f"cd {sandbox.sandbox.cwd} && "
                    "find . \\ ( -path './.git/*' -o -path './node_modules/*' -o -path './vendor/*' -o -path './.bundle/*' -o -path './.cache/*' -o -path './tmp/*' -o -path './log/*' -o -path './logs/*' \\ ) -prune -o -type f -printf '%P\t%T@\t%s\n' 2>/dev/null | sort"
                ),
            ],
        )
        out = await cmd_ls.stdout()
        current: dict[str, str] = {}
        files: list[str] = []
        for line in (out or "").splitlines():
            try:
                rel, mtime, size = line.split("\t", 2)
            except ValueError:
                continue
            files.append(rel)
            current[rel] = f"{mtime} {size}"
        # Filter out ignored paths
        try:
            is_ignored = make_ignore_predicate(ctx.context.project or {})
            filtered_files = [p for p in files if not is_ignored(p)]
            filtered_current: dict[str, str] = {
                p: meta for p, meta in current.items() if not is_ignored(p)
            }
        except Exception:
            filtered_files = files
            filtered_current = current
        # Per-sandbox maps
        ctx.context.sandbox_files_map[name] = filtered_files
        ctx.context.sandbox_file_meta_map[name] = filtered_current
    except Exception:
        # Non-fatal
        pass


async def get_sandbox_by_name(ctx: RunContextWrapper[IDEContext], name: str) -> Sandbox:
    """Get or create a sandbox by name (multi-sandbox only)."""
    # If we have a mapping, fetch from cache or remote
    sid = (ctx.context.sandbox_name_to_id or {}).get(name)
    if sid:
        fetched = await Sandbox.get(sandbox_id=sid)
        return fetched
    # Create a new sandbox with stored preferences
    runtime = (ctx.context.sandbox_runtime_map or {}).get(name)
    ports = (ctx.context.sandbox_ports_map or {}).get(name)
    sandbox = await Sandbox.create(
        timeout=600_000,
        runtime=runtime,
        ports=ports,
    )
    ctx.context.sandbox_name_to_id[name] = sandbox.sandbox_id
    ctx.context.active_sandbox = name
    try:
        await sync_project_files(ctx, sandbox)
        await snapshot_files_into_context(ctx, sandbox, name)
    except Exception:
        pass
    return sandbox


async def sync_project_files(
    ctx: RunContextWrapper[IDEContext], sandbox: Sandbox, paths: list[str] | None = None
) -> int:
    """Write project files to sandbox.

    If paths is provided, limits writes to those project-relative files;
    otherwise writes the entire project mapping.
    """
    to_write: list[dict[str, Any]] = []
    written = 0
    project = ctx.context.project or {}
    if paths is None:
        iterator = ((p, c) for p, c in project.items())
    else:
        norm = {str(p).lstrip("./") for p in paths}
        iterator = ((p, project[p]) for p in norm if p in project)
    for path, content in iterator:
        p = str(path).lstrip("./")
        if not p:
            continue
        try:
            b = content.encode("utf-8")
        except Exception:
            b = bytes(str(content), "utf-8")
        to_write.append({"path": p, "content": b})
        written += 1
    for i in range(0, len(to_write), 64):
        chunk = to_write[i : i + 64]
        await sandbox.write_files(chunk)
    return written


def parse_env_list(env_list: list[str] | None) -> dict[str, str]:
    """Parse a list of strings like ["KEY=VALUE", ...] into a mapping.

    Invalid entries or empty keys are ignored. First occurrence of a key wins.
    """
    result: dict[str, str] = {}
    if not env_list:
        return result
    for entry in env_list:
        if not entry:
            continue
        try:
            key, value = entry.split("=", 1)
        except ValueError:
            # skip items without '='
            continue
        k = key.strip()
        if k and k not in result:
            result[k] = value
    return result


async def snapshot_file_changes(
    ctx: RunContextWrapper[IDEContext],
    sandbox: Sandbox,
    name: str,
    *,
    sample_limit: int = 50,
    max_sample_size: int = 200_000,
) -> dict[str, Any]:
    """Compute filesystem changes since last snapshot and optionally sample small files.

    Returns a dict with keys: files, created, updated, deleted, data (base64 samples) or error.
    Also refreshes `sandbox_files_map` and `sandbox_file_meta_map` in the context.
    """
    try:
        cmd_ls = await sandbox.run_command(
            "bash",
            [
                "-lc",
                (
                    f"cd {sandbox.sandbox.cwd} && "
                    "find . \\\ ( -path './.git/*' -o -path './node_modules/*' -o -path './vendor/*' -o -path './.bundle/*' -o -path './.cache/*' -o -path './tmp/*' -o -path './log/*' -o -path './logs/*' -o -path './venv/*' \\\ ) -prune -o -type f -printf '%P\t%T@\t%s\n' 2>/dev/null | sort"
                ),
            ],
        )
        out = await cmd_ls.stdout()
        current: dict[str, str] = {}
        files: list[str] = []
        for line in (out or "").splitlines():
            try:
                rel, mtime, size = line.split("\t", 2)
            except ValueError:
                continue
            files.append(rel)
            current[rel] = f"{mtime} {size}"

        # Diff with previous snapshot
        prev = (ctx.context.sandbox_file_meta_map or {}).get(name, {})
        created: list[str] = []
        updated: list[str] = []
        deleted: list[str] = []
        prev_keys = set(prev.keys())
        cur_keys = set(current.keys())
        for p in sorted(cur_keys - prev_keys):
            created.append(p)
        for p in sorted(prev_keys - cur_keys):
            deleted.append(p)
        for p in sorted(cur_keys & prev_keys):
            if prev.get(p) != current.get(p):
                updated.append(p)

        # Apply ignore rules
        try:
            is_ignored = make_ignore_predicate(ctx.context.project or {})
            files = [p for p in files if not is_ignored(p)]
            current = {p: meta for p, meta in current.items() if not is_ignored(p)}
            created = [p for p in created if not is_ignored(p)]
            updated = [p for p in updated if not is_ignored(p)]
            deleted = [p for p in deleted if not is_ignored(p)]
        except Exception:
            pass

        # Update context snapshots
        ctx.context.sandbox_files_map[name] = files
        ctx.context.sandbox_file_meta_map[name] = current

        # Sample newly created/updated small files
        data: list[dict[str, Any]] = []
        sample_paths = created + updated
        if sample_paths:
            for p in sample_paths[:sample_limit]:
                try:
                    safe = p.replace('"', '\\"')
                    cmd_cat = await sandbox.run_command(
                        "bash",
                        [
                            "-lc",
                            (
                                f"cd {sandbox.sandbox.cwd} && "
                                f"if [ -f '{safe}' ] && [ $(stat -c %s '{safe}' 2>/dev/null || stat -f %z '{safe}') -le {max_sample_size} ]; then "
                                f"base64 '{safe}'; else echo '__SKIP__'; fi"
                            ),
                        ],
                    )
                    b64 = (await cmd_cat.stdout() or "").strip()
                    if b64 and b64 != "__SKIP__":
                        data.append({"path": p, "encoding": "base64", "content": b64})
                except Exception:
                    continue

        return {
            "files": files,
            "created": created,
            "updated": updated,
            "deleted": deleted,
            "data": data,
        }
    except Exception as e:
        return {"files": [], "error": str(e)}


async def autosync_after_fs_change(
    ctx: RunContextWrapper[IDEContext],
    *,
    created_or_updated: list[str] | None = None,
    deleted_files: list[str] | None = None,
    deleted_dirs: list[str] | None = None,
) -> dict[str, Any]:
    """Synchronize recent project changes to any existing sandboxes.

    This function does not create new sandboxes. It only syncs to sandboxes
    already present in the context's sandbox_name_to_id mapping.

    Args:
        created_or_updated: File paths whose latest contents should be written.
        deleted_files: File paths that should be removed with `rm -f`.
        deleted_dirs: Directory paths that should be removed recursively with `rm -rf`.

    Returns:
        A summary dict keyed by sandbox name with counts of writes/deletions.
    """
    summary: dict[str, Any] = {"by_sandbox": {}}
    try:
        name_to_id = dict(ctx.context.sandbox_name_to_id or {})
    except Exception:
        name_to_id = {}

    # If no mappings in current run, try per-user persisted mappings
    if not name_to_id:
        try:
            user_id = (ctx.context.base_payload or {}).get("user_id") or ""
            if user_id:
                name_to_id = await get_user_sandboxes(user_id)
        except Exception:
            pass

    if not name_to_id:
        return summary

    # Normalize inputs
    cu = [str(p).lstrip("./") for p in (created_or_updated or []) if str(p).strip()]
    del_files = [str(p).lstrip("./") for p in (deleted_files or []) if str(p).strip()]
    del_dirs = [str(p).rstrip("/") for p in (deleted_dirs or []) if str(p).strip()]

    # Small helper to safely single-quote paths for bash
    def _sh_quote(p: str) -> str:
        return "'" + p.replace("'", "'\"'\"'") + "'"

    project_map = ctx.context.project or {}

    for sb_name, sid in name_to_id.items():
        try:
            sandbox = await Sandbox.get(sandbox_id=sid)
            # Write created/updated files via shared sync helper
            writes = 0
            if cu:
                writes = await sync_project_files(ctx, sandbox, cu)
                # Best-effort: ensure file mtimes update to trigger watchers (e.g., Next/Turbopack)
                try:
                    touched = " ".join(_sh_quote(p) for p in cu)
                    if touched:
                        base_cwd = sandbox.sandbox.cwd
                        touch_cmd = await sandbox.run_command(
                            "bash",
                            [
                                "-lc",
                                f"cd {base_cwd} && touch -cm -- {touched}",
                            ],
                        )
                        _ = await touch_cmd.wait()
                except Exception:
                    pass

            # Remove deleted files and directories
            removed_files = 0
            removed_dirs = 0
            base_cwd = sandbox.sandbox.cwd
            if del_files:
                quoted = " ".join(_sh_quote(p) for p in del_files)
                cmd_rm_files = await sandbox.run_command(
                    "bash",
                    [
                        "-lc",
                        f"cd {base_cwd} && rm -f -- {quoted}",
                    ],
                )
                _ = await cmd_rm_files.wait()
                removed_files = len(del_files)
            if del_dirs:
                quoted_dirs = " ".join(_sh_quote(d) for d in del_dirs)
                cmd_rm_dirs = await sandbox.run_command(
                    "bash",
                    [
                        "-lc",
                        f"cd {base_cwd} && rm -rf -- {quoted_dirs}",
                    ],
                )
                _ = await cmd_rm_dirs.wait()
                removed_dirs = len(del_dirs)

            # Refresh snapshot for the sandbox
            try:
                await snapshot_files_into_context(ctx, sandbox, sb_name)
            except Exception:
                pass

            summary["by_sandbox"][sb_name] = {
                "writes": writes,
                "deleted_files": removed_files,
                "deleted_dirs": removed_dirs,
            }
        except Exception:
            # Skip failures per-sandbox to avoid blocking the overall operation
            continue

    return summary
