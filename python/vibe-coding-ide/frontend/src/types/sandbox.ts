export type FileHashes = Record<string, string>

export type Snapshot = {
  at: string // ISO timestamp
  fileHashes: FileHashes
}

export type SandboxState = {
  sandboxId?: string
  lastEditorSync?: Snapshot
  lastSandboxSeen?: Snapshot
  // Optional cache of last known sandbox file contents keyed by path (decoded text)
  lastData?: Record<string, string>
  // If true, push editor state to sandbox on the next run
  shouldSyncOnNextRun?: boolean
}
