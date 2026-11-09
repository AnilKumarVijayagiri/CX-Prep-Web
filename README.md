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

## Interview Room and Ollama Cloud

The public Interview Room lets learners choose a career path and topic, review its notes and question answers, and request a multiple-choice test. Generation uses Ollama's OpenAI-compatible cloud endpoint from the Vercel serverless function at `api/generate-test.js`; the key is never sent to the browser.

1. Create an Ollama Cloud API key at https://ollama.com/settings/keys.
2. In Vercel Project Settings > Environment Variables, add `OLLAMA_API_KEY` for Production and Preview as a **Sensitive** variable, then redeploy. Never add this key to `config.js`, browser code, or GitHub.
3. Optionally set `OLLAMA_MODEL` to a cloud model available to your Ollama account. The default is `gemma4:31b`.

The generation endpoint accepts 3-10 questions per request and applies a best-effort per-instance request limit. For local generation, use `vercel dev` with `OLLAMA_API_KEY` configured in your local environment; a basic static file server can show the learning material but does not execute Vercel API routes. Add a stronger shared rate limit or abuse challenge before broad public promotion of AI generation.

## Content model

Each roadmap is one row in `prep_roadmaps`. Its `content` JSONB value contains a `days` array; each day has a title, focus, notes, concepts, questions, and tasks. This keeps the app lightweight while Supabase provides shared, persistent content and authentication and Vercel caches public reads at the edge.