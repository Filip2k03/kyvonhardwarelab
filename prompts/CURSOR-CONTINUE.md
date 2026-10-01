# Cursor Continue Prompt

Read `AGENTS.md` and the relevant docs/tasks before making changes.

Continue KYVON Hardware Lab from its CURRENT repository state.

Do not regenerate the project.
Do not replace working architecture.
Do not redesign unrelated features.

First inspect:

- git diff
- current task status
- failing tests
- TypeScript errors
- build status

Identify the next incomplete task from `/tasks`.

Implement that task completely.

After implementation:

- run lint
- run typecheck
- run tests
- run production build
- fix failures caused by your changes

Update documentation only when implementation has actually changed.

Preserve production-quality architecture and existing working functionality.
