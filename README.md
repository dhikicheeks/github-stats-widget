# GitHub Stats Widget

[![CI](https://github.com/dhikicheeks/github-stats-widget/actions/workflows/ci.yml/badge.svg)](https://github.com/dhikicheeks/github-stats-widget/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-MIT-blue)

Self-hosted GitHub stats widgets served as SVG — deploy once to Vercel, embed anywhere.

> Built because shared services like github-readme-stats hit rate limits at peak hours. This is your own instance.

---

## Widgets

### Top Languages
```html
<img src="https://your-domain.vercel.app/api/github-stats/top-langs?username=dhikicheeks" />
```

### Contribution Streak
```html
<img src="https://your-domain.vercel.app/api/github-stats/streak?username=dhikicheeks" />
```

### GitHub Trophies
```html
<img src="https://your-domain.vercel.app/api/github-stats/trophy?username=dhikicheeks" />
```

### Visitor Counter
```html
<img src="https://your-domain.vercel.app/api/github-stats/visitor?label=Profile+views" />
```

---

## Setup Guide

### 1. Fork / Clone
```bash
git clone https://github.com/dhikicheeks/github-stats-widget.git
cd github-stats-widget
npm install
```

### 2. Set Up Upstash Redis
1. Go to [console.upstash.com](https://console.upstash.com) → Create Database
2. Select region: **ap-southeast-1 (Singapore)**
3. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the REST API tab

### 3. Set Up Supabase
1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to **SQL Editor** → paste and run `supabase/migrations/001_create_visitors.sql`
3. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Create GitHub Token
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens) → New token
2. Scopes: `read:user`, `read:org`
3. Copy token → `GITHUB_TOKEN`

### 5. Set Environment Variables
```bash
cp .env.example .env
# Edit .env and fill in all values
```

### 6. Deploy to Vercel
1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add all env variables in **Settings → Environment Variables**
4. Deploy

### 7. Verify
```bash
curl -s https://your-domain.vercel.app/api/health | jq
```

---

## Query Parameters

| Endpoint | Parameter | Default | Description |
|---|---|---|---|
| `top-langs` | `username` | `GITHUB_OWNER_USERNAME` | GitHub username |
| `streak` | `username` | `GITHUB_OWNER_USERNAME` | GitHub username |
| `trophy` | `username` | `GITHUB_OWNER_USERNAME` | GitHub username |
| `visitor` | `label` | `Profile views` | Badge label text |

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Upstash](https://img.shields.io/badge/Upstash-Redis-00E9A3?logo=upstash)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)
