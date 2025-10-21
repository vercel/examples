from vercel.sandbox import AsyncSandbox as Sandbox
from agents import RunContextWrapper

from src.agent.context import IDEContext


async def create_synthetic_ruby_runtime(
    ctx: RunContextWrapper[IDEContext],
    sandbox: Sandbox,
    sb_name: str,
    tool_id: str,
) -> None:
    ctx.context.events.append(
        {
            "phase": "log",
            "tool_id": tool_id,
            "name": "sandbox_create",
            "data": "Initializing Ruby runtime...\n",
        }
    )
    # Ensure Ruby is present along with common build tools
    ruby_install_sh = (
        "if ! command -v ruby >/dev/null 2>&1; then "
        "dnf install -y ruby3.2 ruby3.2-rubygems ruby3.2-rubygem-json ruby3.2-devel libyaml-devel sqlite sqlite-devel gcc gcc-c++ make git redhat-rpm-config; "
        "fi; ruby --version; gem --version;"
    )
    ruby_cmd = await sandbox.run_command_detached(
        "bash",
        ["-lc", ruby_install_sh],
        sudo=True,
    )
    try:
        async for line in ruby_cmd.logs():
            ctx.context.events.append(
                {
                    "phase": "log",
                    "tool_id": tool_id,
                    "name": "sandbox_create",
                    "data": line.data,
                }
            )
    except Exception:
        pass
    _ = await ruby_cmd.wait()

    # Ensure Bundler is available
    bundler_install_sh = (
        "if command -v gem >/dev/null 2>&1; then "
        "gem list -i bundler >/dev/null 2>&1 || gem install --no-document bundler; "
        "fi; bundle --version || true"
    )
    bundler_install_cmd = await sandbox.run_command_detached(
        "bash",
        ["-lc", bundler_install_sh],
        sudo=True,
    )
    try:
        async for line in bundler_install_cmd.logs():
            ctx.context.events.append(
                {
                    "phase": "log",
                    "tool_id": tool_id,
                    "name": "sandbox_create",
                    "data": line.data,
                }
            )
    except Exception:
        pass
    _ = await bundler_install_cmd.wait()

    # Configure bundler to install into project-local path
    bundler_cfg_sh = (
        f"cd {sandbox.sandbox.cwd} && "
        "mkdir -p vendor/bundle && "
        "bundle config set --local path vendor/bundle"
    )
    bundler_cfg_cmd = await sandbox.run_command_detached(
        "bash",
        ["-lc", bundler_cfg_sh],
    )
    try:
        async for line in bundler_cfg_cmd.logs():
            ctx.context.events.append(
                {
                    "phase": "log",
                    "tool_id": tool_id,
                    "name": "sandbox_create",
                    "data": line.data,
                }
            )
    except Exception:
        pass
    _ = await bundler_cfg_cmd.wait()

    # Ensure rack and puma are available (create Gemfile if needed) and generate binstubs
    rack_puma_setup_sh = (
        f"cd {sandbox.sandbox.cwd} && "
        "( [ -f Gemfile ] || bundle init ) && "
        "bundle add rack puma || true && "
        "bundle install && "
        "bundle binstubs rack puma"
    )
    rack_puma_cmd = await sandbox.run_command_detached(
        "bash",
        ["-lc", rack_puma_setup_sh],
    )
    try:
        async for line in rack_puma_cmd.logs():
            ctx.context.events.append(
                {
                    "phase": "log",
                    "tool_id": tool_id,
                    "name": "sandbox_create",
                    "data": line.data,
                }
            )
    except Exception:
        pass
    _ = await rack_puma_cmd.wait()

    # Persist environment defaults for Ruby tooling
    try:
        per_env = dict(ctx.context.sandbox_envs.get(sb_name, {}))
        per_env.update(
            {
                "BUNDLE_PATH": "vendor/bundle",
                "PATH": f"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/share/gems/bin:/usr/share/ruby3.2-gems/bin:/home/vercel-sandbox/.local/share/gem/ruby/bin:/home/vercel-sandbox/.gem/ruby/bin:{sandbox.sandbox.cwd}/bin",
            }
        )
        ctx.context.sandbox_envs[sb_name] = per_env
    except Exception:
        pass

    ctx.context.events.append(
        {
            "phase": "log",
            "tool_id": tool_id,
            "name": "sandbox_create",
            "data": "Synthetic Ruby runtime ready. Bundler configured; rackup and puma installed (binstubs in ./bin).\n",
        }
    )


async def create_synthetic_go_runtime(
    ctx: RunContextWrapper[IDEContext],
    sandbox: Sandbox,
    sb_name: str,
    tool_id: str,
) -> None:
    ctx.context.events.append(
        {
            "phase": "log",
            "tool_id": tool_id,
            "name": "sandbox_create",
            "data": "Initializing Go runtime...\n",
        }
    )
    go_install_sh = (
        "if ! command -v go >/dev/null 2>&1; then "
        "dnf install -y golang git || exit 1; "
        "fi; go version; git --version || true;"
    )
    go_cmd = await sandbox.run_command_detached(
        "bash",
        ["-lc", go_install_sh],
        sudo=True,
    )
    try:
        async for line in go_cmd.logs():
            ctx.context.events.append(
                {
                    "phase": "log",
                    "tool_id": tool_id,
                    "name": "sandbox_create",
                    "data": line.data,
                }
            )
    except Exception:
        pass
    _ = await go_cmd.wait()

    # Persist environment defaults for Go tooling
    try:
        per_env = dict(ctx.context.sandbox_envs.get(sb_name, {}))
        per_env.update(
            {
                "GOPATH": "/home/vercel-sandbox/go",
                "PATH": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/vercel-sandbox/go/bin:"
                + (per_env.get("PATH") or ""),
            }
        )
        ctx.context.sandbox_envs[sb_name] = per_env
    except Exception:
        pass

    ctx.context.events.append(
        {
            "phase": "log",
            "tool_id": tool_id,
            "name": "sandbox_create",
            "data": "Synthetic Go runtime ready. golang and git installed.\n",
        }
    )
