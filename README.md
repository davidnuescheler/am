# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Documentation

Before using the aem-block-collection, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)
5. [AEM Block Collection](https://www.aem.live/developer/block-collection#block-collection-1)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Catalog login

The `/catalog` page requires an access code matching the `Password` value of
a row in `/passwords.json`. Publish that sheet with a `Password` column
and a `data` array of rows. Password values must be strings; no username is required.

Successful access codes (in plaintext) are saved in
localStorage under `catalog-login` and rechecked against the sheet on each
visit. Remove that localStorage entry to forget the saved login. Failed checks
or unavailable credentials keep the catalog hidden and allow retrying.

This is only a client-side convenience gate, not access control. The password
sheet, saved passwords, and page content are accessible to browser users.
Do not use sensitive or reused passwords; protecting confidential content
requires server-side authentication.

## Publishing from the footer

The footer's **Publish** button updates the current page's preview, then publishes
it using sequential POST requests to `admin.hlx.page`. Publishing stops if preview
fails, and the footer displays progress, success, or an error.
On `/catalog`, it also previews and publishes `/passwords.json` after publishing
the page. Success is reported only when both resources have been published.
The page reloads after all publishing operations succeed; failures do not reload it.

Requests use the `davidnuescheler/am` site and the branch from its AEM/Helix hostname,
or `main` on custom domains and localhost. Resource paths exclude query parameters
and fragments.

The browser must have a valid AEM admin session with preview and publish permissions
when the site requires authentication. Cross-origin requests include credentials,
so browser cookie restrictions and the Admin API's CORS policy must permit them.
The catalog access code does not grant publishing permissions.

## Local development

1. Create a new repository based on the `aem-block-collection` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)