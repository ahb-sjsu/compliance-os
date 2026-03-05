# Development Guide

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
git clone https://github.com/ahb-sjsu/compliance-os.git
cd compliance-os
npm install
npm run dev
```

The app will be available at `http://localhost:5173/compliance-os/`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm test` | Run test suite (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Type-check without emitting |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
├── assets/styles/     # CSS (index.css + print.css)
├── auth/              # Google OAuth context + login page
├── components/
│   ├── layout/        # AppShell, Sidebar, Topbar
│   ├── ui/            # Badge, Modal, Toggle, Alert, etc.
│   └── vendor/        # Vendor tab components
├── constants/         # Roles, statuses, frameworks, seed data
├── helpers/           # Date, vendor, CSV utilities
├── hooks/             # useVendors state management
├── modals/            # VendorModal, ExportModal, FWReportModal
├── pages/             # Dashboard, VendorsList, Reports, etc.
├── plan/              # Freemium plan system
├── security/          # AES-256-GCM encryption (crypto.ts)
├── settings/          # App settings context
├── storage/           # Storage abstraction (localStorage, Google Drive)
└── types/             # TypeScript type definitions
```

## Architecture

- **No router** — tab-based navigation via React state
- **No state library** — custom `useVendors` hook manages all vendor state
- **No backend** — localStorage + Google Drive REST API
- **Storage abstraction** — `StorageProvider` interface with swappable implementations
- **Plan system** — `PlanContext` provides feature gates throughout the app
- **Encryption at rest** — AES-256-GCM via Web Crypto API (see [SECURITY.md](SECURITY.md))

## Security

All data is encrypted at rest using AES-256-GCM. See [SECURITY.md](SECURITY.md) for:
- Encryption architecture and compliance mapping (CJIS, FedRAMP, StateRAMP, CISA)
- Content Security Policy configuration
- Token management and OAuth security
- Known limitations and production recommendations

## Testing

Tests use [Vitest](https://vitest.dev/) with happy-dom environment.

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

### Test coverage

| Area | File | Tests |
|---|---|---|
| Encryption | `src/security/crypto.test.ts` | AES-256-GCM round-trip, tamper detection, key isolation |
| Date helpers | `src/helpers/dates.test.ts` | Timestamp formatting, day calculations |
| Vendor logic | `src/helpers/vendors.test.ts` | Checklist generation, framework suggestions, gate checks |
| Roles/RBAC | `src/constants/roles.test.ts` | Permission checks for all 3 roles |
| Frameworks | `src/constants/frameworks.test.ts` | Framework definitions, control catalogs |
| Plan system | `src/plan/plans.test.ts` | Free/Pro limits and feature flags |

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Drive API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized origins: `http://localhost:5173` and your production URL
6. Copy the Client ID to `.env`:

```bash
cp .env.example .env
# Edit .env and add your client ID
VITE_GOOGLE_CLIENT_ID=your-client-id-here
```

## CI/CD

GitHub Actions pipeline (`.github/workflows/ci.yaml`):
1. **Lint** — ESLint with zero warnings
2. **Type check** — TypeScript strict mode
3. **Test** — Vitest (72 tests)
4. **Build** — Vite production build
5. **Deploy** — GitHub Pages (on push to main)

## License

Business Source License 1.1 — see [LICENSE](../LICENSE) for details.
