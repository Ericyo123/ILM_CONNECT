<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Browser and Preview Interactions
Do not automatically open, launch, or refresh the browser preview after making code changes. Make the requested changes directly in the code, and only run the necessary checks. Do not start a preview server or open the browser unless I explicitly ask you to preview or test the UI. Prioritize fast execution and avoid unnecessary browser interactions.

## Git & Deployment Rules
- Do NOT push to GitHub or any remote repository until explicitly instructed by the user. Keep all commits local.
