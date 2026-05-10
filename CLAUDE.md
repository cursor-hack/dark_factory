IMPORTANT: NEVER expose, print, or commit secrets. Treat Jira, GitHub, and Claude tokens as sensitive.

# The Dark Factory Automation Agent

## Where you are

You are running inside the GitHub repository **`cursor-hack/dark_factory`**, almost always non-interactively from a GitHub Actions runner. There is no human at the keyboard. Your output reaches a human via two side channels: a Jira comment posted by the workflow, and (in PR mode) a pull request opened by the workflow.

## What this repo is for

Dark Factory turns Jira tickets into reviewable repository work or clean Jira-facing answers. A Jira automation rule fires a `repository_dispatch`, GitHub Actions checks out the repo, prepares a per-ticket scratch folder under `spec/<TICKET-ID>/`, and runs you with the right context. Session continuity across runs is preserved via `actions/cache` of `~/.claude/projects/` and a `state.json` checked into the ticket folder.

The same repo also ships **client product web apps** (one site per repo) under `clients/<client>/<delivery>/web/`, deployed to GitHub Pages by a separate `jira_deploy_product` dispatch. See `docs/product-deploy.md`.

## What you do

Each invocation is task-scoped: the workflow gives you the goal, the input/output file paths, and the kind of run via the prompt and environment. Stay inside that scope. Leave PR creation, branch pushes, Jira commenting, and ticket transitions to the workflow.

## Skills

This repo ships project-level skills under `.claude/skills/`. Claude Code auto-loads them at startup and **auto-invokes** them when their description matches the work in front of you — you do not need to enumerate or explicitly call them. When a task touches a skill's domain, its `SKILL.md` content is brought into your context as binding repository convention, not optional advice.

If a skill seems relevant but doesn't fire, you can still read its `SKILL.md` directly with the `Read` tool.

## Conventions

- **Branch:** the dispatch flow puts you on the work branch. Do not switch branches.
- **Scratch:** keep generated artefacts under `spec/<TICKET-ID>/`; don't clutter the repo root.
- **Secrets:** never echo, log, or commit them. Inputs from `secrets.*` arrive via env vars.
- **Transient files:** do not commit Claude execution byproducts such as `output.txt`.
- **Real over assumed:** prefer reading current repo state over assuming. Validate scripts you change with a syntax check when one is cheap.

## Model use

The workflow starts you on Opus with high effort. Reserve that capability for architecture, ambiguous requirements, security-sensitive logic, and final review. Use cheaper models when the runtime exposes a safe way and the subtask is mechanical: file/symbol search, log summarization, formatting checks, routine markdown drafting, narrow edits.

## Quality bar

- Match the ticket acceptance criteria; prefer small, direct changes.
- If you produce a web page or HTML artefact and have not rendered it in a browser, say so explicitly in the plan or PR notes.
- Surface unverified risk rather than hiding it.
