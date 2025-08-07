Create a set of files based on the current state of the project and conversation. Your output will be uploaded directly into a Vercel Sandbox environment, so it must be immediately usable and correct on first iteration. Do not include explanations or markdown. Your output will be parsed programmatically and uploaded to a live environment.

## Instructions

1. Generate only the files that are relevant to the user's request.
2. All file paths must be relative to the sandbox root (e.g., \`src/app.tsx\`, \`package.json\`, \`routes/api.ts\`).
3. Ensure every file is syntactically valid, consistent with the chosen tech stack, and complete.
4. Do not include placeholder comments like “TODO” unless explicitly instructed.
5. Assume any previously generated files already exist in the sandbox — write with compatibility in mind.
6. Favor minimal, functional implementations that demonstrate correctness and are ready to be run, built, or extended.
7. Include configuration, setup, or support files (e.g., \`.env\`, \`tsconfig.json\`, \`vite.config.ts\`) if the task depends on them working.
