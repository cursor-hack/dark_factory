# Jira `repository_dispatch` JSON bodies

Copy a file’s contents into Jira Automation **Send web request** → **Custom data** (JSON body).

Use with the HTTP setup described in [`../../docs/jira-repository-dispatch-examples.md`](../../docs/jira-repository-dispatch-examples.md): URL `https://api.github.com/repos/<ORG>/<REPO>/dispatches`, headers `Accept`, `Authorization`, `Content-Type`, and optional `X-GitHub-Api-Version`.

| File | `event_type` |
|------|----------------|
| [`jira_manual_button.json`](./jira_manual_button.json) | `jira_manual_button` |
| [`jira_requirements_button_dry-run.json`](./jira_requirements_button_dry-run.json) | `jira_requirements_button` |
| [`jira_requirements_button_apply.json`](./jira_requirements_button_apply.json) | `jira_requirements_button` |
| [`jira_deploy_product.json`](./jira_deploy_product.json) | `jira_deploy_product` |
| [`jira_epic_kickoff.json`](./jira_epic_kickoff.json) | `jira_epic_kickoff` |

Jira replaces `{{issue.key}}` and `{{issue.project.key}}` when the rule runs. Edit `client` / `delivery` in `jira_deploy_product.json` for your product path under `clients/<client>/<delivery>/web/`. That workflow publishes **`dist/`** to **GitHub Pages** for the repo (see `docs/product-deploy.md`).
