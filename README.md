# Peblo AI Notes Workspace

A polished full-stack take-home submission for the Peblo Full Stack Developer Challenge.

This project delivers a collaborative AI-powered notes workspace with:

- Secure signup and login
- Persistent cookie-based authentication
- Note creation, editing, auto-save, categories, tags, and archiving
- AI-generated summaries, action items, and suggested titles
- Keyword search and tag filtering
- Public note sharing without login
- Productivity insights dashboard

## Stack

- `Next.js 15` with App Router and TypeScript
- `better-sqlite3` for a fast self-contained local database
- `jose` for signed session cookies
- `bcryptjs` for password hashing
- `OpenAI` SDK with graceful local fallback when no API key is configured

## Why This Architecture

I chose a single Next.js application with server-rendered pages and route handlers so the submission stays easy to run from a clean clone while still demonstrating clear backend boundaries:

- `app/api/*` contains backend endpoints
- `components/*` contains the product UI
- `lib/auth.ts` handles sessions and password utilities
- `lib/store.ts` owns database access and query logic
- `lib/ai.ts` encapsulates AI generation and fallback behavior

This keeps the codebase compact, production-like, and reviewer-friendly.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment variables:

```bash
cp .env.example .env
```

3. Seed the demo workspace:

```bash
npm run db:seed
```

4. Start the app:

```bash
npm run dev
```

5. Open:

```text
http://localhost:3000
```

## Demo Credentials

- Email: `demo@peblo.app`
- Password: `Demo@12345`

You can also create your own account from the signup page.

## Environment Variables

```env
DATABASE_PATH="./data/peblo-notes.db"
JWT_SECRET="replace-with-a-long-random-string"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4.1-mini"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## AI Behavior

If `OPENAI_API_KEY` is present, the app uses the OpenAI API to generate:

- Summary
- Action items
- Suggested title

If no API key is configured, the app falls back to a deterministic local summarizer so the product remains fully usable during evaluation.

## Challenge Coverage

### 1. Authentication

- Signup and login
- Hashed passwords
- Protected routes
- Persistent signed cookie session

### 2. Notes Workspace

- Create notes
- Edit notes
- Auto-save with debounce
- Categories and tags
- Archive and restore

### 3. AI Integration

- Generate summary
- Extract action items
- Suggest note title
- Track AI usage for dashboard insights

### 4. Search and Filtering

- Keyword search across title, content, category, and tags
- Tag-based filtering
- Recent-first sorting

### 5. Public Sharing

- Generate public share links
- View shared notes without login
- Proper public/private handling

### 6. Productivity Insights

- Total notes
- Archived notes
- Weekly edited count
- Most-used tags
- AI usage count
- Weekly activity breakdown

## Useful Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:seed
```

## Verification

The project was verified with:

- `npm run lint`
- `npm run build`
- `npm run db:seed`

## Notes For Submission

- Do not commit real API keys
- Include `.env.example` in the repository
- Record a short demo covering auth, note editing, AI generation, sharing, search/filtering, and the dashboard
- Zip the project as `fullstack_challenge_<your name>` if needed for upload

## Sample Outputs

See [docs/sample-outputs.md](/Users/shaurya/Desktop/shorlisted/peblo-notes-workspace/docs/sample-outputs.md).
