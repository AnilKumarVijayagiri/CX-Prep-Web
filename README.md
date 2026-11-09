# St. School Prep Room

A static, lightweight interview-preparation site with public career roadmaps and a Supabase-backed admin content desk. The repository root is the GitHub Pages entry point. The previous MVP remains in `Interview Preparation Website/`.

## Run locally

Open `index.html` in a browser or serve the repository root with any static file server. Without Supabase configuration, the public sample Python full-stack roadmap is available in read-only preview mode.

## Deploy to Vercel

1. Import the Git repository into Vercel, or run `vercel --prod` from the repository root.
2. The static site and the `/api` serverless functions deploy together. Vercel caches published roadmap reads for 60 seconds at the edge and may serve a stale response while refreshing it.
3. Configure `SUPABASE_URL` and `SUPABASE_ANON_KEY` as Vercel project environment variables for Production (and Preview if needed). The config endpoint exposes only these public client settings. Redeploy after adding or changing them.

The cache reduces repeated database reads during traffic bursts. Supabase's hosted Postgres and REST API handle persistent data; the roadmap endpoint limits public reads to 100 published paths. Load testing with the real Supabase project and its chosen plan is still required before promising a specific concurrency or uptime target.

## Enable shared publishing

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor.
2. In Supabase Authentication, create an admin user with email and password. Disable public sign-up unless your organization intentionally needs it.
3. Copy the new user's UUID from Authentication and allowlist it in the SQL editor:

   ```sql
   insert into public.prep_admins (user_id)
   values ('YOUR-AUTH-USER-UUID');
   ```

4. For local use, put the project's URL and public anon key in `config.js`. For Vercel, set them as `SUPABASE_URL` and `SUPABASE_ANON_KEY` project environment variables instead. The anon key is expected to be public; never put a service-role key in this app or in Vercel client-visible variables.
5. Visitors can read published roadmaps without accounts. Admins sign in from the Admin button; row-level security restricts draft access and all writes to allowlisted users.

The admin editor supports career branch, experience level, roadmap length, skill tags, publish/draft state, lesson notes, concepts, rapid-fire question/answer pairs, and hands-on tasks. Use one topic per line and `question | answer` / `task title | task details` for structured entries.

## Interview Room and PrepPo AI

The public Interview Room lets learners choose a career path and topic, review its notes and question answers, request a multiple-choice test, or start a PrepPo AI daily challenge. A floating PrepPo AI chat window answers questions using the currently selected topic material and provides a shortcut to that topic's daily challenge.

The daily challenge generates five topic-specific questions; correct answers award 10 points and advance, while one wrong answer or timeout ends that day's attempt. Gemini chooses a 5-second limit for direct-recall questions and 7 seconds for short reasoning questions. The score and one-attempt-per-day state are stored in that browser's local storage.

Gemini powers the chat and serves as the fallback for tests when Ollama has no credits, is rate-limited, or is unavailable. Set `GEMINI_API_KEY` as a **Sensitive** Vercel environment variable for Production and Preview. Optionally set `GEMINI_MODEL`; the default is the stable `gemini-3.5-flash-lite`. Google currently lists free input/output tokens for this model, subject to API quotas, account eligibility, and current Google terms. Never add provider keys to `config.js`, browser code, or GitHub.

Ollama is optional. If used, set `OLLAMA_API_KEY` as a Sensitive Vercel variable; its OpenAI-compatible cloud endpoint is tried first for tests. The Gemini key is also used directly if Ollama is not configured. Google AI Studio free-tier availability and quotas depend on the selected model, region, and current Google terms; a key does not guarantee unlimited free generation. The generation endpoint accepts 3-10 questions per request and applies best-effort per-instance request limits. For local AI features, use `vercel dev` with the provider keys set in the local environment; a basic static file server does not execute Vercel API routes.

## Content model

Each roadmap is one row in `prep_roadmaps`. Its `content` JSONB value contains a `days` array; each day has a title, focus, notes, concepts, questions, and tasks. This keeps the app lightweight while Supabase provides shared, persistent content and authentication and Vercel caches public reads at the edge.