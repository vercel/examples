import type { SandboxInfo, SandboxStatus } from '@/types/sandbox';

class SandboxManager {
  private sandboxes: Map<string, SandboxInfo> = new Map();
  private roomToSandbox: Map<string, string> = new Map();

  register(sandbox: SandboxInfo): void {
    this.sandboxes.set(sandbox.id, sandbox);
    if (sandbox.roomName) {
      this.roomToSandbox.set(sandbox.roomName, sandbox.id);
    }
  }

  get(sandboxId: string): SandboxInfo | undefined {
    return this.sandboxes.get(sandboxId);
  }

  getByRoom(roomName: string): SandboxInfo | undefined {
    const sandboxId = this.roomToSandbox.get(roomName);
    return sandboxId ? this.sandboxes.get(sandboxId) : undefined;
  }

  updateStatus(
    sandboxId: string,
    status: SandboxStatus,
    error?: string,
    progressMessage?: string
  ): void {
    const sandbox = this.sandboxes.get(sandboxId);
    if (!sandbox) return;

    sandbox.status = status;
    if (error) sandbox.error = error;
    if (progressMessage !== undefined) sandbox.progressMessage = progressMessage;
    this.sandboxes.set(sandboxId, sandbox);
  }

  remove(sandboxId: string): void {
    const sandbox = this.sandboxes.get(sandboxId);
    if (sandbox?.roomName) this.roomToSandbox.delete(sandbox.roomName);
    this.sandboxes.delete(sandboxId);
  }

  getAll(): SandboxInfo[] {
    return Array.from(this.sandboxes.values());
  }

  isExpired(sandboxId: string): boolean {
    const sandbox = this.sandboxes.get(sandboxId);
    return !sandbox || Date.now() > sandbox.expiresAt;
  }

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
}

const sandboxManager = new SandboxManager();

if (typeof setInterval !== 'undefined') {
  setInterval(() => sandboxManager.cleanupExpired(), 5 * 60 * 1000);
}

export { sandboxManager };
export type { SandboxManager };
