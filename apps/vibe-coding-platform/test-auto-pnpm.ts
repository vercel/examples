/**
 * Test automatic pnpm installation and fallback
 */

import {
  createSandbox,
  runCommand,
  uploadFiles,
  stopSandbox,
} from './lib/trigger-wrapper'

async function testAutoPnpm() {
  console.log('🧪 Testing automatic pnpm handling...\n')

  try {
    // 1. Create sandbox
    console.log('1️⃣ Creating sandbox...')
    const sandbox = await createSandbox({
      timeout: 600000,
      ports: [3000],
    })

    if (sandbox.status === 'error') {
      console.error('❌ Failed:', sandbox.error)
      return
    }

    console.log(`✅ Sandbox: ${sandbox.sandboxId}\n`)

    // 2. Upload package.json
    console.log('2️⃣ Creating package.json...')
    await uploadFiles(sandbox.sandboxId, [
      {
        path: '/home/user/app/package.json',
        content: JSON.stringify(
          {
            name: 'test-app',
            version: '1.0.0',
            dependencies: {
              lodash: '^4.17.21',
            },
          },
          null,
          2
        ),
      },
    ])
    console.log('✅ File created\n')

    // 3. Try pnpm install (should auto-install pnpm)
    console.log('3️⃣ Running pnpm install (auto-install enabled)...')
    const pnpmResult = await runCommand(sandbox.sandboxId, {
      command: 'pnpm',
      args: ['install'],
      cwd: '/home/user/app',
      wait: true,
    })

    console.log('Result:')
    console.log('  Status:', pnpmResult.status)
    console.log('  Exit code:', pnpmResult.exitCode)
    console.log('  Output:', pnpmResult.stdout?.substring(0, 300))
    if (pnpmResult.error) {
      console.log('  Error:', pnpmResult.error)
    }

    // 4. Verify installation
    console.log('\n4️⃣ Verifying node_modules...')
    const checkModules = await runCommand(sandbox.sandboxId, {
      command: 'ls',
      args: ['-la', '/home/user/app/node_modules'],
      wait: true,
    })

    if (checkModules.exitCode === 0) {
      console.log('✅ node_modules exists!')
      console.log(
        'Contents:',
        checkModules.stdout?.split('\n').slice(0, 5).join('\n')
      )
    } else {
      console.log('⚠️  node_modules not found')
    }

    // 5. Cleanup
    console.log('\n5️⃣ Cleaning up...')
    await stopSandbox(sandbox.sandboxId)
    console.log('✅ Done!')
  } catch (error) {
    console.error('\n❌ Error:', error)
    if (error instanceof Error) {
      console.error('Message:', error.message)
    }
  }
}

testAutoPnpm().catch(console.error)
