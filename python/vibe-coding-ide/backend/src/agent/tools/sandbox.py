import json
import asyncio
import time

import httpx
from vercel.sandbox import AsyncSandbox as Sandbox
from agents import function_tool, RunContextWrapper

from src.agent.context import IDEContext
from src.sandbox.runtimes import (
    create_synthetic_ruby_runtime,
    create_synthetic_go_runtime,
)
from src.sandbox.utils import (
    normalize_sandbox_name,
    get_sandbox_by_name,
    sync_project_files,
    snapshot_files_into_context,
    parse_env_list,
    snapshot_file_changes,
)
from src.run_store import (
    upsert_user_sandbox,
    remove_user_sandbox,
    upsert_user_project_sandbox,
    remove_user_project_sandbox,
)
from src.sandbox.command import (
    select_safe_cwd,
    detect_language_usage,
    select_rails_app_cwd,
    ensure_python_tooling,
    maybe_wrap_with_bundler,
    infer_ready_patterns_and_port,
    adjust_rails_server_command,
    ensure_go_tooling,
    ensure_ruby_tooling,
)


@function_tool
async def sandbox_create(
    ctx: RunContextWrapper[IDEContext],
    runtime: str | None = None,
    ports: list[int] | None = None,
    timeout_ms: int | None = 600_000,
    name: str | None = None,
) -> str:
    """Create a persistent sandbox and remember it for this run.

    Args:
        runtime: Optional runtime, e.g. "node22", "python3.13".
        ports: Optional list of ports to expose (for previews).
        timeout_ms: Sandbox lifetime timeout in milliseconds.
    Returns:
        JSON with sandbox details.
    """
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    args = {"runtime": runtime, "ports": ports, "timeout_ms": timeout_ms, "name": name}
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "sandbox_create",
            "arguments": args,
        }
    )

    sb_name = normalize_sandbox_name(ctx, name)

    # Synthetic runtimes: if a Ruby or Go runtime is requested, create on a Node runtime and bootstrap
    requested_runtime = runtime
    is_synthetic_ruby = bool(
        requested_runtime and str(requested_runtime).lower().startswith("ruby")
    )
    is_synthetic_go = bool(
        requested_runtime and str(requested_runtime).lower().startswith("go")
    )
    effective_runtime = requested_runtime
    if is_synthetic_ruby or is_synthetic_go:
        # Default to node22 as the base image for bootstrapping
        effective_runtime = "node22"

    sandbox = await Sandbox.create(
        timeout=timeout_ms or 600_000,
        runtime=effective_runtime,
        ports=ports,
    )
    # Map and set active sandbox
    ctx.context.sandbox_name_to_id[sb_name] = sandbox.sandbox_id
    ctx.context.active_sandbox = sb_name
    # Persist preferences per-sandbox
    if requested_runtime or effective_runtime:
        ctx.context.sandbox_runtime_map[sb_name] = (
            requested_runtime or effective_runtime
        )  # type: ignore[arg-type]
    if ports is not None:
        ctx.context.sandbox_ports_map[sb_name] = ports

    # Sync project files into sandbox cwd
    synced = 0
    try:
        synced = await sync_project_files(ctx, sandbox)
        await snapshot_files_into_context(ctx, sandbox, sb_name)
        ctx.context.events.append(
            {
                "phase": "log",
                "tool_id": tool_id,
                "name": "sandbox_create",
                "data": f"Synced {synced} project files to sandbox.\n",
            }
        )
    except Exception as e:
        ctx.context.events.append(
            {
                "phase": "log",
                "tool_id": tool_id,
                "name": "sandbox_create",
                "data": f"Project sync error: {str(e)}\n",
            }
        )

    # If synthetic Ruby runtime requested, bootstrap Ruby and Bundler now
    if is_synthetic_ruby:
        try:
            await create_synthetic_ruby_runtime(ctx, sandbox, sb_name, tool_id)
        except Exception as e:
            ctx.context.events.append(
                {
                    "phase": "log",
                    "tool_id": tool_id,
                    "name": "sandbox_create",
                    "data": f"Ruby bootstrap error: {str(e)}\n",
                }
            )

    # If synthetic Go runtime requested, install Go toolchain now
    if is_synthetic_go:
        try:
            await create_synthetic_go_runtime(ctx, sandbox, sb_name, tool_id)
        except Exception as e:
            ctx.context.events.append(
                {
                    "phase": "log",
                    "tool_id": tool_id,
                    "name": "sandbox_create",
                    "data": f"Go bootstrap error: {str(e)}\n",
                }
            )

    output = {
        "sandbox_id": sandbox.sandbox_id,
        "status": getattr(sandbox, "status", None),
        "runtime": requested_runtime or effective_runtime,
        "ports": ports,
        "synced_files": synced,
        "name": sb_name,
        **(
            {"synthetic_runtime": True, "effective_runtime": effective_runtime}
            if (is_synthetic_ruby or is_synthetic_go)
            else {}
        ),
    }
    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "sandbox_create",
            "output_data": output,
        }
    )
    # Persist mapping per-user for cross-run autosync
    try:
        user_id = (ctx.context.base_payload or {}).get("user_id") or ""
        project_id = (ctx.context.base_payload or {}).get("project_id") or ""
        if user_id:
            import asyncio as _asyncio

            tasks = [upsert_user_sandbox(user_id, sb_name, sandbox.sandbox_id)]
            if project_id:
                tasks.append(upsert_user_project_sandbox(user_id, project_id, sb_name, sandbox.sandbox_id))
            async def _run_all():
                for c in tasks:
                    try:
                        await c
                    except Exception:
                        pass
            try:
                loop = _asyncio.get_event_loop()
                if loop.is_running():
                    loop.create_task(_run_all())
                else:
                    loop.run_until_complete(_run_all())  # unlikely path
            except RuntimeError:
                _asyncio.run(_run_all())
    except Exception:
        pass
    return json.dumps(output)


@function_tool
async def sandbox_stop(
    ctx: RunContextWrapper[IDEContext], name: str | None = None
) -> str:
    """Stop and release the specified sandbox (or active/default if none provided)."""
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    args = {"name": name}
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "sandbox_stop",
            "arguments": args,
        }
    )
    sb_name = normalize_sandbox_name(ctx, name)
    sid = (ctx.context.sandbox_name_to_id or {}).get(sb_name)
    if not sid:
        output = {"stopped": False, "error": "no sandbox"}
    else:
        try:
            sandbox = await Sandbox.get(sandbox_id=sid)
            await sandbox.stop()
            try:
                await Sandbox.get(sandbox_id=sid)  # best-effort refresh
            except Exception:
                pass
            # Clear mappings
            if sb_name in (ctx.context.sandbox_name_to_id or {}):
                ctx.context.sandbox_name_to_id.pop(sb_name, None)
            if ctx.context.active_sandbox == sb_name:
                ctx.context.active_sandbox = None
            output = {"stopped": True}
        except Exception as e:
            output = {"stopped": False, "error": str(e)}
    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "sandbox_stop",
            "output_data": output,
        }
    )
    # Remove mapping from per-user store
    try:
        user_id = (ctx.context.base_payload or {}).get("user_id") or ""
        project_id = (ctx.context.base_payload or {}).get("project_id") or ""
        if user_id and sb_name:
            import asyncio as _asyncio

            tasks = [remove_user_sandbox(user_id, sb_name)]
            if project_id:
                tasks.append(remove_user_project_sandbox(user_id, project_id, sb_name))
            async def _run_all():
                for c in tasks:
                    try:
                        await c
                    except Exception:
                        pass
            try:
                loop = _asyncio.get_event_loop()
                if loop.is_running():
                    loop.create_task(_run_all())
                else:
                    loop.run_until_complete(_run_all())
            except RuntimeError:
                _asyncio.run(_run_all())
    except Exception:
        pass
    return json.dumps(output)


@function_tool
async def sandbox_run(
    ctx: RunContextWrapper[IDEContext],
    command: str,
    cwd: str | None = None,
    env: list[str] | None = None,
    detached: bool = False,
    ready_patterns: list[str] | None = None,
    port: int | None = None,
    wait_timeout_ms: int | None = 30_000,
    stream_logs: bool = True,
    name: str | None = None,
    auto_python_ensure: bool = True,
    auto_ready_patterns: bool = True,
    auto_ruby_ensure: bool = True,
    auto_go_ensure: bool = True,
) -> str:
    """Run a shell command in the active sandbox, optionally streaming logs and detecting readiness.

    Args:
        command: Shell command to run.
        cwd: Working directory inside sandbox; defaults to sandbox cwd.
        env: Extra environment variables.
        detached: If true, do not wait for process exit.
        ready_patterns: If provided, return after any pattern appears in logs.
        port: If provided, compute preview URL when ready (sandbox.domain(port)).
        wait_timeout_ms: Max time to wait for readiness when detached.
        stream_logs: If true, stream logs into the run timeline.
        name: Optional label for the process.
        auto_python_ensure: Auto-ensure Python tooling when command indicates Python usage.
        auto_ready_patterns: Auto-detect common readiness messages for certain servers.
        auto_ruby_ensure: Auto-ensure Ruby/Bundler when command indicates Ruby usage.
    Returns:
        JSON with status, exit_code (if attached), and preview_url if detected.
    """
    tool_id = f"tc_{len(ctx.context.events) + 1}"

    sb_name = normalize_sandbox_name(ctx, name)
    sandbox = await get_sandbox_by_name(ctx, sb_name)
    # Resolve cwd safely: default to sandbox cwd; allow only subdirs under it
    requested_cwd = cwd
    base_cwd = sandbox.sandbox.cwd
    safe_cwd = select_safe_cwd(requested_cwd, base_cwd)

    uses_python, uses_ruby, uses_go = detect_language_usage(command)

    # Heuristic: auto-select Rails app root as cwd when running Rails/Bundler commands without an explicit cwd
    if uses_ruby and (requested_cwd is None or str(requested_cwd).strip() == ""):
        safe_cwd = select_rails_app_cwd(ctx, sb_name, base_cwd, safe_cwd, command)

    args = {
        "command": command,
        "cwd": safe_cwd,
        "requested_cwd": requested_cwd,
        "env": env,
        "detached": detached,
        "ready_patterns": ready_patterns,
        "port": port,
        "wait_timeout_ms": wait_timeout_ms,
        "stream_logs": stream_logs,
        "name": sb_name,
    }
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "sandbox_run",
            "arguments": args,
        }
    )

    # Ensure the sandbox has the latest project files before executing
    try:
        synced_count = await sync_project_files(ctx, sandbox)
        await snapshot_files_into_context(ctx, sandbox, sb_name)
        if stream_logs:
            ctx.context.events.append(
                {
                    "phase": "log",
                    "tool_id": tool_id,
                    "name": "sandbox_run",
                    "data": f"Synced {synced_count} project files to sandbox before run.\n",
                }
            )
    except Exception as e:
        if stream_logs:
            ctx.context.events.append(
                {
                    "phase": "log",
                    "tool_id": tool_id,
                    "name": "sandbox_run",
                    "data": f"Pre-run sync failed: {str(e)}\n",
                }
            )

    # Parse list-form env (e.g., ["KEY=VALUE"]) into a dict and merge with defaults
    per_env = (ctx.context.sandbox_envs or {}).get(sb_name, {})
    full_env = {**per_env, **(parse_env_list(env) if env else {})}
    cd_prefix = f"cd {safe_cwd} && "

    # Auto-attach for scaffolding/one-shot install commands when no readiness criteria are provided
    # This ensures filesystem snapshots include newly generated files (e.g., from 'rails new')
    try:
        cl = (command or "").strip().lower()
        is_scaffold_or_install = (
            cl.startswith("rails new")
            or " rails new " in cl
            or cl.startswith("rails generate")
            or cl.startswith("rails g ")
            or " rails generate " in cl
            or " rails g " in cl
            or cl.startswith("bundle install")
            or " bundle install " in cl
        )
        if (
            detached
            and not ready_patterns
            and (port is None)
            and is_scaffold_or_install
        ):
            detached = False
    except Exception:
        pass

    if auto_python_ensure and uses_python:
        await ensure_python_tooling(
            ctx, sandbox, safe_cwd, full_env or None, stream_logs, tool_id
        )

    if auto_ruby_ensure and uses_ruby:
        await ensure_ruby_tooling(
            ctx, sandbox, safe_cwd, full_env or None, stream_logs, tool_id, sb_name
        )

    # When running Ruby apps directly, optionally wrap with Bundler
    command = maybe_wrap_with_bundler(command, uses_ruby)

    # Heuristics: if this looks like a Go task, ensure Go toolchain is present
    if auto_go_ensure and uses_go:
        await ensure_go_tooling(
            ctx, sandbox, safe_cwd, full_env or None, stream_logs, tool_id
        )

    # Infer readiness patterns and port for common servers
    ready_patterns, port = infer_ready_patterns_and_port(
        command, ready_patterns, port, auto_ready_patterns
    )

    # Ensure Rails server config
    command = adjust_rails_server_command(ctx, sandbox, command, port)

    cmd = await sandbox.run_command_detached(
        "bash",
        ["-lc", f"{cd_prefix}{command}"],
        env=full_env or None,
    )

    preview_url: str | None = None
    # We will collect logs until readiness, timeout, or process exit
    collected_logs: list[str] = []
    ready: bool = False
    timed_out: bool = False
    exited_early: bool = False
    exit_code: int | None = None
    should_wait = bool(
        (ready_patterns and len(ready_patterns) > 0) or (port is not None)
    )
    ready_deadline = (
        (time.time() + (wait_timeout_ms or 0) / 1000.0) if should_wait else None
    )

    stop_event = asyncio.Event()

    async def _stream_logs() -> None:
        nonlocal preview_url, ready
        try:
            async for line in cmd.logs():
                data = line.data or ""
                # Append to UI timeline if requested
                if stream_logs:
                    ctx.context.events.append(
                        {
                            "phase": "log",
                            "tool_id": tool_id,
                            "name": "sandbox_run",
                            "data": data,
                        }
                    )
                # Always collect for LLM summary
                collected_logs.append(data)
                # Detect readiness
                if ready_patterns:
                    for pat in ready_patterns:
                        if pat and (pat in data):
                            ready = True
                            if port and not preview_url:
                                try:
                                    url = sandbox.domain(port)
                                except Exception:
                                    url = None
                                if url:
                                    preview_url = url
                                    ctx.context.events.append(
                                        {
                                            "phase": "log",
                                            "tool_id": tool_id,
                                            "name": "sandbox_run",
                                            "data": f"[{sb_name}] Preview available at: {url}\n",
                                        }
                                    )
                            stop_event.set()
                            return
                # Stop if timeout/exit already signaled
                if stop_event.is_set():
                    return
        except Exception:
            # Ignore streaming errors but ensure we don't block forever
            stop_event.set()
            return

    async def _wait_for_exit() -> None:
        nonlocal exit_code, exited_early
        try:
            done = await cmd.wait()
            exit_code = getattr(done, "exit_code", None)
            exited_early = True
        except Exception:
            pass
        finally:
            stop_event.set()

    async def _timer() -> None:
        nonlocal timed_out
        if ready_deadline is None:
            return
        try:
            now = time.time()
            remaining = max(0.0, ready_deadline - now)
            await asyncio.sleep(remaining)
            if not stop_event.is_set():
                timed_out = True
                stop_event.set()
        except Exception:
            # best-effort timeout
            if not stop_event.is_set():
                timed_out = True
                stop_event.set()

    # After command start/finish, optionally compute a filesystem snapshot for auto-resync
    if detached:
        if should_wait:
            tasks: list[asyncio.Task] = [
                asyncio.create_task(_stream_logs()),
                asyncio.create_task(_wait_for_exit()),
            ]
            # Only start the timer when readiness/port provided (long-running service)
            if ready_deadline is not None:
                tasks.append(asyncio.create_task(_timer()))
            await stop_event.wait()
            # Cancel any remaining tasks
            for t in tasks:
                if not t.done():
                    t.cancel()
            output = {"started": True}
            if preview_url:
                output["preview_url"] = preview_url
            output.update(
                {
                    "ready": ready,
                    "timed_out": timed_out,
                    "exited_early": exited_early,
                    **({"exit_code": exit_code} if exit_code is not None else {}),
                }
            )
        else:
            # No readiness criteria given; don't block. Return immediately as started.
            output = {"started": True}
        output["fs"] = await snapshot_file_changes(ctx, sandbox, sb_name)
    else:
        # attached: stream logs until process exits
        tasks_attached: list[asyncio.Task] = [
            asyncio.create_task(_stream_logs()),
            asyncio.create_task(_wait_for_exit()),
        ]
        await stop_event.wait()
        for t in tasks_attached:
            if not t.done():
                t.cancel()
        output = {
            **({"preview_url": preview_url} if preview_url else {}),
            "ready": ready,
            "timed_out": timed_out,
            "exited_early": exited_early,
            **({"exit_code": exit_code} if exit_code is not None else {}),
        }
        output["fs"] = await snapshot_file_changes(ctx, sandbox, sb_name)
    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "sandbox_run",
            "output_data": output,
        }
    )
    # Prepare a summary string for the LLM that includes a trimmed log transcript
    try:
        # Build log snippet (last N characters to avoid overflow)
        logs_text = "".join(collected_logs)
        MAX_CHARS = 16000
        trimmed = False
        if len(logs_text) > MAX_CHARS:
            logs_text = logs_text[-MAX_CHARS:]
            trimmed = True

        status = (
            "ready"
            if ready
            else (
                "timed_out" if timed_out else ("exited" if exited_early else "started")
            )
        )

        fs = output.get("fs") or {}
        created = fs.get("created") or []
        updated = fs.get("updated") or []
        deleted = fs.get("deleted") or []
        files_total = len(fs.get("files") or [])

        parts = [
            f"sandbox_run completed (name={sb_name})",
            f"status={status}",
            *(
                [f"preview_url={output.get('preview_url')}"]
                if output.get("preview_url")
                else []
            ),
            *(
                [f"exit_code={output.get('exit_code')}"]
                if output.get("exit_code") is not None
                else []
            ),
            f"fs: files_total={files_total} created={len(created)} updated={len(updated)} deleted={len(deleted)}",
            (
                "logs (trimmed to last " + str(MAX_CHARS) + " chars):"
                if trimmed
                else "logs:"
            ),
            logs_text,
        ]
        summary = "\n".join(parts)
    except Exception:
        summary = "sandbox_run completed"
    return summary


# Simple helper for the agent to emit a preview URL for the running sandbox
@function_tool
async def sandbox_show_preview(
    ctx: RunContextWrapper[IDEContext],
    url: str,
    port: int | None = None,
    label: str | None = None,
    name: str | None = None,
) -> str:
    """Emit a preview URL for the active sandbox so the UI can render it.
    Automatically makes a curl request to verify the URL is accessible.
    Make sure to preview a route that contains a real endpoint. For example, 
    if you are previewing a backend that doesn not have anything at the root but
    it has an endpoint at /api/hello, you should preview /api/hello.

    Args:
        url: The full preview URL.
        port: Optional port used by the service.
        label: Optional descriptive label (e.g., 'frontend', 'backend').
    Returns:
        JSON with preview info and curl response details.
    """
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    sb_name = normalize_sandbox_name(ctx, name)
    args = {"url": url, "port": port, "label": label, "name": sb_name}
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "sandbox_show_preview",
            "arguments": args,
        }
    )
    
    # Make HTTP request to verify the preview URL
    curl_result = {}
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            response = await client.get(url)
            curl_result = {
                "status_code": response.status_code,
                "status": "success" if 200 <= response.status_code < 300 else "error",
                "headers": dict(response.headers),
                "content": response.text[:5000] if response.text else None,  # Limit content to 5000 chars
                "content_type": response.headers.get("content-type", ""),
            }
            
            # Log the curl result to the events
            ctx.context.events.append(
                {
                    "phase": "log",
                    "tool_id": tool_id,
                    "name": "sandbox_show_preview",
                    "data": f"[{sb_name}] Preview health check: HTTP {response.status_code} for {url}\n",
                }
            )
    except httpx.TimeoutException:
        curl_result = {
            "status": "timeout",
            "error": "Request timed out after 10 seconds"
        }
        ctx.context.events.append(
            {
                "phase": "log",
                "tool_id": tool_id,
                "name": "sandbox_show_preview",
                "data": f"[{sb_name}] Preview health check: TIMEOUT for {url}\n",
            }
        )
    except httpx.ConnectError as e:
        curl_result = {
            "status": "connection_error",
            "error": f"Connection failed: {str(e)}"
        }
        ctx.context.events.append(
            {
                "phase": "log",
                "tool_id": tool_id,
                "name": "sandbox_show_preview",
                "data": f"[{sb_name}] Preview health check: CONNECTION ERROR for {url}\n",
            }
        )
    except Exception as e:
        curl_result = {
            "status": "error",
            "error": f"Unexpected error: {str(e)}"
        }
        ctx.context.events.append(
            {
                "phase": "log",
                "tool_id": tool_id,
                "name": "sandbox_show_preview",
                "data": f"[{sb_name}] Preview health check: ERROR - {str(e)}\n",
            }
        )
    
    output = {
        "url": url,
        **({"port": port} if port else {}),
        **({"label": label} if label else {}),
        "name": sb_name,
        "curl_result": curl_result,
    }
    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "sandbox_show_preview",
            "output_data": output,
        }
    )
    return json.dumps(output)


@function_tool
async def sandbox_set_env(
    ctx: RunContextWrapper[IDEContext], env: list[str], name: str | None = None
) -> str:
    """Set default environment variables for subsequent sandbox_run commands for a named sandbox (or active/default)."""
    tool_id = f"tc_{len(ctx.context.events) + 1}"
    sb_name = normalize_sandbox_name(ctx, name)
    args = {"env": env, "name": sb_name}
    ctx.context.events.append(
        {
            "phase": "started",
            "tool_id": tool_id,
            "name": "sandbox_set_env",
            "arguments": args,
        }
    )
    parsed = parse_env_list(env)
    # Per-sandbox env only
    per_env = dict(ctx.context.sandbox_envs.get(sb_name, {}))
    for k, v in parsed.items():
        if k not in per_env:
            per_env[k] = v
    ctx.context.sandbox_envs[sb_name] = per_env
    output = {"ok": True, "env_keys": list(parsed.keys()), "name": sb_name}
    ctx.context.events.append(
        {
            "phase": "completed",
            "tool_id": tool_id,
            "name": "sandbox_set_env",
            "output_data": output,
        }
    )
    return json.dumps(output)
