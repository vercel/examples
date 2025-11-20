/**
 * Debug pnpm installation issues
 */

import {
  createSandboxHandler,
  runCommandHandler,
  uploadFilesHandler,
  stopSandboxHandler,
} from './trigger/handlers'

async function debugPnpm() {
  console.log('🔍 Debugging pnpm installation...\n')

  try {
    // Create sandbox
    console.log('1️⃣ Creating sandbox...')
    const sandbox = await createSandboxHandler({
      timeout: 600000,
      ports: [3000],
    })

    if (sandbox.status === 'error') {
      console.error('❌ Failed:', sandbox.error)
      return
    }

    console.log(`✅ Sandbox: ${sandbox.sandboxId}\n`)

    // Install pnpm
    console.log('2️⃣ Installing pnpm...')
    const installPnpm = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'npm',
        args: ['install', '-g', 'pnpm@latest'],
        wait: true,
      },
    })

    console.log('pnpm install result:')
    console.log('  Status:', installPnpm.status)
    console.log('  Exit code:', installPnpm.exitCode)
    console.log('  Stdout:', installPnpm.stdout?.substring(0, 500))
    console.log('  Stderr:', installPnpm.stderr?.substring(0, 500))

    // Verify pnpm
    console.log('\n3️⃣ Verifying pnpm...')
    const checkPnpm = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'pnpm',
        args: ['--version'],
        wait: true,
      },
    })

    console.log('pnpm version check:')
    console.log('  Status:', checkPnpm.status)
    console.log('  Exit code:', checkPnpm.exitCode)
    console.log('  Version:', checkPnpm.stdout?.trim())

    // Create package.json
    console.log('\n4️⃣ Creating package.json...')
    await uploadFilesHandler({
      sandboxId: sandbox.sandboxId,
      files: [
        {
          path: '/home/user/app/package.json',
          content: JSON.stringify(
            {
              name: 'test-app',
              version: '1.0.0',
              dependencies: {
                next: '^14.0.0',
                react: '^18.2.0',
                'react-dom': '^18.2.0',
              },
            },
            null,
            2
          ),
        },
      ],
    })

    // Verify file
    const catPackage = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'cat',
        args: ['/home/user/app/package.json'],
        wait: true,
      },
    })
    console.log('package.json content:', catPackage.stdout?.substring(0, 200))

    // Try pnpm install with explicit cwd
    console.log('\n5️⃣ Running pnpm install...')
    const pnpmInstall = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'pnpm',
        args: ['install', '--no-frozen-lockfile'],
        cwd: '/home/user/app',
        wait: true,
      },
    })

    console.log('pnpm install result:')
    console.log('  Status:', pnpmInstall.status)
    console.log('  Exit code:', pnpmInstall.exitCode)
    console.log('  Stdout:', pnpmInstall.stdout?.substring(0, 1000))
    console.log('  Stderr:', pnpmInstall.stderr?.substring(0, 1000))

    // Check node_modules
    console.log('\n6️⃣ Checking node_modules...')
    const lsModules = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'ls',
        args: ['-la', '/home/user/app/'],
        wait: true,
      },
    })
    console.log('Directory contents:', lsModules.stdout)

    // Cleanup
    console.log('\n7️⃣ Cleaning up...')
    await stopSandboxHandler({ sandboxId: sandbox.sandboxId })
    console.log('✅ Done!')
  } catch (error) {
    console.error('\n❌ Error:', error)
    if (error instanceof Error) {
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
    }
  }
}

debugPnpm().catch(console.error)
