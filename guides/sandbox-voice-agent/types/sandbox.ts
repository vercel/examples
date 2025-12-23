/**
 * TypeScript types for Vercel Sandbox operations
 */

export type SandboxRuntime = 'python3.13' | 'node24' | 'node22';

export type SandboxStatus =
  | 'creating'
  | 'installing'
  | 'starting'
  | 'ready'
  | 'running'
  | 'failed'
  | 'stopped';

export interface SandboxConfig {
  /**
   * Git repository URL containing the agent code
   */
  repoUrl: string;

  /**
   * Runtime environment for the agent
   */
  runtime: SandboxRuntime;

  /**
   * Timeout in milliseconds (default: 10 minutes)
   */
  timeout?: number;

  /**
   * Number of vCPUs to allocate (default: 4)
   */
  vcpus?: number;

  /**
   * GitHub token for private repositories
   */
  githubToken?: string;
}

export interface SandboxInfo {
  /**
   * Unique identifier for the sandbox instance
   */
  id: string;

  /**
   * Current status of the sandbox
   */
  status: SandboxStatus;

  /**
   * LiveKit room name associated with this sandbox
   */
  roomName?: string;

  /**
   * Agent name registered in LiveKit
   */
  agentName?: string;

  /**
   * Timestamp when the sandbox was created
   */
  createdAt: number;

  /**
   * Timestamp when the sandbox will expire
   */
  expiresAt: number;

  /**
   * Error message if status is 'failed'
   */
  error?: string;

  /**
   * Progress message describing current operation
   */
  progressMessage?: string;
}

export interface CreateSandboxRequest {
  /**
   * Configuration for the sandbox
   */
  config?: Partial<SandboxConfig>;

  /**
   * Optional room name (auto-generated if not provided)
   */
  roomName?: string;
}

export interface CreateSandboxResponse {
  /**
   * Success indicator
   */
  success: boolean;

  /**
   * Sandbox information
   */
  sandbox?: SandboxInfo;

  /**
   * Error message if success is false
   */
  error?: string;

  /**
   * Detailed error message for debugging
   */
  details?: string;
}

export interface SandboxStatusResponse {
  /**
   * Sandbox information
   */
  sandbox: SandboxInfo;

  /**
   * Whether the agent is connected to LiveKit
   */
  agentConnected: boolean;

  /**
   * Whether the sandbox is ready for use
   */
  ready: boolean;
}

export interface ExtendSandboxTimeoutRequest {
  /**
   * Sandbox ID to extend
   */
  sandboxId: string;

  /**
   * Additional time in milliseconds
   */
  additionalTime: number;
}

export interface ExtendSandboxTimeoutResponse {
  /**
   * Success indicator
   */
  success: boolean;

  /**
   * New expiration timestamp
   */
  expiresAt?: number;

  /**
   * Error message if success is false
   */
  error?: string;
}
