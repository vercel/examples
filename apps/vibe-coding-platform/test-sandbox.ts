/**
 * Test script for e2b sandbox creation and command execution
 * Run with: E2B_API_KEY=your_key npx tsx test-sandbox.ts
 * Or: npx tsx --env-file=.env.local test-sandbox.ts
 */

import {
  createSandboxHandler,
  runCommandHandler,
  uploadFilesHandler,
  stopSandboxHandler,
} from './trigger/handlers'

async function testSandbox() {
  console.log('🚀 Starting e2b sandbox test...\n')

  try {
    // Test 1: Create sandbox
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

    // Test 2: Run a simple command
    console.log('2️⃣  Running echo command...')
    const echoResult = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'echo',
        args: ['Hello from e2b!'],
        wait: true,
      },
    })

    if (echoResult.status === 'failed') {
      console.error('❌ Command failed:', echoResult.error)
    } else {
      console.log('✅ Command executed successfully')
      console.log(`   Exit code: ${echoResult.exitCode}`)
      console.log(`   Output: ${echoResult.stdout?.trim()}\n`)
    }

    // Test 3: Create a file
    console.log('3️⃣  Creating test file...')
    const uploadResult = await uploadFilesHandler({
      sandboxId: sandbox.sandboxId,
      files: [
        {
          path: '/tmp/test.txt',
          content: 'Hello from Trigger.dev + e2b integration!',
        },
      ],
    })

    if (!uploadResult.success) {
      console.error('❌ File upload failed:', uploadResult.error)
    } else {
      console.log('✅ File created:', uploadResult.uploaded?.join(', '))
    }

    // Test 4: Read the file back
    console.log('\n4️⃣  Reading file content...')
    const readResult = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'cat',
        args: ['/tmp/test.txt'],
        wait: true,
      },
    })

    if (readResult.status === 'completed') {
      console.log('✅ File content:', readResult.stdout?.trim())
    } else {
      console.error('❌ Failed to read file')
    }

    // Test 5: Run a more complex command
    console.log('\n5️⃣  Running system info command...')
    const infoResult = await runCommandHandler({
      sandboxId: sandbox.sandboxId,
      command: {
        command: 'uname',
        args: ['-a'],
        wait: true,
      },
    })

    if (infoResult.status === 'completed') {
      console.log('✅ System info:', infoResult.stdout?.trim())
    }

    // Clean up
    console.log('\n6️⃣  Cleaning up sandbox...')
    const stopResult = await stopSandboxHandler({
      sandboxId: sandbox.sandboxId,
    })

    if (stopResult.success) {
      console.log('✅ Sandbox stopped successfully\n')
    } else {
      console.error('❌ Failed to stop sandbox:', stopResult.error)
    }

    console.log('🎉 All tests completed successfully!')
  } catch (error) {
    console.error('\n❌ Test failed with error:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
      console.error('   Stack:', error.stack)
    }
  }
}

// Run the test
testSandbox().catch(console.error)
