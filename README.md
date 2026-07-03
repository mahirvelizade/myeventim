# Invitely

**Telegram Mini App for generating beautiful digital invitation cards in under 30 seconds.**

Built with Next.js 15, Hono, tRPC, Prisma, and PostgreSQL. Fully Docker-ready.

---

## Features

- Create digital invitation cards in 7 simple steps
- 8 invitation categories (Birthday, Wedding, Party, Corporate, etc.)
- 6 template designs with customizable colors and fonts
- Real-time preview before generation
- PNG and PDF export (architecture ready)
- Telegram Mini App — native mobile feel
- Telegram Login authentication (no passwords)
- Azerbaijani and English language support
- Light/Dark/System theme
- Auto-save drafts
- Anonymous analytics

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui |
| Backend | Hono, tRPC, Prisma ORM |
| Database | PostgreSQL |
| Bot | grammY |
| Image Engine | Satori + Resvg (architecture ready) |
| Storage | Local (pluggable: S3, R2, Supabase) |
| Validation | Zod |
| Package Manager | pnpm (workspaces) |
| Monorepo | Turbo |

## Project Structure

```
invitely/
├── apps/
│   ├── web/          # Next.js 15 Telegram Mini App
│   └── api/          # Hono API + Telegram bot
├── packages/
│   ├── ui/           # Design system (shadcn/ui components)
│   ├── types/        # TypeScript types and interfaces
│   ├── config/       # Environment & app configuration
│   ├── shared/       # Shared utilities & services
│   ├── validators/   # Zod validation schemas
│   ├── templates/    # Template system (coming soon)
│   ├── assets/       # Static assets
│   └── fonts/        # Font files
├── docker/           # Docker configuration
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- PostgreSQL (or Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/invitely.git
cd invitely

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Start database (Docker)
docker compose up -d postgres

# Run database migrations
pnpm db:migrate

# Start development servers
pnpm dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `BOT_TOKEN` | Telegram Bot Token |
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_ID` | Telegram admin user ID |
| `APP_URL` | Web app URL (default: http://localhost:3000) |
| `API_URL` | API URL (default: http://localhost:3001) |
| `STORAGE_DRIVER` | Storage driver (local, s3, r2, supabase) |

### Docker

```bash
# Start all services
docker compose up -d

# Services:
# - web: http://localhost:3000
# - api: http://localhost:3001
# - postgres: localhost:5432
```

## Development

```bash
# Start all apps in dev mode
pnpm dev

# Run linting
pnpm lint

# Type check
pnpm typecheck

# Format code
pnpm format

# Database studio
pnpm db:studio
```

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/users/me` | Get current user |
| POST | `/api/users` | Create user |
| PATCH | `/api/users/:id` | Update user |
| GET | `/api/invitations` | List invitations |
| POST | `/api/invitations` | Create invitation |
| GET | `/api/categories` | List categories |
| GET | `/api/templates` | List templates |
| GET/POST/PATCH/DELETE | `/api/drafts` | Draft CRUD |
| POST | `/api/analytics/events` | Track analytics |
| GET/PATCH | `/api/settings` | User settings |

## Telegram Bot Commands

- `/start` — Open Mini App
- `/my_invitations` — View your invitations
- `/language` — Change language
- `/help` — Help
- `/settings` — Settings
- `/about` — About

## Architecture

The application follows Clean Architecture principles with clear separation between:

- **Presentation** — React components, Telegram Mini App UI
- **Application** — Wizard flow, state management (Zustand)
- **Domain** — Business logic, entities, value objects
- **Infrastructure** — Database, storage, external services

The Storage Service uses an abstract interface pattern, allowing seamless switching between Local, S3, R2, or Supabase storage without changing business logic.

## License

MIT

---

Built with ❤️ by Mahir Vliyev
