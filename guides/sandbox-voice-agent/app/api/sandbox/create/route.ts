import { NextResponse } from 'next/server';
import { Sandbox } from '@vercel/sandbox';
import { sandboxManager } from '@/lib/sandbox-manager';
import type {
  CreateSandboxRequest,
  CreateSandboxResponse,
  SandboxInfo
} from '@/types/sandbox';

const DEFAULT_CONFIG = {
  repoUrl: process.env.AGENT_REPO_URL ||
    'https://github.com/livekit-examples/agent-starter-python.git',
  runtime: (process.env.AGENT_RUNTIME as string) || 'python3.13',
  timeout: parseInt(process.env.SANDBOX_TIMEOUT || '600000', 10),
  vcpus: 4,
};

export async function POST(req: Request) {
  try {
    const body: CreateSandboxRequest = await req.json();
    const config = { ...DEFAULT_CONFIG, ...body.config };

    if (
      !process.env.LIVEKIT_API_KEY ||
      !process.env.LIVEKIT_API_SECRET ||
      !process.env.LIVEKIT_URL
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'LiveKit credentials not configured',
          details: 'Please set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, ' +
            'and LIVEKIT_URL environment variables',
        } as CreateSandboxResponse,
        { status: 500 }
      );
    }

    console.log('[Sandbox] Creating with config:', {
      runtime: config.runtime,
      repoUrl: config.repoUrl,
      timeout: config.timeout,
    });

    const roomName = body.roomName ||
      `voice_agent_sandbox_${Math.random().toString(36).substring(7)}`;

    const sandboxInfo: SandboxInfo = {
      id: '',
      status: 'creating',
      roomName,
      agentName: 'sandbox-agent',
      createdAt: Date.now(),
      expiresAt: Date.now() + config.timeout,
    };

    sandboxManager.register(sandboxInfo);

    try {
      const sandbox = await Sandbox.create({
        source: {
          url: config.repoUrl,
          type: 'git',
          ...(config.githubToken ? {
            username: 'x-access-token',
            password: config.githubToken,
          } : {}),
        },
        runtime: config.runtime,
        resources: { vcpus: config.vcpus },
        timeout: config.timeout,
      });

      const sandboxId = (sandbox as { sandboxId: string }).sandboxId;
      sandboxInfo.id = sandboxId;
      sandboxManager.register(sandboxInfo);

      console.log(`[Sandbox ${sandboxId}] Created successfully`);

      setupSandbox(sandbox, sandboxId, config, sandboxInfo).catch((error) => {
        console.error(`[Sandbox ${sandboxId}] Setup failed:`, error);
        sandboxManager.updateStatus(sandboxId, 'failed', error.message);
      });

      return NextResponse.json({
        success: true,
        sandbox: { ...sandboxInfo, id: sandboxId },
      } as CreateSandboxResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Sandbox] Creation error:', error);

      if (sandboxInfo.id) {
        sandboxManager.updateStatus(sandboxInfo.id, 'failed', errorMessage);
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Sandbox creation failed',
          details: errorMessage,
        } as CreateSandboxResponse,
        { status: 500 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Sandbox] Request processing failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request',
        details: errorMessage,
      } as CreateSandboxResponse,
      { status: 400 }
    );
  }
}

type RunCommandFn = (args: {
  cmd: string;
  args: string[];
  stdout?: NodeJS.WriteStream;
  stderr?: NodeJS.WriteStream;
  detached?: boolean;
  env?: Record<string, string>;
}) => Promise<{ exitCode: number }>;

async function setupSandbox(
  sandbox: { runCommand: RunCommandFn },
  sandboxId: string,
  config: typeof DEFAULT_CONFIG & { githubToken?: string },
  sandboxInfo: SandboxInfo
) {
  const run = (cmd: string, args: string[], opts: Record<string, unknown> = {}) =>
    sandbox.runCommand({ cmd, args, ...opts });

  const updateStatus = (status: string, msg: string) =>
    sandboxManager.updateStatus(
      sandboxId,
      status as 'installing' | 'starting' | 'ready' | 'failed',
      undefined,
      msg
    );

  try {
    updateStatus('installing', 'Setting up environment');

    await run('ls', ['-la']);

    let installCmd: { cmd: string; args: string[] };

    if (config.runtime === 'python3.13') {
      const hasPyproject = await run('test', ['-f', 'pyproject.toml']);

      if (hasPyproject.exitCode === 0) {
        console.log(`[Sandbox ${sandboxId}] Using pyproject.toml`);
        installCmd = { cmd: 'pip', args: ['install', '--user', '.'] };
      } else {
        installCmd = {
          cmd: 'pip',
          args: ['install', '--user', '-r', 'requirements.txt']
        };
      }
    } else {
      installCmd = { cmd: 'npm', args: ['install'] };
    }

    updateStatus('installing', 'Installing dependencies');

    const install = await run(installCmd.cmd, installCmd.args);
    if (install.exitCode !== 0) {
      throw new Error(`Dependency installation failed: Exit code ${install.exitCode}`);
    }

    console.log(`[Sandbox ${sandboxId}] Dependencies installed`);

    if (config.runtime === 'python3.13') {
      updateStatus('installing', 'Configuring SSL certificates');
      await run('/vercel/runtimes/python/bin/pip3', ['install', '--upgrade', 'certifi']);

      updateStatus('installing', 'Downloading AI models');
      await run('/vercel/runtimes/python/bin/python3', [
        'src/agent.py',
        'download-files'
      ]);
    }

    updateStatus('starting', 'Starting voice agent');

    let agentCmd: { cmd: string; args: string[] };

    if (config.runtime === 'python3.13') {
      const hasSrcAgent = await run('test', ['-f', 'src/agent.py']);
      const pythonPath = '/vercel/runtimes/python/bin/python3';

      agentCmd = hasSrcAgent.exitCode === 0
        ? { cmd: pythonPath, args: ['src/agent.py', 'start'] }
        : { cmd: pythonPath, args: ['agent.py', 'start'] };
    } else {
      agentCmd = { cmd: 'node', args: ['agent.js'] };
    }

    console.log(`[Sandbox ${sandboxId}] Starting agent: ${agentCmd.cmd} ${agentCmd.args.join(' ')}`);

    await sandbox.runCommand({
      ...agentCmd,
      detached: true,
      env: {
        LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY!,
        LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET!,
        LIVEKIT_URL: process.env.LIVEKIT_URL!,
        LIVEKIT_AGENT_NAME: sandboxInfo.agentName || 'sandbox-agent',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
        ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY || '',
        CARTESIA_API_KEY: process.env.CARTESIA_API_KEY || '',
        PYTHONPATH: '/home/vercel-sandbox/.local/lib/python3.13/site-packages',
        PATH: `${process.env.PATH}:/home/vercel-sandbox/.local/bin`,
      },
    });

    updateStatus('ready', 'Agent is ready');
    console.log(`[Sandbox ${sandboxId}] Agent started successfully`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Sandbox ${sandboxId}] Setup failed:`, error);
    sandboxManager.updateStatus(sandboxId, 'failed', errorMessage);
    throw error;
  }
}
