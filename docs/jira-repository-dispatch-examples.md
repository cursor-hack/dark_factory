# Ready examples: Jira → GitHub `repository_dispatch`

Use Jira **Automation** → **Then: Send web request** (Cloud). Replace placeholders:

| Placeholder | Meaning |
|-------------|---------|
| `ORG` | GitHub org or user (e.g. `NurMind-com`) |
| `REPO` | Repository name (e.g. `The_Dark_Factory`) |
| `GITHUB_PAT` | Secret in Jira (store the token in Jira’s secret manager / automation credential; never paste in issue text) |

**Request**

- **Method:** `POST`
- **URL:** `https://api.github.com/repos/ORG/REPO/dispatches`
- **Headers**

| Name | Value |
|------|--------|
| `Accept` | `application/vnd.github+json` |
| `X-GitHub-Api-Version` | `2022-11-28` |
| `Authorization` | `Bearer GITHUB_PAT` |
| `Content-Type` | `application/json` |

- **Body:** one JSON object below (exact `event_type` + `client_payload` keys matter).

The PAT must be allowed to call [Create a repository dispatch event](https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event) for that repo.

---

## 1. Ticket coding — `jira_manual_button`

[`jira-dispatch.yml`](../.github/workflows/jira-dispatch.yml)

```json
{
  "event_type": "jira_manual_button",
  "client_payload": {
    "issue_key": "{{issue.key}}"
  }
}
```

---

## 2. Requirements → Jira plan — `jira_requirements_button` (dry run)

[`jira-requirements-dispatch.yml`](../.github/workflows/jira-requirements-dispatch.yml)

```json
{
  "event_type": "jira_requirements_button",
  "client_payload": {
    "issue_key": "{{issue.key}}",
    "project_key": "{{issue.project.key}}",
    "apply_approve": false
  }
}
```

Optional keys (defaults exist in the workflow): `plan_out`, `ledger_out`.

---

## 3. Requirements → plan and **apply** issues in Jira

Same workflow; set `apply_approve` to `true` only when you intend to create/update Jira issues from the generated plan.

```json
{
  "event_type": "jira_requirements_button",
  "client_payload": {
    "issue_key": "{{issue.key}}",
    "project_key": "{{issue.project.key}}",
    "apply_approve": true
  }
}
```

---

## 4. Product web deploy — `jira_deploy_product`

[`jira-product-deploy.yml`](../.github/workflows/jira-product-deploy.yml).  
`client` and `delivery` must match folders: `clients/<client>/<delivery>/web/`. Build always uses **`main`**.

```json
{
  "event_type": "jira_deploy_product",
  "client_payload": {
    "issue_key": "{{issue.key}}",
    "client": "example",
    "delivery": "demo"
  }
}
```

For a real delivery, replace `example` / `demo` with your slugs (lowercase), or drive them from Jira smart values if you have a stable field (e.g. a hidden label parsed in a dedicated rule per environment).

---

## 5. Epic runner — `jira_epic_kickoff`

[`epic-runner.yml`](../.github/workflows/epic-runner.yml)

```json
{
  "event_type": "jira_epic_kickoff",
  "client_payload": {
    "epic_key": "{{issue.key}}"
  }
}
```

Use when the triggering issue **is** the epic (or substitute another smart value that resolves to the epic key).

---

## Raw files (copy without markdown)

JSON-only copies live under [`examples/jira-dispatch/`](../examples/jira-dispatch/) for each `event_type`.

---

## Checklist before going live

1. **GitHub:** workflow file exists on default branch and `repository_dispatch.types` includes your `event_type`.
2. **Jira:** body is valid JSON (no trailing commas); smart values expand to real keys (e.g. `KAN-42`, not literal `{{issue.key}}` in the sent payload—Jira substitutes before send).
3. **PAT:** not expired; least scope needed for dispatch on that repo.
4. **Product deploy:** Enable **GitHub Pages** with source **GitHub Actions** and approve the `github-pages` environment if prompted ([`product-deploy.md`](./product-deploy.md)).
