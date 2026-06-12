# Moodmatch

Moodmatch is a personalized recommendation app for movies, TV shows, books,
board games, video games, and other taste-driven categories.

The product goal is simple: the more a user rates, saves, rejects, and explores,
the better the app understands their taste. Moodmatch builds a living Taste DNA
profile and uses it to recommend one strong Perfect Match plus supporting picks.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Neon PostgreSQL
- Drizzle ORM
- NextAuth.js
- Azure AI
- TMDB, Google Books, and BoardGameGeek metadata
- Render

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Project Structure

- `app` - App Router pages, layouts, and route handlers
- `components` - Reusable UI components
- `lib` - Shared utilities, integrations, and server helpers
- `types` - Shared TypeScript types

## Environment

Copy `.env.example` to `.env.local` and fill in the required values as features
are added.

## Database

Moodmatch uses Neon PostgreSQL with Drizzle ORM.

Generate SQL migrations from the schema:

```bash
npm run db:generate
```

Run migrations against the configured Neon database:

```bash
npm run db:migrate
```

## Deploy to Render

The repository includes a `render.yaml` Blueprint for a Node web service in
Render's Frankfurt region.

1. In Render, create a new Blueprint and connect this GitHub repository.
2. Provide the secret values requested from `render.yaml`.
3. Set both `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to the public Render URL,
   for example `https://moodmatch.onrender.com`.
4. Deploy the Blueprint.

Required production secrets:

- `DATABASE_URL`
- `AZURE_AI_ENDPOINT`
- `AZURE_AI_API_KEY`
- `AZURE_AI_DEPLOYMENT`
- `TMDB_API_KEY`
- `GOOGLE_BOOKS_API_KEY`

Optional production secret:

- `BOARDGAMEGEEK_API_TOKEN` can be added later from the Render dashboard.

Render generates `NEXTAUTH_SECRET` automatically. The service health check is
available at `/api/health`.

Before deploying a release that includes a new database migration, run:

```bash
npm run db:migrate
```
