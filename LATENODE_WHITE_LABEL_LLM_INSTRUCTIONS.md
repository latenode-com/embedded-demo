# Latenode White-Label LLM Instructions

## Purpose
Use this document as the implementation brief for an LLM coding agent integrating Latenode white-label/embedded mode into a product. The goal is to embed Latenode inside an existing app, authenticate users through the app's own auth system, optionally brand the UI, and optionally automate admin operations through the white-label API.

This guide synthesizes the official Latenode white-label docs into one practical document:
- [White Label index](https://github.com/latenode-com/latenode-docs-public/blob/main/docs/white-label/index.mdx)
- [Overview](https://github.com/latenode-com/latenode-docs-public/blob/main/docs/white-label/overview.mdx)
- [Administration](https://github.com/latenode-com/latenode-docs-public/blob/main/docs/white-label/administration.mdx)
- [Installing the embedded SDK](https://github.com/latenode-com/latenode-docs-public/blob/main/docs/white-label/installing-the-embedded-sdk.mdx)
- [User authorization](https://github.com/latenode-com/latenode-docs-public/blob/main/docs/white-label/user-authorization.mdx)
- [Sandbox](https://github.com/latenode-com/latenode-docs-public/blob/main/docs/white-label/sandbox.mdx)
- [API usage](https://github.com/latenode-com/latenode-docs-public/blob/main/docs/white-label/api-usage.mdx)
- [Embedded SDK functions](https://github.com/latenode-com/latenode-docs-public/blob/main/docs/white-label/embedded-sdk-functions.mdx)

## What Latenode White-Label Is
Latenode white-label embeds the Latenode product in your frontend as an `iframe`, while your own application remains the source of truth for user authentication. Users log into your app, your backend signs a JWT for Latenode, and the embedded SDK uses that JWT to authorize the user into the embedded interface.

In practice, the integration has three layers:
1. Admin setup in Latenode white-label.
2. Backend JWT issuance and optional admin/API operations.
3. Frontend iframe embedding through the Latenode Embedded SDK.

## Required Inputs
Before implementing anything, collect these values:

| Item | Required | Notes |
| --- | --- | --- |
| White-label admin account | Yes | Needed for plan management and API token creation |
| Latenode JWT signing private key | Yes | Issued by Latenode support; keep server-side only |
| `tenant_id` | Yes | Numeric tenant identifier provided by Latenode |
| `plan_id` | Usually | Used on first authorization if you want automatic plan assignment |
| White-label API token | Optional | Needed for server-side plan/subscription/user/space/report management |
| Space IDs / role IDs | Optional | Needed only if assigning users into shared spaces |

## Recommended Integration Flow
Implement in this order unless the project already has equivalent primitives:

1. Set up at least one white-label subscription plan in the admin dashboard.
2. Add a backend endpoint that issues a short-lived Latenode JWT for the currently authenticated app user.
3. Add a frontend container where the iframe will be rendered.
4. Load the embedded SDK script and call `configure()` with a minimal config first.
5. Once embed/auth works, layer on branding, theme, translations, and navigation callbacks.
6. If needed, add server-side wrappers for white-label admin APIs such as plan management, subscription assignment, reporting, and space membership.

Start minimal. Do not begin by implementing the full SDK config tree.

## Administration Setup
Before users can be onboarded reliably, create at least one plan in the Latenode white-label admin panel.

### Plan setup expectations
The docs indicate that a plan controls quotas such as:
- Execution microcredits
- Plug and Play microtokens
- Active scenarios limit
- Parallel executions limit
- Minimum execution charging period
- AI assistant requests limit
- Connected accounts limit
- Minimum trigger interval
- Execution history availability period

### Admin tasks to complete manually
1. Log in to the white-label administrator dashboard.
2. Open `White Label -> Plans`.
3. Create at least one plan.
4. Save the resulting `plan_id`.
5. Optionally create an API token in `White Label -> Access Tokens` for backend admin automation.

If your app wants every newly embedded user to receive a default plan automatically, include `plan_id` in that user's first JWT.

## Authentication Model
The app authenticates the user first. Your backend then signs a JWT that Latenode accepts inside the embedded iframe. The JWT is the bridge between your app session and the Latenode embedded session.

### JWT requirements
Header:

```json
{
  "alg": "RS512",
  "typ": "JWT"
}
```

Supported signing algorithms from the docs:
- `RS256`
- `RS384`
- `RS512`
- `ES256`
- `ES256K`
- `ES384`
- `ES512`
- `PS256`
- `PS384`
- `PS512`

Required payload fields:
- `tenant_id`: numeric Latenode tenant ID
- `user_id`: unique string identifier for the user in your system
- `exp`: numeric expiration timestamp

Optional payload fields:
- `plan_id`: numeric plan ID, typically only needed for the user's first authorization
- `no_personal_space`: boolean; if `true`, create the user without a personal space
- `grant_access`: array of space assignments; required when `no_personal_space` is `true`

Example payload:

```json
{
  "tenant_id": 1,
  "user_id": "user_123",
  "plan_id": 35,
  "no_personal_space": true,
  "grant_access": [
    {
      "space_id": 2,
      "role_id": 2
    }
  ],
  "exp": 1768417200
}
```

### Role IDs
When granting access to spaces, use the documented role IDs:

| Role | `role_id` | Notes |
| --- | --- | --- |
| Admin | `1` | Full access; only one admin can exist per space |
| Manager | `2` | Similar to admin, but cannot add/remove users |
| No-code | `3` | Can manage scenarios but not folders/users/space settings |
| Read only | `4` | Can view and run scenarios only |

### Auth implementation rules for LLMs
- Generate JWTs only on the backend.
- Never expose the Latenode private signing key to the browser.
- Keep token lifetime short unless product requirements demand otherwise.
- Treat `plan_id` as onboarding/default provisioning logic, not a field that must be sent forever.
- If `no_personal_space=true`, always send `grant_access`.
- The `user_id` must be stable over time for the same person.

## Backend Reference Architecture
Recommended backend responsibilities:

1. Validate the app's own session or access token.
2. Load the current app user.
3. Map the user to a stable Latenode `user_id`.
4. Generate a Latenode JWT using the Latenode-issued private key.
5. Return only the signed JWT to the frontend.
6. Optionally expose server-side routes that proxy white-label admin APIs.

Suggested endpoints:
- `POST /api/latenode/token`: return an embedded JWT for the current user
- `GET /api/latenode/plans`: optional internal wrapper around white-label plans API
- `POST /api/latenode/subscriptions`: optional assignment endpoint
- `POST /api/latenode/reporting/consumption`: optional reporting wrapper

### Example backend pseudocode
```ts
import jwt from "jsonwebtoken";

export async function issueLatenodeToken(appUser: { id: string }) {
  const payload = {
    tenant_id: Number(process.env.LATENODE_TENANT_ID),
    user_id: appUser.id,
    plan_id: Number(process.env.LATENODE_DEFAULT_PLAN_ID),
    exp: Math.floor(Date.now() / 1000) + 60 * 10
  };

  return jwt.sign(payload, process.env.LATENODE_PRIVATE_KEY!, {
    algorithm: "RS512"
  });
}
```

## Frontend Embed Recipe
The iframe container must already exist in the DOM before calling the SDK.

### Minimal HTML container
```html
<div id="latenode-embed" style="width: 100%; height: 100vh;"></div>
```

### Load the SDK
```html
<script src="https://embedded.latenode.com/static/sdk/0.1.5.js"></script>
```

The script exposes `LatenodeEmbeddedSDK` on `window`.

### Minimal frontend initialization
```html
<script>
  async function initLatenode() {
    const response = await fetch("/api/latenode/token", {
      method: "POST",
      credentials: "include"
    });

    const { token } = await response.json();

    const sdk = new window.LatenodeEmbeddedSDK();

    await sdk.configure({
      allowCookies: true,
      token,
      container: "latenode-embed",
      ui: {
        scenarios: {
          hideEmptyScenariosGreetings: true
        },
        main: {
          hideSideMenu: false
        }
      },
      navigation: {
        handler: ({ route }) => {
          console.log("Latenode route changed:", route);
        }
      }
    });

    window.latenodeSdk = sdk;
  }

  initLatenode().catch(console.error);
</script>
```

### SDK lifecycle methods worth using
- `configure(...)`: renders and initializes the iframe; returns a `Promise`
- `navigate({ to: "/scenarios" })`: navigates within the iframe
- `cleanup()`: removes registered callbacks and should be called during teardown/unmount

### Frontend implementation rules for LLMs
- Ensure the SDK script loads before creating the SDK instance.
- Ensure the target container is already mounted before `configure()`.
- Call `cleanup()` when unmounting SPA routes/components.
- Prefer initializing with a small config, then add branding overrides incrementally.
- If the app uses React/Next/Vue, wrap SDK init in client-only lifecycle code.

## Customization Surface
The SDK supports a very large configuration object. Do not dump the entire schema into product code unless the project truly needs it. Group customizations by outcome.

### Common customization groups
- `ui.scenarios`
  - empty-state behavior
  - "Explore Apps" visibility
  - custom logo
  - scenarios table styling
  - search input styling
  - folder panel width
- `ui.scenario`
  - grid visibility
  - node type list styling
  - action bar buttons and layout
  - node data panel styling
  - template button styling
- `ui.main`
  - side menu visibility
  - custom documentation URL
- `ui.theme`
  - base font family
  - font loading via Google Fonts or custom font URL
  - primary color
  - button styles by type/state
  - input radius
  - switch styles
  - scenario/editor colors
- `ui.translations`
  - language selection
  - per-key string overrides
- `navigation.handler`
  - route-change callback from inside the iframe

### Practical customization strategy
1. Start with no theme overrides.
2. Add logo, `primaryColor`, and button styles.
3. Add only the editor/list tweaks users actually need.
4. Add translations last.
5. Keep all custom config in one file/object so it can be maintained as a design artifact.

### Safe first-pass config
```js
const uiConfig = {
  scenarios: {
    hideEmptyScenariosGreetings: true,
    hideExploreAppsButton: true
  },
  main: {
    hideSideMenu: false,
    documentationURL: "https://your-app.example/docs"
  },
  theme: {
    primaryColor: "#2394ae",
    input: {
      borderRadius: "20px"
    }
  },
  translations: {
    currentLng: "en",
    overrides: {
      en: {
        latenode_scenariosPage_allScenariosTitleLabel: "All automations"
      }
    }
  }
};
```

## Optional Embedded SDK Automation Functions
Starting with SDK `0.1.5`, the embedded SDK can also be used programmatically after initialization.

### Supported methods
- `await sdk.runOnce()`
- `await sdk.save()`
- `await sdk.deploy()`
- `sdk.toggleActiveScenarioState()`
- `await sdk.createEmptyScenario(title?)`
- `await sdk.getNodeTypes()`
- `await sdk.addNewNode(nodeTypeId, title?)`
- `await sdk.getScenarioWebhooksUrls()`
- `await sdk.createWebhookScenario(scenarioTitle?, nodeTitle?)`
- `sdk.setScenarioRunningStateChangedListener(handler)`

### Recommended usage
- Use these methods only after `configure()` resolves.
- Treat these as UX accelerators, not a replacement for server-side governance.
- If exposing actions like deploy/run from your app shell, guard them with your own product permissions.

### Example
```ts
const sdk = window.latenodeSdk;

await sdk.createEmptyScenario("New automation");
await sdk.save();
await sdk.deploy();
```

## White-Label Admin API
The white-label API is for organization-level administration, billing, space access, reporting, and inspection tasks. It should normally be called from the backend only.

### Authentication
Every request includes the white-label API token in the query string:

```text
?AUTH_TOKEN=YOUR_API_TOKEN
```

### Common response envelope
Do not rely solely on HTTP status. The docs explicitly say failures can still return `200`.

Successful shape:
```json
{
  "success": true,
  "request_id": "Spawv468Km1GW7ljPqGR",
  "data": {},
  "errors": []
}
```

Error shape:
```json
{
  "success": false,
  "data": null,
  "errors": [
    {
      "message": "Unauthorized",
      "code": "auth.Unauthorized"
    }
  ],
  "request_id": "xbpvv24sh4m3mALFhyZk"
}
```

### API handling rules for LLMs
- Always check `success`.
- Log `request_id` for debugging/support.
- Read the first item in `errors` for the canonical error code.
- Keep the API token on the server.
- Normalize Latenode API errors into the app's own error format.

## Endpoint Map
The following endpoint list is a practical summary, not a full schema dump.

### Plans and quotas
| Purpose | Method | URL |
| --- | --- | --- |
| Get tenant quotas | `GET` | `https://api.latenode.com/latenode/v1/whitelabel/quotas` |
| List plans | `GET` | `https://api.latenode.com/latenode/v1/whitelabel/plans` |
| Create plan | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/plans` |
| Update plan | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/plans/update` |
| Archive plan | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/plans/archive` |

Implementation notes:
- Plan features are quota aliases plus values.
- Use plan APIs for internal admin tooling, not browser-direct usage.
- Plan updates are full replacements, not partial patches. Send the full `name` and full `features` array.
- Archive instead of deleting when retiring plans.

### Subscriptions
| Purpose | Method | URL |
| --- | --- | --- |
| List subscriptions | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/subscriptions/list` |
| Assign subscription | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/subscriptions` |
| Cancel subscription | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/subscriptions/cancel` |

Implementation notes:
- Assign with `user_id` and `plan_id`.
- Listing can optionally include consumption.
- A user can have multiple subscriptions; the docs state the best quotas apply.

### Users and reporting
| Purpose | Method | URL |
| --- | --- | --- |
| List users | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/users/list` |
| Consumption report | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/reports/consumption` |
| Credit/resource charge | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/billing/resource` |

Implementation notes:
- Consumption reporting supports total and per-user views.
- Billing resource charge can add resource quantity for a user.
- Reports accept date ranges and resource filters.
- User listing can optionally include subscriptions, consumption, and connected spaces.

### Space access and collaboration
| Purpose | Method | URL |
| --- | --- | --- |
| Grant user access to space | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/space/access/grant` |
| Revoke user access from space | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/space/access/revoke` |
| Update space name | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/space/update` |

Implementation notes:
- Grant/revoke uses `grantee_user_id` and either owner/tenant-space parameters.
- Use role IDs consistently.
- These operations are useful when your app manages team/workspace membership externally.

### Scenarios and execution inspection
| Purpose | Method | URL |
| --- | --- | --- |
| List scenarios in a space | `POST` | `https://api.latenode.com/latenode/v1/whitelabel/scenarios/list` |
| Get execution details | `GET` | `https://api.latenode.com/latenode/v1/whitelabel/scenarios/execution` |

Implementation notes:
- Scenario listing requires `space_id`.
- Execution lookup requires `execution_id`.
- Use these endpoints for admin views, diagnostics, or support tooling.

## Suggested Internal Backend Wrappers
If building production-quality integration, wrap the Latenode admin API behind your own internal services instead of scattering raw fetch calls around the app.

Suggested internal wrappers:
- `issueEmbeddedTokenForCurrentUser()`
- `assignDefaultLatenodePlan(userId)`
- `grantUserToLatenodeSpace({ granteeUserId, ownerUserId, roleId })`
- `getLatenodeConsumptionReport({ start, end, resources })`
- `getLatenodeScenarioExecution(executionId)`

Benefits:
- consistent auth
- retry and logging
- centralized error translation
- easier testing and future API changes

## Sandbox Usage
Latenode provides a sandbox example repository for testing JWT generation and embedded initialization:
- Sandbox repo: [whitelabel-example](https://github.com/latenode-com/whitelabel-example)
- Sandbox README: [README.md](https://github.com/latenode-com/whitelabel-example/blob/main/README.md)

Use the sandbox to validate:
- private key format
- selected signing algorithm
- payload shape
- first successful embedded login
- initial UI config

Do not treat the sandbox as production architecture. It is a proving ground, not the blueprint for your app's backend/security model.

## Known Browser Limitations
The docs explicitly warn that standard iframe auth may fail when third-party cookies are blocked.

Affected cases called out by the docs:
- Safari
- Chrome incognito/private mode

Practical implications:
- Embedded login may fail because the iframe cannot persist required cookies.
- This is a browser behavior issue, not necessarily an app bug.

Recommendations from the docs:
- In Safari, users may need to trust the iframe parent domain or disable "Prevent cross-site tracking".
- In Chrome incognito, use a normal browsing session instead of incognito.

If product requirements demand support for these environments, validate with Latenode whether any alternative auth/session approach exists before promising compatibility.

## LLM Execution Rules
If you are a coding agent implementing this integration, follow these rules:

1. Implement token signing only on the backend.
2. Never place the Latenode private key in frontend code, public env vars, client bundles, or edge logs.
3. Use a minimal `configure()` payload first: `token`, `container`, `allowCookies`, and a tiny `ui` block.
4. Confirm the iframe renders before attempting advanced theme or SDK automation methods.
5. Keep all white-label admin API calls server-side and pass `AUTH_TOKEN` only from trusted backend code.
6. Check the API response `success` field every time, even when HTTP status is `200`.
7. Log `request_id` for failed API calls.
8. Treat `plan_id` as first-login provisioning logic unless product behavior requires reassignment elsewhere.
9. Use `cleanup()` when the embedded component or route unmounts.
10. Add customization incrementally; do not start by copying the entire SDK configuration schema.
11. Use the sandbox only to validate auth/embed assumptions, not as a direct production template.
12. Account for Safari and incognito cookie restrictions in QA and support documentation.

## Implementation Checklist
- Obtain Latenode private signing key and tenant ID.
- Create at least one plan and record its `plan_id`.
- Create an API token if backend admin automation is needed.
- Add backend JWT issuance endpoint.
- Add frontend iframe container.
- Load SDK `0.1.5`.
- Call `configure()` with the signed JWT.
- Confirm embedded login works for an existing app user.
- Add branding/theme config.
- Add optional admin/reporting wrappers if needed.
- Test teardown with `cleanup()`.
- Test browser limitations and document expected behavior.

## Short Prompt Template For Another Agent
Use this when handing the task to another coding agent:

```text
Integrate Latenode white-label embedded mode into this app.

Requirements:
- Issue Latenode JWTs from the backend only using the Latenode private signing key.
- Use tenant_id, stable user_id, exp, and plan_id for first login if available.
- Embed the iframe via the official SDK script https://embedded.latenode.com/static/sdk/0.1.5.js.
- Render into an existing container and call configure() only after the container exists.
- Start with minimal UI config, then add branding.
- Keep white-label admin API calls on the backend only, authenticated with AUTH_TOKEN.
- Validate API success via the success field, not only HTTP status.
- Handle SPA teardown via cleanup().
- Note Safari/incognito third-party cookie limitations.
```
