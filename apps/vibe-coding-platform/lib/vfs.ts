import { promises as fs } from 'fs'
import path from 'path'

const VFS_ROOT = path.join(process.cwd(), '.vfs')

export async function ensureVfsRoot() {
  await fs.mkdir(VFS_ROOT, { recursive: true })
}

export async function writeVfsFiles(
  sandboxId: string,
  files: { path: string; content: string }[],
) {
  const sandboxDir = path.join(VFS_ROOT, sandboxId)
  await fs.mkdir(sandboxDir, { recursive: true })

  for (const file of files) {
    const fullPath = path.join(sandboxDir, file.path)
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.writeFile(fullPath, file.content, 'utf8')
  }
}

export async function readVfsFiles(
  sandboxId: string,
): Promise<Record<string, string>> {
  const sandboxDir = path.join(VFS_ROOT, sandboxId)
  const files: Record<string, string> = {}

  async function walk(dir: string, relativePath: string = '') {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      for (const entry of entries) {
        const res = path.join(dir, entry.name)
        const rel = path.join(relativePath, entry.name)
        if (entry.isDirectory()) {
          await walk(res, rel)
        } else {
          files[rel] = await fs.readFile(res, 'utf8')
        }
      }
    } catch (e) {
      // Ignore if dir doesn't exist
    }
  }

  await walk(sandboxDir)
  return files
}
