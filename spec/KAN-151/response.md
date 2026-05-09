Blocked: the source-bundle URL is missing from the ticket description.

The "Source bundle (Drive export mirrored on LimeWire)" section contains an
empty blockquote — no URL was rendered into the spec snapshot the agent runs
against. Without it the LimeWire fetch cannot start, so per the ticket's
own Hard Rule #1 ("If the LimeWire fetch fails after a few retries, STOP …
Do not proceed") I made no repository changes this run.

I deliberately did not:

- substitute different painters (Hard Rule #3),
- use placeholder image services such as picsum/unsplash (Hard Rule #4),
- rewrite bios from general knowledge (Hard Rule #5),
- scaffold a half-built Astro site that would deploy as an empty page.

To unblock, please edit this ticket's description and paste the LimeWire URL
(with its `#…` decryption fragment intact) into the blockquote under
"Source bundle", then re-click the **Dark Factory dispatch** Manual Trigger.
On the next run I will:

1. drive headless Chromium to download the zip,
2. extract the five required `archive_id` folders into
   `clients/painters-demo/v1/web/content/painters/`,
3. build the Astro 4 single-page gallery per the spec,
4. push and fire `jira-product-deploy.yml` with
   `client=painters-demo delivery=v1`,
5. comment back here with the live `https://cursor-hack.github.io/dark_factory/`
   URL.

Implementation plan recorded at `spec/KAN-151/plan.md` for continuity.
