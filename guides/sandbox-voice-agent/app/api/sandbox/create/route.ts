/**
 * Sandbox Creation API Endpoint
 *
 * Creates a Vercel Sandbox on-demand to host the LiveKit voice agent.
 * This endpoint:
 * 1. Creates a new sandbox with specified runtime
 * 2. Clones the agent repository
 * 3. Installs dependencies
 * 4. Starts the agent process with LiveKit credentials
 * 5. Returns sandbox information
 */
import { NextResponse } from 'next/server';
import { Sandbox } from '@vercel/sandbox';
import { sandboxManager } from '@/lib/sandbox-manager';
import type { CreateSandboxRequest, CreateSandboxResponse, SandboxInfo } from '@/types/sandbox';

// Configuration type
type SandboxConfig = {
  repoUrl: string;
  runtime: string;
  timeout: number;
  vcpus: number;
  githubToken?: string;
};

// Default configuration
const DEFAULT_CONFIG = {
  repoUrl:
    process.env.AGENT_REPO_URL || 'https://github.com/livekit-examples/agent-starter-python.git',
  runtime: (process.env.AGENT_RUNTIME as string) || 'python3.13',
  timeout: parseInt(process.env.SANDBOX_TIMEOUT || '600000', 10), // 10 minutes
  vcpus: 4,
};

export async function POST(req: Request) {
  try {
    const body: CreateSandboxRequest = await req.json();
    const config = { ...DEFAULT_CONFIG, ...body.config };

    // Validate required environment variables
    if (
      !process.env.LIVEKIT_API_KEY ||
      !process.env.LIVEKIT_API_SECRET ||
      !process.env.LIVEKIT_URL
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'LiveKit credentials not configured',
          details:
            'Please set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and LIVEKIT_URL environment variables',
        } as CreateSandboxResponse,
        { status: 500 }
      );
    }

    console.log(`[Sandbox] Creating sandbox with config:`, {
      runtime: config.runtime,
      repoUrl: config.repoUrl,
      timeout: config.timeout,
    });

    // Generate room name if not provided
    const roomName =
      body.roomName || `voice_agent_sandbox_${Math.random().toString(36).substring(7)}`;

    // Create sandbox info
    const sandboxInfo: SandboxInfo = {
      id: '', // Will be set after creation
      status: 'creating',
      roomName,
      agentName: 'sandbox-agent',
      createdAt: Date.now(),
      expiresAt: Date.now() + config.timeout,
    };

    // Register sandbox
    sandboxManager.register(sandboxInfo);

    try {
      // Create the Vercel Sandbox
      const sandbox = await Sandbox.create({
        source: {
          url: config.repoUrl,
          type: 'git',
          // For private repositories, add authentication
          ...(config.githubToken
            ? {
                username: 'x-access-token',
                password: config.githubToken,
              }
            : {}),
        },
        runtime: config.runtime,
        resources: { vcpus: config.vcpus },
        timeout: config.timeout,
        ports: [], // Agent doesn't expose HTTP ports
      });

      // Get sandbox ID - the SDK uses .sandboxId property
      const actualSandboxId = (sandbox as { sandboxId: string }).sandboxId;
      sandboxInfo.id = actualSandboxId;
      sandboxManager.register(sandboxInfo);

      console.log(`[Sandbox ${actualSandboxId}] Created successfully`);

      // Return immediately so frontend can start polling for progress
      // Continue setup in the background
      setupSandbox(sandbox, actualSandboxId, config, sandboxInfo).catch((error) => {
        console.error(`[Sandbox ${actualSandboxId}] Setup failed:`, error);
        sandboxManager.updateStatus(actualSandboxId, 'failed', error.message);
      });

      return NextResponse.json({
        success: true,
        sandbox: {
          ...sandboxInfo,
          id: actualSandboxId,
        },
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

// Background setup function
async function setupSandbox(
  sandbox: {
    runCommand: (args: {
      cmd: string;
      args: string[];
      stdout?: NodeJS.WriteStream;
      stderr?: NodeJS.WriteStream;
      detached?: boolean;
      env?: Record<string, string>;
    }) => Promise<{ exitCode: number }>;
  },
  sandboxId: string,
  config: SandboxConfig,
  sandboxInfo: SandboxInfo
) {
  try {
    // Update status to installing
    sandboxManager.updateStatus(
      sandboxId,
      'installing',
      undefined,
      'Cloning repository and setting up environment'
    );

    // First, check if files were cloned correctly
    console.log(`[Sandbox ${sandboxId}] Checking repository contents...`);

    await sandbox.runCommand({
      cmd: 'ls',
      args: ['-la'],
      stdout: process.stdout,
      stderr: process.stderr,
    });

    // Check what Python executables are available
    console.log(`[Sandbox ${sandboxId}] Checking available Python executables...`);
    await sandbox.runCommand({
      cmd: 'sh',
      args: ['-c', 'which python3 && python3 --version && which pip && pip --version'],
      stdout: process.stdout,
      stderr: process.stderr,
    });

    // Install dependencies based on runtime
    let installCmd;

    if (config.runtime === 'python3.13') {
      // Check if pyproject.toml exists (modern Python project)
      const hasPyproject = await sandbox.runCommand({
        cmd: 'test',
        args: ['-f', 'pyproject.toml'],
      });

      if (hasPyproject.exitCode === 0) {
        // Modern Python project with pyproject.toml
        console.log(`[Sandbox ${sandboxId}] Detected pyproject.toml, installing with pip...`);
        installCmd = { cmd: 'pip', args: ['install', '--user', '.'] };
      } else {
        // Traditional requirements.txt
        installCmd = { cmd: 'pip', args: ['install', '--user', '-r', 'requirements.txt'] };
      }
    } else {
      // Node.js
      installCmd = { cmd: 'npm', args: ['install'] };
    }

    console.log(`[Sandbox ${sandboxId}] Installing dependencies...`);
    sandboxManager.updateStatus(
      sandboxId,
      'installing',
      undefined,
      'Installing Python dependencies and packages'
    );

    const install = await sandbox.runCommand({
      ...installCmd,
      stdout: process.stdout,
      stderr: process.stderr,
    });

    if (install.exitCode !== 0) {
      const error = 'Dependency installation failed';
      sandboxManager.updateStatus(sandboxId, 'failed', error);
      throw new Error(`${error}: Exit code ${install.exitCode}`);
    }

    console.log(`[Sandbox ${sandboxId}] Dependencies installed`);

    // Install SSL certificates for Python (fixes certificate verification errors)
    if (config.runtime === 'python3.13') {
      console.log(`[Sandbox ${sandboxId}] Installing SSL certificates...`);
      sandboxManager.updateStatus(
        sandboxId,
        'installing',
        undefined,
        'Configuring SSL certificates'
      );

      const certInstall = await sandbox.runCommand({
        cmd: '/vercel/runtimes/python/bin/pip3',
        args: ['install', '--upgrade', 'certifi'],
        stdout: process.stdout,
        stderr: process.stderr,
      });

      if (certInstall.exitCode !== 0) {
        console.log(`[Sandbox ${sandboxId}] SSL certificate installation failed, continuing...`);
      } else {
        console.log(`[Sandbox ${sandboxId}] SSL certificates installed`);
      }
    }

    // Download model files if needed (for Python agents)
    if (config.runtime === 'python3.13') {
      console.log(`[Sandbox ${sandboxId}] Downloading model files...`);
      sandboxManager.updateStatus(
        sandboxId,
        'installing',
        undefined,
        'Downloading AI models (this may take a moment)'
      );

      const downloadCmd = await sandbox.runCommand({
        cmd: '/vercel/runtimes/python/bin/python3',
        args: ['src/agent.py', 'download-files'],
        stdout: process.stdout,
        stderr: process.stderr,
      });

      if (downloadCmd.exitCode !== 0) {
        console.log(`[Sandbox ${sandboxId}] Model download failed (non-critical), continuing...`);
      } else {
        console.log(`[Sandbox ${sandboxId}] Model files downloaded`);
      }
    }

    // Update status to starting
    sandboxManager.updateStatus(
      sandboxId,
      'starting',
      undefined,
      'Starting voice agent and connecting to LiveKit'
    );

    // Start agent process
    let agentCmd;

    if (config.runtime === 'python3.13') {
      // Check if agent is in src directory or root
      const hasSrcAgent = await sandbox.runCommand({
        cmd: 'test',
        args: ['-f', 'src/agent.py'],
      });

      // Use the runtime-specific python from /vercel/runtimes/python
      const pythonPath = '/vercel/runtimes/python/bin/python3';

      if (hasSrcAgent.exitCode === 0) {
        agentCmd = { cmd: pythonPath, args: ['src/agent.py', 'start'] };
      } else {
        agentCmd = { cmd: pythonPath, args: ['agent.py', 'start'] };
      }
    } else {
      // Node.js
      agentCmd = { cmd: 'node', args: ['agent.js'] };
    }

    console.log(
      `[Sandbox ${sandboxId}] Starting agent with command: ${agentCmd.cmd} ${agentCmd.args.join(' ')}...`
    );

    await sandbox.runCommand({
      ...agentCmd,
      detached: true, // Run in background
      env: {
        LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY!,
        LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET!,
        LIVEKIT_URL: process.env.LIVEKIT_URL!,
        LIVEKIT_AGENT_NAME: sandboxInfo.agentName || 'sandbox-agent',
        // AI service API keys (required by agent-starter-python)
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
        ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY || '',
        CARTESIA_API_KEY: process.env.CARTESIA_API_KEY || '',
        // Add Python user site packages to PATH
        PYTHONPATH: '/home/vercel-sandbox/.local/lib/python3.13/site-packages',
        PATH: `${process.env.PATH}:/home/vercel-sandbox/.local/bin`,
      },
      stdout: process.stdout,
      stderr: process.stderr,
    });

    // Update status to ready
    sandboxManager.updateStatus(
      sandboxId,
      'ready',
      undefined,
      'Agent is ready and waiting for connection'
    );

    console.log(`[Sandbox ${sandboxId}] Agent started successfully`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Sandbox ${sandboxId}] Setup failed:`, error);
    sandboxManager.updateStatus(sandboxId, 'failed', errorMessage);
    throw error;
  }
}
