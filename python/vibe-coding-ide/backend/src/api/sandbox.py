from typing import Any
import os
import httpx
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from vercel.oidc.aio import get_vercel_oidc_token
from vercel.sandbox import AsyncSandbox as Sandbox

from src.agent.utils import make_ignore_predicate
from src.run_store import get_user_project_sandboxes


router = APIRouter(prefix="/api/play", tags=["play"])


class SyncRequest(BaseModel):
    """Sync current editor project files into an existing sandbox for a user.

    If name is omitted, the first sandbox mapping for the user will be used.
    """

    user_id: str
    project_id: str
    project: dict[str, str]
    name: str | None = None


@router.get("/probe")
async def probe_url(url: str) -> dict[str, Any]:
    """Server-side URL probe.

    Attempts a HEAD request first to avoid downloading the body.
    Some servers do not support HEAD; in that case, fall back to a
    streamed GET to obtain only the status code.
    """
    status_code: int | None = None
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=8.0) as client:
            try:
                resp = await client.request("HEAD", url)
                status_code = int(resp.status_code)
            except Exception:
                # Fall back to a minimal GET (streamed, do not read body)
                try:
                    async with client.stream("GET", url) as resp2:
                        status_code = int(resp2.status_code)
                except Exception:
                    status_code = None
    except Exception:
        status_code = None

    return {"ok": status_code is not None, "status": status_code}


@router.post("/sync")
async def sync_existing_sandbox(request: SyncRequest) -> dict[str, Any]:
    """Push editor project files into ALL mapped sandboxes for this user (or a specific name if provided).

    This enables a project-level "Sync sandbox" action to refresh multiple live sandboxes at once.
    """
    oidc_token = await get_vercel_oidc_token()
    os.environ["VERCEL_OIDC_TOKEN"] = oidc_token

    mappings = {}
    mappings = await get_user_project_sandboxes(request.user_id, request.project_id)
    if not mappings:
        raise HTTPException(status_code=404, detail="no sandboxes mapped for user")

    # Filter project once (respect ignore rules server-side)
    is_ignored = make_ignore_predicate(request.project or {})
    filtered: dict[str, str] = {
        p: c for p, c in (request.project or {}).items() if (not is_ignored(p)) or (p in {".gitignore", ".agentignore"})
    }

    targets: dict[str, str] = mappings
    if request.name:
        sid = mappings.get(request.name)
        if not sid:
            return {"ok": False, "error": f"sandbox not found for name '{request.name}'"}
        targets = {request.name: sid}

    results: dict[str, Any] = {}
    total_writes = 0
    for name, sid in targets.items():
        try:
            sandbox = await Sandbox.get(sandbox_id=sid)
            files_payload = []
            for path, content in filtered.items():
                try:
                    files_payload.append({"path": path, "content": content.encode("utf-8")})
                except Exception:
                    files_payload.append({"path": path, "content": bytes(str(content), "utf-8")})
            wrote = 0
            touched_paths: list[str] = []
            if files_payload:
                for i in range(0, len(files_payload), 64):
                    chunk = files_payload[i : i + 64]
                    await sandbox.write_files(chunk)
                    wrote += len(chunk)
                    try:
                        # accumulate paths for touch to bump mtimes and trigger watchers
                        for e in chunk:
                            p = e.get("path")
                            if isinstance(p, str):
                                touched_paths.append(p)
                    except Exception:
                        pass
            total_writes += wrote
            # Best-effort: update mtimes for written files to trigger file watchers
            try:
                if touched_paths:
                    # quote paths safely and touch them
                    def _sh_quote(p: str) -> str:
                        return "'" + p.replace("'", "'\"'\"'") + "'"
                    quoted = " ".join(_sh_quote(p) for p in touched_paths)
                    base_cwd = sandbox.sandbox.cwd
                    touch_cmd = await sandbox.run_command_detached(
                        "bash",
                        ["-lc", f"cd {base_cwd} && touch -cm -- {quoted}"],
                    )
                    await touch_cmd.wait()
            except Exception:
                pass
            # Preview hint (first port)
            url = None
            try:
                ports = getattr(sandbox, "ports", None)
                if isinstance(ports, list) and len(ports) > 0 and isinstance(ports[0], int):
                    url = sandbox.domain(ports[0])
            except Exception:
                url = None
            results[name] = {"ok": True, "sandbox_id": sid, **({"preview_url": url} if url else {}), "synced": wrote}
        except Exception as e:
            results[name] = {"ok": False, "error": str(e)}

    return {"ok": True, "by_sandbox": results, "total_synced": total_writes}
