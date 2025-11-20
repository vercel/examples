/**
 * Test pnpm installation and Next.js app setup in e2b sandbox
 * Run with: E2B_API_KEY="$(grep E2B_API_KEY .env.local | cut -d '=' -f2)" npx tsx test-pnpm-setup.ts
 */

import {
  createSandboxHandler,
  runCommandHandler,
  uploadFilesHandler,
  getPreviewURLHandler,
  stopSandboxHandler,
} from './trigger/handlers'

async function testPnpmSetup() {
  console.log('🚀 Testing pnpm and Next.js setup in e2b sandbox...\n')

  try {
    // Step 1: Create sandbox
    console.log('1️⃣  Creating sandbox...')
    const sandbox = await createSandboxHandler({
      timeout: 600000,
      ports: [3000],
    })

    if (sandbox.status === 'error') {
      console.error('❌ Failed to create sandbox:', sandbox.error)
      return
    }

    console.log(`✅ Sandbox created: ${sandbox.sandboxId}\n`)

    // Step 2: Check if pnpm is installed
    console.log('2️⃣  Checking for pnpm...')
    const checkPnpm = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'which',
        args: ['pnpm'],
        wait: true,
      },
    })

    if (checkPnpm.exitCode !== 0) {
      console.log('⚠️  pnpm not found, installing...')

      // Install pnpm globally
      const installPnpm = await runCommandHandler({
        sandboxId: sandbox.sandboxId,
        command: {
          command: 'npm',
          args: ['install', '-g', 'pnpm'],
          wait: true,
        },
      })

      if (installPnpm.exitCode === 0) {
        console.log('✅ pnpm installed successfully')
      } else {
        console.error('❌ Failed to install pnpm:', installPnpm.stderr)
        await stopSandboxHandler({ sandboxId: sandbox.sandboxId })
        return
      }
    } else {
      console.log('✅ pnpm is already installed')
    }

    // Step 3: Create a simple Next.js app
    console.log('\n3️⃣  Creating Next.js app files...')
    await uploadFilesHandler({
      sandboxId: sandbox.sandboxId,
      files: [
        {
          path: '/home/user/app/package.json',
          content: JSON.stringify(
            {
              name: 'test-app',
              version: '1.0.0',
              scripts: {
                dev: 'next dev',
              },
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
        {
          path: '/home/user/app/pages/index.js',
          content: `export default function Home() {
  return <h1>Hello from e2b + pnpm!</h1>
}`,
        },
      ],
    })
    console.log('✅ Files created')

    // Step 4: Run pnpm install
    console.log('\n4️⃣  Running pnpm install...')
    const pnpmInstall = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'pnpm',
        args: ['install'],
        cwd: '/home/user/app',
        wait: true,
      },
    })

    if (pnpmInstall.exitCode === 0) {
      console.log('✅ pnpm install succeeded')
    } else {
      console.error('❌ pnpm install failed:')
      console.error('Exit code:', pnpmInstall.exitCode)
      console.error('Stderr:', pnpmInstall.stderr)
    }

    // Step 5: Start dev server in background
    console.log('\n5️⃣  Starting Next.js dev server...')
    const startDev = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'pnpm',
        args: ['dev'],
        cwd: '/home/user/app',
        wait: false, // Run in background
      },
    })

    console.log('✅ Dev server started (background process)')

    // Wait for server to start
    console.log('\n6️⃣  Waiting for server to be ready...')
    await new Promise((resolve) => setTimeout(resolve, 10000))

    // Step 6: Get preview URL
    console.log('\n7️⃣  Getting preview URL...')
    const previewResult = await getPreviewURLHandler({
      sandboxId: sandbox.sandboxId,
      port: 3000,
    })

    if (previewResult.success && previewResult.url) {
      console.log('✅ Preview URL:', previewResult.url)
      console.log(
        '\n📝 Note: Visit this URL in your browser to see the app running!'
      )
    } else {
      console.error('❌ Failed to get preview URL:', previewResult.error)
    }

    // Step 7: Test the server
    console.log('\n8️⃣  Testing server response...')
    const curlTest = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'curl',
        args: ['-s', 'http://localhost:3000'],
        wait: true,
      },
    })

    if (curlTest.stdout && curlTest.stdout.includes('Hello')) {
      console.log('✅ Server is responding correctly!')
      console.log('Response:', curlTest.stdout.substring(0, 200))
    } else {
      console.log('⚠️  Server response:', curlTest.stdout?.substring(0, 200))
    }

    // Keep sandbox running for manual testing
    console.log(
      '\n✅ Test complete! Sandbox is still running for manual testing.'
    )
    console.log('   Preview URL:', previewResult.url)
    console.log('   Press Ctrl+C to stop (sandbox will remain active)')
    console.log(
      '\n   To cleanup manually, run: await stopSandboxHandler({ sandboxId: "' +
        sandbox.sandboxId +
        '" })'
    )

    // Don't auto-cleanup for manual testing
    // await stopSandboxHandler({ sandboxId: sandbox.sandboxId });
  } catch (error) {
    console.error('\n❌ Test failed with error:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
      console.error('   Stack:', error.stack)
    }
  }
}

// Run the test
testPnpmSetup().catch(console.error)
