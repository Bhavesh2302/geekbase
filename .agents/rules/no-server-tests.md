# Server Testing Policy

- **No Server-Side Automated Tests**: Do not create, generate, or commit test files, test suites (`tests/`, `*.test.ts`, `*.spec.ts`), or testing scripts on the server side under any circumstances unless explicitly requested by the user.
- **Production Focus**: Keep the server codebase focused strictly on production features, controllers, models, routes, middlewares, services, utilities, and validations.
- **Verification Strategy**: Verify server implementations using TypeScript type checks (`npm run type-check`), production builds (`npm run build`), and direct HTTP/cURL verification instead of writing test files.
