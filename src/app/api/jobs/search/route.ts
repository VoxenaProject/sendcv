import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "France";
  const page = searchParams.get("page") || "0";

  if (!query.trim()) return Response.json({ error: "Recherche vide" }, { status: 400 });

  const params = new URLSearchParams({
    engine: "google_jobs",
    q: `${query} ${location}`,
    hl: "fr",
    gl: location.toLowerCase().includes("belg") ? "be" : "fr",
    start: String(Number(page) * 10),
    api_key: process.env.SERPAPI_KEY!,
  });

  const res = await fetch(`https://serpapi.com/search.json?${params}`);
  const data = await res.json();

  if (!res.ok || data.error) {
    return Response.json({ error: data.error || "Erreur de recherche" }, { status: 500 });
  }

  // Formater les résultats
  const jobs = (data.jobs_results || []).map((job: {
    title: string;
    company_name: string;
    location: string;
    description: string;
    detected_extensions?: { posted_at?: string; schedule_type?: string; salary?: string };
    via?: string;
    job_highlights?: { title: string; items: string[] }[];
    thumbnail?: string;
  }) => ({
    title: job.title,
    company: job.company_name,
    location: job.location,
    description: job.description,
    posted: job.detected_extensions?.posted_at || "",
    type: job.detected_extensions?.schedule_type || "",
    salary: job.detected_extensions?.salary || "",
    source: job.via || "",
    highlights: job.job_highlights || [],
    thumbnail: job.thumbnail || null,
  }));

  return Response.json({
    jobs,
    total: jobs.length,
    query,
    location,
  });
}
