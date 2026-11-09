module.exports = async (request, response) => {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    response.setHeader("Cache-Control", "no-store");
    response.status(503).json({ error: "Hosted database is not configured." });
    return;
  }

  const query = new URLSearchParams({
    select: "id,slug,title,track,level,duration_days,summary,content,published,updated_at",
    published: "eq.true",
    order: "updated_at.desc",
    limit: "100"
  });

  try {
    const upstream = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/prep_roadmaps?${query}`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Accept: "application/json"
      }
    });

    if (!upstream.ok) {
      console.error("Published roadmap query failed with status", upstream.status);
      response.setHeader("Cache-Control", "no-store");
      response.status(502).json({ error: "Published roadmaps are temporarily unavailable." });
      return;
    }

    response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.status(200).json(await upstream.json());
  } catch (error) {
    console.error("Published roadmap query failed:", error.message);
    response.setHeader("Cache-Control", "no-store");
    response.status(502).json({ error: "Published roadmaps are temporarily unavailable." });
  }
};