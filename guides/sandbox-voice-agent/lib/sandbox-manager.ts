/**
 * Sandbox Lifecycle Management
 *
 * Manages the lifecycle of Vercel Sandbox instances for voice agents.
 * Tracks active sandboxes, extends timeouts, and handles cleanup.
 */
import type { SandboxInfo, SandboxStatus } from '@/types/sandbox';

/**
 * In-memory store for tracking active sandboxes
 * For production with multiple instances, consider using Redis or Vercel KV
 */
class SandboxManager {
  private sandboxes: Map<string, SandboxInfo> = new Map();
  private roomToSandbox: Map<string, string> = new Map();

  /**
   * Register a new sandbox instance
   */
  register(sandbox: SandboxInfo): void {
    this.sandboxes.set(sandbox.id, sandbox);
    if (sandbox.roomName) {
      this.roomToSandbox.set(sandbox.roomName, sandbox.id);
    }
  }

  /**
   * Get sandbox information by ID
   */
  get(sandboxId: string): SandboxInfo | undefined {
    return this.sandboxes.get(sandboxId);
  }

  /**
   * Get sandbox by room name
   */
  getByRoom(roomName: string): SandboxInfo | undefined {
    const sandboxId = this.roomToSandbox.get(roomName);
    return sandboxId ? this.sandboxes.get(sandboxId) : undefined;
  }

  /**
   * Update sandbox status
   */
  updateStatus(
    sandboxId: string,
    status: SandboxStatus,
    error?: string,
    progressMessage?: string
  ): void {
    const sandbox = this.sandboxes.get(sandboxId);
    if (sandbox) {
      sandbox.status = status;
      if (error) {
        sandbox.error = error;
      }
      if (progressMessage !== undefined) {
        sandbox.progressMessage = progressMessage;
      }
      this.sandboxes.set(sandboxId, sandbox);
    }
  }

  /**
   * Update sandbox expiration time
   */
  updateExpiration(sandboxId: string, expiresAt: number): void {
    const sandbox = this.sandboxes.get(sandboxId);
    if (sandbox) {
      sandbox.expiresAt = expiresAt;
      this.sandboxes.set(sandboxId, sandbox);
    }
  }

  /**
   * Remove sandbox from tracking
   */
  remove(sandboxId: string): void {
    const sandbox = this.sandboxes.get(sandboxId);
    if (sandbox?.roomName) {
      this.roomToSandbox.delete(sandbox.roomName);
    }
    this.sandboxes.delete(sandboxId);
  }

  /**
   * Get all active sandboxes
   */
  getAll(): SandboxInfo[] {
    return Array.from(this.sandboxes.values());
  }

  /**
   * Get sandboxes by status
   */
  getByStatus(status: SandboxStatus): SandboxInfo[] {
    return this.getAll().filter((s) => s.status === status);
  }

  /**
   * Check if sandbox is expired
   */
  isExpired(sandboxId: string): boolean {
    const sandbox = this.sandboxes.get(sandboxId);
    if (!sandbox) return true;
    return Date.now() > sandbox.expiresAt;
  }

  /**
   * Clean up expired sandboxes
   */
  cleanupExpired(): string[] {
    const expired: string[] = [];
    for (const [id] of this.sandboxes.entries()) {
      if (this.isExpired(id)) {
        expired.push(id);
        this.remove(id);
      }
    }
    return expired;
  }

  /**
   * Get sandbox count
   */
  count(): number {
    return this.sandboxes.size;
  }

  /**
   * Clear all sandboxes (for testing)
   */
  clear(): void {
    this.sandboxes.clear();
    this.roomToSandbox.clear();
  }
}

// Singleton instance
const sandboxManager = new SandboxManager();

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      const expired = sandboxManager.cleanupExpired();
      if (expired.length > 0) {
        console.log(`Cleaned up ${expired.length} expired sandboxes:`, expired);
      }
    },
    5 * 60 * 1000
  ); // 5 minutes
}

export { sandboxManager };
export type { SandboxManager };
