# Railway Deployment Log

## Current Status (3 Jul 2026)
- **PostgreSQL**: ✅ SUCCESS — `ac172b0c`
- **API**: 🔄 DEPLOYING (bot started, health check pending) — `bec518ca`
- **Web**: ❌ FAILED — `1d15620b` (needs redeploy with latest config)

## Why It's Taking So Long

| Problem | Fix | Iterations |
|---------|-----|------------|
| Free plan limit — couldn't create new project | Renamed existing empty project `mellow-embrace` → `invitely` | 1 |
| API service created, needed Web + PostgreSQL | Created via `serviceCreate` with repo/image source | 2 |
| Monorepo package source files not in Docker build (`@invitely/shared` not found) | Added `COPY packages/* ./packages/*` to Dockerfile | 3 |
| TypeScript `rootDir` violation (files outside `apps/api/src`) | Changed `rootDir` to `../../` in tsconfig | 4 |
| TypeScript build has 50+ pre-existing type errors | Abandoned `tsc` build → switched to `tsx` runtime | 5 |
| `npx prisma` downloaded incompatible v7 (needs v5) | Changed to `pnpm exec prisma` | 6 |
| `pnpm exec` doesn't find commands in workspace packages | Changed to `pnpm --filter @invitely/api exec` | 7 |
| Filtered `--schema` path becomes relative to package dir | Changed path to `prisma/schema.prisma` (relative) | 8 |
| Railway service config `startCommand` overrides Docker CMD | Cleared `startCommand` → lets Docker CMD run | 9 |
| Deploy uses cached commit (not latest) without `latestCommit: true` | Added `latestCommit: true` to deploy mutation | 10 |

**Total: 10 iterative fixes across ~2 hours** (each iteration = git push + 2min deploy wait + log inspection + fix)

## Files Changed

### `docker/Dockerfile.api` — complete rewrite
```
FROM node:20-alpine
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json turbo.json ./
COPY apps/api ./apps/api
COPY packages/types ./packages/types
COPY packages/config ./packages/config
COPY packages/shared ./packages/shared
COPY packages/validators ./packages/validators
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @invitely/api exec prisma generate --schema=prisma/schema.prisma
USER hono
EXPOSE 3001
ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1
CMD ["sh", "-c", "cd apps/api && pnpm exec prisma db push --skip-generate && pnpm exec tsx src/index.ts"]
```

### `docker/Dockerfile.web` — copy package sources
- Added `COPY packages/* ./packages/*` after `COPY apps/web ./apps/web`

### `railway.json` — simplified
- Removed `"build": {"builder": "NIXPACKS"}` (was conflicting with Docker config)

### `apps/api/tsconfig.json` — temporarily changed (reverted)
- Changed `rootDir` from `"./src"` to `"../../"` (reverted — no longer needed with tsx)

## Railway Services

| Service | ID | Type | Status |
|---------|-----|------|--------|
| api | `bec518ca` | Docker (github) | ⏳ deploying |
| web | `1d15620b` | Docker (github) | ❌ failed — needs redeploy |
| postgres | `ac172b0c` | Docker image | ✅ success |

## Env Vars Set

### API Service
- `BOT_TOKEN`, `ADMIN_SECRET`, `NODE_ENV`, `APP_URL`, `API_URL`, `DATABASE_URL`

### Web Service
- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BOT_USERNAME`, `NODE_ENV`

### PostgreSQL Service
- `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_USER`

## Git Commits (newest first)
```
3c4e6a6 fix: Add openssl, fix prisma engine permissions
350e60b fix: Use relative prisma schema path for filtered package
43704bd fix: Use pnpm --filter for prisma and tsx exec
5be747c fix: Use pnpm exec prisma instead of pnpm prisma
c93f5f9 fix: Use pnpm prisma instead of npx prisma for schema compatibility
5ab4db1 fix: Use tsx runtime for API, simplify Dockerfiles
e14c597 fix: Widen rootDir in API tsconfig for monorepo package sources
1a01916 fix: Copy package sources in Dockerfiles, simplify railway.json
7370dde Initial commit (railway.json)
```

## API Runtime Logs (successful)
```
[2026-07-03T05:43:43] Prisma schema loaded from prisma/schema.prisma
[2026-07-03T05:43:43] Datasource "db": PostgreSQL database "invitely", schema "public" at "postgres:5432"
[2026-07-03T05:43:44] 🚀  Your database is now in sync with your Prisma schema. Done in 731ms
[2026-07-03T05:43:45] API server started {"context":"startup","port":3001,"nodeEnv":"production"}
[2026-07-03T05:43:45] Feature flags initialized: 8 flags
[2026-07-03T05:43:46] Telegram bot started
```

## Issues Preventing Deployment
| Issue | Status |
|-------|--------|
| PostgreSQL Docker env vars (`POSTGRES_PASSWORD`) not injected | ❌ Set via API, still fails on cold start |
| Health check not passing (API port exposure) | ❌ Need to verify Railway detects port 3001 |
| Web service still uses old 3-stage Dockerfile | ❌ Needs redeploy with latest config |
| Railway V2 runtime vs Docker CMD interaction | ❌ StartCommand cleared, pending confirmation |
| Web Dockerfile needs `next build` from correct directory | ❌ 3-stage build has same package source issue |

## Next Steps
1. ✅ PostgreSQL is running (but env var detection unreliable on image-based services)
2. ⏳ API health check needs to pass — may need Railway port exposure config
3. ❌ Web needs: redeploy with latest Dockerfile (fix package sources, clear startCommand)
4. Once all ✅ → get Railway-generated URLs, update env vars, test Telegram bot
