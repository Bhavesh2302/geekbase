# Geekbase Project Guidelines for AI Agents

## Testing Policy
- **No Server-Side Tests**: Do not create or generate automated test files (`tests/`, `*.test.ts`, `*.spec.ts`), test runner scripts, or test suites in the `server` directory. The user has explicitly requested to keep the server free of testing files.
- **Verification**: Always verify server implementations using TypeScript compilation (`npm run type-check`), production builds (`npm run build`), and API responses via cURL/runtime inspection.

## Workflow & Command Execution Policy
- **Autonomous Command Execution**: Proactively run commands (type-checks, builds, installs, seeds, commits) without asking for confirmation.
- **Deletions Require Confirmation**: Only ask for confirmation before executing file/directory deletion commands (`rm -rf` or file removals).
- **Git Commits**: Commit changes after completing each functional feature with a clean, single-purpose commit message.
- **Git Push Approval**: Never push to `main` (or any remote branch) without explicitly asking the user for permission first.

