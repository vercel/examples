from vercel.sandbox import AsyncSandbox as Sandbox
from agents import RunContextWrapper

from src.agent.context import IDEContext


def select_safe_cwd(requested_cwd: str | None, base_cwd: str) -> str:
    """Resolve a safe working directory under the sandbox's base cwd.

    Absolute paths outside the sandbox root are ignored. Relative paths are
    resolved under the base cwd. Falls back to base cwd on errors.
    """
    safe_cwd = base_cwd
    try:
        if requested_cwd:
            if requested_cwd.startswith("/"):
                if (
                    requested_cwd.startswith(base_cwd + "/")
                    or requested_cwd == base_cwd
                ):
                    safe_cwd = requested_cwd
            else:
                safe_cwd = f"{base_cwd}/{requested_cwd}".rstrip("/")
    except Exception:
        safe_cwd = base_cwd
    return safe_cwd


def detect_language_usage(command: str) -> tuple[bool, bool, bool]:
    """Detect whether a command indicates Python, Ruby, or Go usage.

    Returns a tuple of (uses_python, uses_ruby, uses_go).
    """
    cmd_lower = (command or "").lower()
    uses_python = (
        (" pip " in cmd_lower)
        or cmd_lower.startswith("pip ")
        or (" pip3 " in cmd_lower)
        or cmd_lower.startswith("pip3 ")
        or ("-m pip" in cmd_lower)
        or ("python " in cmd_lower)
        or cmd_lower.startswith("python")
        or ("uvicorn" in cmd_lower)
    )
    uses_ruby = (
        (" gem " in cmd_lower)
        or cmd_lower.startswith("gem ")
        or (" bundle " in cmd_lower)
        or cmd_lower.startswith("bundle ")
        or ("rackup" in cmd_lower)
        or ("ruby " in cmd_lower)
        or cmd_lower.startswith("ruby ")
        or ("sinatra" in cmd_lower)
        or ("rails " in cmd_lower)
    )
    uses_go = (" go " in f" {cmd_lower} ") or cmd_lower.startswith("go ")
    return uses_python, uses_ruby, uses_go


def select_rails_app_cwd(
    ctx: RunContextWrapper[IDEContext],
    sb_name: str,
    base_cwd: str,
    current_cwd: str,
    command: str,
) -> str:
    """Heuristic: auto-select Rails app root (folder containing bin/rails) for Rails-related commands."""
    try:
        cln = (command or "").strip().lower()
        is_rails_new = cln.startswith("rails new") or " rails new " in cln
        rails_related = (
            ("bundle install" in cln)
            or (" rails generate" in cln)
            or cln.startswith("rails generate")
            or (" rails db:" in cln)
            or cln.startswith("rails db:")
            or ("bin/rails" in cln and not is_rails_new)
        ) and not is_rails_new
        if not rails_related:
            return current_cwd
        files = (ctx.context.sandbox_files_map or {}).get(sb_name, [])
        app_roots: list[str] = []
        for p in files:
            if p.endswith("/bin/rails"):
                app_roots.append(p[: -len("/bin/rails")])
        if len(app_roots) == 1:
            return f"{base_cwd}/{app_roots[0]}".rstrip("/")
        return current_cwd
    except Exception:
        return current_cwd


async def ensure_python_tooling(
    ctx: RunContextWrapper[IDEContext],
    sandbox: Sandbox,
    safe_cwd: str,
    env: dict[str, str] | None,
    stream_logs: bool,
    tool_id: str,
) -> None:
    ensure_sh = (
        "PYBIN=$(command -v python3 || command -v python || echo /vercel/runtimes/python/bin/python3); "
        "if [ -z \"$PYBIN\" ]; then echo 'python not found in sandbox'; exit 1; fi; "
        "$PYBIN -m ensurepip --upgrade || true; "
        "$PYBIN -m pip install --upgrade pip || true;"
    )
    cmd = await sandbox.run_command_detached(
        "bash",
        ["-lc", f"cd {safe_cwd} && {ensure_sh}"],
        env=env or None,
    )
    try:
        async for line in cmd.logs():
            if stream_logs:
                ctx.context.events.append(
                    {
                        "phase": "log",
                        "tool_id": tool_id,
                        "name": "sandbox_run",
                        "data": line.data,
                    }
                )
    except Exception:
        pass
    _ = await cmd.wait()


def maybe_wrap_with_bundler(command: str, uses_ruby: bool) -> str:
    """If running Ruby apps directly, wrap with `bundle exec` when a Gemfile exists."""
    try:
        cl = (command or "").strip().lower()
        starts_with_ruby = cl.startswith("ruby ")
        starts_with_rackup = cl.startswith("rackup")
        starts_with_rails = cl.startswith("rails ")
        already_using_bundle = cl.startswith("bundle ") or (" bundle exec " in cl)
        if (
            uses_ruby
            and (starts_with_ruby or starts_with_rackup or starts_with_rails)
            and not already_using_bundle
        ):
            return f"( [ -f Gemfile ] || [ -f ./Gemfile ] ) && bundle exec {command} || {command}"
    except Exception:
        pass
    return command


def infer_ready_patterns_and_port(
    command: str,
    ready_patterns: list[str] | None,
    port: int | None,
    auto_ready_patterns: bool,
) -> tuple[list[str] | None, int | None]:
    """Infer readiness patterns and default port for common servers (Go, Uvicorn, Rack/Sinatra, Rails)."""
    cmd_lower = (command or "").lower()

    # Go
    is_go_run = (" go run" in f" {cmd_lower}") or cmd_lower.startswith("go run")
    if (
        auto_ready_patterns
        and (not ready_patterns or len(ready_patterns) == 0)
        and is_go_run
    ):
        ready_patterns = [
            "Listening on",
            "http://0.0.0.0:",
            "listening on :",
            "Server started",
            "Serving on",
        ]
    if port is None and is_go_run:
        try:
            import re as _re

            m = _re.search(r"--port\\s+(\\d+)|-p\\s+(\\d+)", command)
            port = int(m.group(1) or m.group(2)) if m else 3000
        except Exception:
            port = 3000

    # Uvicorn (FastAPI)
    if (
        auto_ready_patterns
        and (not ready_patterns or len(ready_patterns) == 0)
        and ("uvicorn" in cmd_lower)
    ):
        ready_patterns = ["Application startup complete", "Uvicorn running on"]
    if port is None and ("uvicorn" in cmd_lower):
        try:
            import re as _re

            m = _re.search(r"--port\\s+(\\d+)|-p\\s+(\\d+)", command)
            port = int(m.group(1) or m.group(2)) if m else 8000
        except Exception:
            port = 8000

    # Rack/Sinatra/Ruby
    if (
        auto_ready_patterns
        and (not ready_patterns or len(ready_patterns) == 0)
        and (
            ("rackup" in cmd_lower)
            or ("sinatra" in cmd_lower)
            or cmd_lower.startswith("ruby ")
        )
    ):
        ready_patterns = [
            "Listening on",
            "WEBrick::HTTPServer#start",
            "Sinatra has taken the stage",
            "tcp://0.0.0.0:",
            "WEBrick::HTTPServer#start: pid=",
        ]
    if port is None and (
        ("rackup" in cmd_lower)
        or ("sinatra" in cmd_lower)
        or cmd_lower.startswith("ruby ")
    ):
        try:
            import re as _re

            m = _re.search(r"--port\\s+(\\d+)|-p\\s+(\\d+)", command)
            if m:
                port = int(m.group(1) or m.group(2))
            else:
                port = 9292 if ("rackup" in cmd_lower) else 4567
        except Exception:
            port = 9292 if ("rackup" in cmd_lower) else 4567

    # Rails server
    is_rails_server = ("rails server" in cmd_lower) or ("rails s" in cmd_lower)
    if (
        auto_ready_patterns
        and (not ready_patterns or len(ready_patterns) == 0)
        and is_rails_server
    ):
        ready_patterns = [
            "Listening on",
            "Use Ctrl-C to stop",
            "Puma starting",
        ]
    if port is None and is_rails_server:
        try:
            import re as _re

            m = _re.search(r"--port\\s+(\\d+)|-p\\s+(\\d+)", command)
            port = int(m.group(1) or m.group(2)) if m else 3000
        except Exception:
            port = 3000

    return ready_patterns, port


def adjust_rails_server_command(
    ctx: RunContextWrapper[IDEContext], sandbox: Sandbox, command: str, port: int | None
) -> str:
    """Ensure Rails server binds to 0.0.0.0 and inject ALLOWED_HOST automatically."""
    try:
        cl = (command or "").lower()
        is_rails_server = ("rails server" in cl) or ("rails s" in cl)
        if not is_rails_server:
            return command
        if (" -b " not in command) and (" --binding " not in command):
            command = f"{command} -b 0.0.0.0"
        if "allowed_host=" not in cl:
            try:
                url = sandbox.domain(port or 3000)
                from urllib.parse import urlparse as _urlparse

                host = _urlparse(url).hostname or ""
            except Exception:
                host = ""
            if host:
                command = f"ALLOWED_HOST={host} {command}"
        return command
    except Exception:
        return command


async def ensure_ruby_tooling(
    ctx: RunContextWrapper[IDEContext],
    sandbox: Sandbox,
    safe_cwd: str,
    env: dict[str, str] | None,
    stream_logs: bool,
    tool_id: str,
    sb_name: str,
) -> None:
    ruby_install_sh = (
        "if ! command -v ruby >/dev/null 2>&1; then "
        "dnf install -y ruby3.2 ruby3.2-rubygems ruby3.2-rubygem-json ruby3.2-devel libyaml-devel sqlite sqlite-devel gcc gcc-c++ make git redhat-rpm-config ruby3.2-rubygem-bundler || exit 1; "
        "fi; "
        "ruby --version; gem --version; bundle --version || true;"
    )
    ruby_install_cmd = await sandbox.run_command_detached(
        "bash",
        ["-lc", f"cd {safe_cwd} && {ruby_install_sh}"],
        env=env or None,
        sudo=True,
    )
    try:
        async for line in ruby_install_cmd.logs():
            if stream_logs:
                ctx.context.events.append(
                    {
                        "phase": "log",
                        "tool_id": tool_id,
                        "name": "sandbox_run",
                        "data": line.data,
                    }
                )
    except Exception:
        pass
    _ = await ruby_install_cmd.wait()

    bundler_install_sh = (
        "if ! command -v bundle >/dev/null 2>&1; then "
        "gem list -i bundler >/dev/null 2>&1 || gem install --no-document bundler; "
        "fi; bundle --version || true;"
    )
    bundler_install_cmd = await sandbox.run_command_detached(
        "bash",
        ["-lc", f"cd {safe_cwd} && {bundler_install_sh}"],
        env=env or None,
        sudo=True,
    )
    try:
        async for line in bundler_install_cmd.logs():
            if stream_logs:
                ctx.context.events.append(
                    {
                        "phase": "log",
                        "tool_id": tool_id,
                        "name": "sandbox_run",
                        "data": line.data,
                    }
                )
    except Exception:
        pass
    _ = await bundler_install_cmd.wait()

    bundler_cfg_sh = (
        f"cd {safe_cwd} && "
        "mkdir -p vendor/bundle && "
        "bundle config set --local path vendor/bundle"
    )
    bundler_cfg_cmd = await sandbox.run_command_detached(
        "bash",
        ["-lc", bundler_cfg_sh],
        env=env or None,
    )
    try:
        async for line in bundler_cfg_cmd.logs():
            if stream_logs:
                ctx.context.events.append(
                    {
                        "phase": "log",
                        "tool_id": tool_id,
                        "name": "sandbox_run",
                        "data": line.data,
                    }
                )
    except Exception:
        pass
    _ = await bundler_cfg_cmd.wait()

    try:
        per_env_global = dict(ctx.context.sandbox_envs.get(sb_name, {}))
        per_env_global.update(
            {
                "PATH": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/share/gems/bin:/usr/share/ruby3.2-gems/bin:/home/vercel-sandbox/.local/share/gem/ruby/bin:/home/vercel-sandbox/.gem/ruby/bin",
                "BUNDLE_PATH": "vendor/bundle",
            }
        )
        ctx.context.sandbox_envs[sb_name] = per_env_global
    except Exception:
        pass


async def ensure_go_tooling(
    ctx: RunContextWrapper[IDEContext],
    sandbox: Sandbox,
    safe_cwd: str,
    env: dict[str, str] | None,
    stream_logs: bool,
    tool_id: str,
) -> None:
    go_install_sh = (
        "if ! command -v go >/dev/null 2>&1; then "
        "dnf install -y golang git || exit 1; "
        "fi; go version || exit 1;"
    )
    go_install_cmd = await sandbox.run_command_detached(
        "bash",
        ["-lc", f"cd {safe_cwd} && {go_install_sh}"],
        env=env or None,
        sudo=True,
    )
    try:
        async for line in go_install_cmd.logs():
            if stream_logs:
                ctx.context.events.append(
                    {
                        "phase": "log",
                        "tool_id": tool_id,
                        "name": "sandbox_run",
                        "data": line.data,
                    }
                )
    except Exception:
        pass
    _ = await go_install_cmd.wait()
