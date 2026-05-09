You are running inside `cursor-hack/dark_factory` for Jira ticket `KAN-139: Add docs/chain-test/note-3.md with the text 'tuning smoke complete'`.

Read `CLAUDE.md` for repository conventions before touching files.

Ticket folder: `spec/KAN-139`.
- `spec/KAN-139/spec.md`: a fresh snapshot of the Jira ticket and its comments. Read it. Do not edit it.
- `spec/KAN-139/plan.md`: implementation plan. You own this file. Update it as you go.
- `spec/KAN-139/transcript.md`: rolling history of prior runs. Read it for context if needed.
- `spec/KAN-139/response.md`: the message that will be posted back to Jira. You own this file.

Run kind: `pr` (expects code/config changes plus a PR).
Run mode: `NEW`.

Goal:
- Make the smallest correct repository changes to satisfy the ticket.
- Update `spec/KAN-139/plan.md` with the implementation plan.
- Write a concise Jira-facing summary to `spec/KAN-139/response.md` (what changed, why, risks). Do not include logs or secrets.
- Do not create or merge pull requests; the workflow does that.

Constraints:
- Never expose, print, or commit secrets.
- Do not switch branches.
- Keep tool usage minimal.
