# Acme App — Latenode White-Label Embedded Demo

> **Live demo** — try the embedded workflow builder at [embedded-demo.latenode.com](https://embedded-demo.latenode.com/).

A ready-to-clone demo app that shows how to embed the [Latenode](https://latenode.com/embedded-ipaas) workflow automation editor into your own SaaS product using the white-label SDK. Built with Next.js, Tailwind CSS, and SQLite.

> **One-click setup with AI** — paste this prompt into [Cursor](https://cursor.com), [Claude Code](https://docs.anthropic.com/en/docs/claude-code), or any AI coding agent to clone and run this demo locally.
>
> You will need a **Latenode white-label account** with an RSA signing key, tenant ID, and at least one plan created before starting.
>
> ```text
> Clone the Latenode embedded demo and set it up so I can run it locally.
>
> 1. git clone https://github.com/latenode-com/embedded-demo.git && cd embedded-demo
> 2. npm install
> 3. Copy .env.example to .env.local:
>      cp .env.example .env.local
> 4. Generate a random SESSION_SECRET with `openssl rand -base64 32` and write it into .env.local.
> 5. Leave the Latenode credentials as placeholders for now — do NOT ask the user for them in chat.
>    Instead, after finishing the automated steps, show the user this message:
>
>    ---
>    Setup is almost done! Open .env.local and fill in the following values:
>
>    • LATENODE_PRIVATE_KEY — your RSA private key (PEM format), issued by Latenode support.
>      Paste the full key block including the BEGIN/END lines.
>    • LATENODE_TENANT_ID — your numeric tenant ID (find it in the Latenode admin panel).
>    • LATENODE_DEFAULT_PLAN_ID — the numeric ID of the plan to assign new users
>      (White Label → Plans in the admin dashboard).
>
>    Optional:
>    • EMAIL_CONFIRMATION_ENABLED / MAILGUN_* — set if you want email verification on signup.
>
>    Once you've saved .env.local, run:
>      npm run setup
>      npm run dev
>    Then open http://localhost:3000 in your browser.
>    ---
> ```

## Prerequisites

- **Node.js 18+** (20+ recommended)
- A **Latenode white-label account** with:
  - RSA private signing key (from Latenode support)
  - Tenant ID
  - At least one plan created in the admin dashboard

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/latenode-com/embedded-demo.git
cd embedded-demo

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Latenode credentials (see below)

# 4. Set up the database
npm run setup

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable                  | Required | Description                                              |
| ------------------------- | -------- | -------------------------------------------------------- |
| `SESSION_SECRET`          | Yes      | Random string (32+ chars) for encrypting session cookies |
| `LATENODE_PRIVATE_KEY`    | Yes      | RSA private key (PEM format) for signing Latenode JWTs   |
| `LATENODE_TENANT_ID`      | Yes      | Your numeric tenant ID from Latenode                     |
| `LATENODE_DEFAULT_PLAN_ID`| Yes      | Plan ID to assign new users on first login               |
| `LATENODE_API_TOKEN`      | No       | API token for the Admin Panel (White Label → Access Tokens) |
| `EMAIL_CONFIRMATION_ENABLED` | No    | Set to `"true"` to require email verification on registration |
| `MAILGUN_API_KEY`         | No       | Mailgun API key (required when email confirmation is enabled) |
| `MAILGUN_DOMAIN`          | No       | Mailgun sending domain                                   |
| `MAILGUN_FROM`            | No       | From address for verification emails                     |
| `MAILGUN_API_URL`         | No       | Mailgun API base URL (`https://api.eu.mailgun.net` for EU) |

## Showcase Sections

The dashboard sidebar contains 6 embed demos, each showing a different SDK configuration:

| Page             | Route                        | What it demonstrates                                   |
| ---------------- | ---------------------------- | ------------------------------------------------------ |
| Full Embed       | `/dashboard/full-embed`      | Default embed — all features visible, zero config      |
| Minimal Embed    | `/dashboard/minimal-embed`   | Side menu hidden, greetings removed — clean integration |
| Custom Theme     | `/dashboard/custom-theme`    | Custom colors, fonts, and border radius                |
| Translations     | `/dashboard/translations`    | Language and string overrides                          |
| Custom Menu      | `/dashboard/custom-menu`     | Replace the built-in side menu with a fully custom navigation component |
| SDK Automation   | `/dashboard/sdk-automation`  | Programmatic control — create, save, deploy from your app |

## How the Integration Works

```
Your App (Next.js)                         Latenode
┌──────────────┐                          ┌──────────────┐
│ 1. User logs │                          │              │
│    into your ├──► 2. Backend signs ──►  │ 3. Embedded  │
│    app       │     Latenode JWT         │    SDK loads  │
│              │                          │    iframe     │
│ 4. SDK calls │◄── configure() with ◄── │    with JWT   │
│    configure │     token + config       │              │
└──────────────┘                          └──────────────┘
```

1. User authenticates via email/password (your app's own auth).
2. Backend signs a short-lived JWT with `tenant_id`, `user_id`, and `plan_id`.
3. Frontend loads the Latenode Embedded SDK script.
4. `sdk.configure()` renders the editor in an iframe using the JWT.

Key files:
- `src/lib/latenode.ts` — JWT signing logic
- `src/app/api/latenode/token/route.ts` — Token endpoint
- `src/components/LatenodeEditor.tsx` — Reusable editor component
- `src/lib/latenode-configs.ts` — All 5 SDK configuration presets

## Project Structure

```
├── prisma/
│   └── schema.prisma        # User, Session + VerificationCode models (SQLite)
├── src/
│   ├── app/
│   │   ├── page.tsx         # Marketing landing page
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── dashboard/       # Authenticated area
│   │   │   ├── layout.tsx   # Header + sidebar shell
│   │   │   ├── page.tsx     # Overview with cards
│   │   │   ├── full-embed/  # Demo: full embed
│   │   │   ├── minimal-embed/
│   │   │   ├── custom-theme/
│   │   │   ├── translations/
│   │   │   ├── custom-menu/
│   │   │   └── sdk-automation/
│   │   └── api/latenode/    # JWT token endpoint
│   ├── lib/                 # Auth, DB, Latenode helpers
│   └── components/          # Reusable UI components
├── .env.example             # Environment variable template
└── LATENODE_WHITE_LABEL_LLM_INSTRUCTIONS.md
```

## Customization

- **Branding**: Edit the presets in `src/lib/latenode-configs.ts` to change theme colors, fonts, and UI options.
- **Auth**: The auth system uses simple email/password with bcrypt. Replace with your own auth provider as needed.
- **Database**: SQLite is used for simplicity. For production, switch the Prisma datasource to PostgreSQL or MySQL.

## Browser Limitations

The Latenode embedded SDK uses iframe cookies. Third-party cookie restrictions may cause issues in:
- **Safari** — users may need to disable "Prevent cross-site tracking"
- **Chrome Incognito** — use a normal browsing session instead

See the [Latenode White-Label Docs](https://documentation.latenode.com/white-label) for details.

## Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Start development server                 |
| `npm run build`  | Build for production                     |
| `npm run setup`  | Run migrations (first-time setup)        |
| `npm run db:reset`| Reset database completely               |

## License

MIT
