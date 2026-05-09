# dark_factory

> Dark Factory — orchestrator scaffolding under the `cursor-hack` org.

## Status

KAN-8 foundation implemented: markdown requirements can now be converted into a structured Jira plan and then applied to Jira with an explicit approval gate.

## Layout

```text
dark_factory/
├── clients/
│   └── <client>/<delivery>/web/   ← product UI; build → dist/ (see docs/product-deploy.md)
├── specs/
│   └── product-requirements.md
├── schemas/
│   └── jira-plan.schema.json
├── scripts/
│   ├── dark-factory.ts
│   └── generate-jira-plan.ts
├── output/
│   └── generated-plan.json (created by CLI)
└── tests/
    └── *.test.mjs
```

## Getting started

```bash
git clone git@github.com:cursor-hack/dark_factory.git
cd dark_factory
npm install
```

## Flow

**Jira → GitHub:** copy-paste URL, headers, and JSON bodies for every `repository_dispatch` type in [`docs/jira-repository-dispatch-examples.md`](docs/jira-repository-dispatch-examples.md) (raw JSON under [`examples/jira-dispatch/`](examples/jira-dispatch/)).

### 1 — Generate plan (Claude Code does this, triggered from Jira)

Click the "Requirements To Jira Plan" button on a Jira ticket.
The workflow (`jira-requirements-dispatch.yml`) does:
1. **Fetch** the ticket from Jira → `output/requirements-from-jira.md`
2. **Build prompt** for Claude Code (`jira-plan-prepare.mjs`)
3. **Claude Code** reads the spec, reasons about scope, and writes `output/generated-plan.json`
4. **Validate** the JSON against `schemas/jira-plan.schema.json`
5. **Preflight** (dry run) or **apply** to Jira if `apply_approve=true`
6. **Comment** plan summary back to the Jira ticket

### 2 — Apply an existing plan (deterministic, CLI)

```bash
# Preflight — print summary, no writes
npx tsx scripts/dark-factory.ts apply output/generated-plan.json --project KAN

# Apply — create Epics, Tasks, Subtasks in Jira
npx tsx scripts/dark-factory.ts apply output/generated-plan.json \
  --project KAN --approve --out output/applied-issues.json
```

Apply is idempotent: SHA-256 fingerprints prevent duplicate issues on reruns.

### 3 — Deploy a product web app (Jira button)

Put the site under `clients/<client>/<delivery>/web/` with `npm run build` producing `dist/`. A Jira rule sends `repository_dispatch` with `event_type` **`jira_deploy_product`**; GitHub Actions builds from **`main`** and publishes **`dist/`** to **GitHub Pages**. Full setup (payload, Pages settings): [`docs/product-deploy.md`](docs/product-deploy.md).

Required env vars for Jira apply:

```bash
export JIRA_BASE_URL="https://<site>.atlassian.net"
export JIRA_EMAIL="<email>"
export JIRA_API_TOKEN="<token>"
```

## Verification

```bash
npm test
```

## License

Not yet decided.
