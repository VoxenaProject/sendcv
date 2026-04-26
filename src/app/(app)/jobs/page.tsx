"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  posted: string;
  type: string;
  salary: string;
  source: string;
  thumbnail: string | null;
}

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "Bruxelles, Belgique");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const router = useRouter();

  // Auto-search si params dans l'URL
  useEffect(() => {
    if (searchParams.get("q")) {
      doSearch(searchParams.get("q")!, searchParams.get("location") || "Bruxelles, Belgique");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function doSearch(q: string, loc: string) {
    setLoading(true);
    setSearched(true);
    setSelectedJob(null);

    const res = await fetch(`/api/jobs/search?q=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`);
    const data = await res.json();

    if (res.ok) setJobs(data.jobs || []);
    else setJobs([]);
    setLoading(false);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    // Persist dans l'URL pour le back button
    window.history.replaceState(null, "", `/jobs?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
    doSearch(query, location);
  }

  function handleAnalyze(job: Job) {
    // Stocker la description dans sessionStorage et rediriger vers /apply
    sessionStorage.setItem("sendcv_job_description", `${job.title}\n${job.company} — ${job.location}\n\n${job.description}`);
    router.push("/apply?from=jobs");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold">Offres d&apos;emploi</h1>
        <p className="text-sm text-gray-400">LinkedIn, Indeed, Glassdoor et plus. Clique sur une offre pour l&apos;analyser.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} required
            placeholder="Développeur React, Marketing Manager, Data Analyst..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        </div>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
          placeholder="Ville, pays"
          className="sm:w-48 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
        <button type="submit" disabled={loading || !query.trim()}
          className="px-6 py-3 rounded-xl bg-black text-white font-medium text-sm hover:bg-gray-800 transition-all disabled:opacity-50 cursor-pointer shrink-0">
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </form>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2">
        {["Développeur", "Marketing", "Finance", "Data", "Design", "Commercial", "RH"].map((f) => (
          <button key={f} onClick={() => { setQuery(f); }}
            className="px-3 py-1.5 rounded-full bg-[#f5f5f7] text-sm text-gray-600 hover:bg-[#ececee] transition-colors cursor-pointer">
            {f}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex gap-4">
        {/* Job list */}
        <div className="flex-1 space-y-2">
          {loading && (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 bg-[#f5f5f7] rounded-2xl animate-pulse" />
              ))}
            </div>
          )}

          {!loading && searched && jobs.length === 0 && (
            <div className="text-center py-16 bg-[#f5f5f7] rounded-2xl">
              <p className="text-lg font-semibold">Aucune offre trouvée</p>
              <p className="text-sm text-gray-400 mt-1">Essaie avec d&apos;autres mots-clés ou une autre ville.</p>
            </div>
          )}

          {!loading && jobs.map((job, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedJob(job)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedJob === job ? "border-black bg-white shadow-lg" : "border-gray-100 bg-white hover:border-gray-300"
              }`}>
              <div className="flex items-start gap-3">
                {job.thumbnail ? (
                  <img src={job.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#f5f5f7] flex items-center justify-center shrink-0 text-sm font-bold text-gray-400">
                    {job.company.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {job.salary && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">{job.salary}</span>}
                    {job.type && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f5f5f7] text-gray-500">{job.type}</span>}
                    {job.posted && <span className="text-[10px] text-gray-400">{job.posted}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Job detail panel (desktop) */}
        <AnimatePresence>
          {selectedJob && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="hidden md:block w-[380px] shrink-0 sticky top-20 self-start">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xl max-h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex items-start gap-3 mb-4">
                  {selectedJob.thumbnail ? (
                    <img src={selectedJob.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#f5f5f7] flex items-center justify-center text-lg font-bold text-gray-400">
                      {selectedJob.company.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h2 className="font-bold text-[15px]">{selectedJob.title}</h2>
                    <p className="text-sm text-gray-500">{selectedJob.company}</p>
                    <p className="text-xs text-gray-400">{selectedJob.location}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedJob.salary && <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">{selectedJob.salary}</span>}
                  {selectedJob.type && <span className="text-xs px-2.5 py-1 rounded-full bg-[#f5f5f7] text-gray-600">{selectedJob.type}</span>}
                  {selectedJob.source && <span className="text-xs text-gray-400">{selectedJob.source}</span>}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-[12]">{selectedJob.description}</p>

                <button onClick={() => handleAnalyze(selectedJob)}
                  className="w-full py-3 rounded-xl bg-black text-white font-medium text-sm hover:bg-gray-800 transition-all cursor-pointer">
                  Analyser cette offre
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-2">L&apos;analyse est gratuite</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: selected job action */}
      {selectedJob && (
        <div className="md:hidden fixed bottom-20 left-4 right-4 z-40">
          <button onClick={() => handleAnalyze(selectedJob)}
            className="w-full py-3.5 rounded-2xl bg-black text-white font-medium text-sm shadow-2xl shadow-black/20">
            Analyser « {selectedJob.title.slice(0, 30)}{selectedJob.title.length > 30 ? "..." : ""} »
          </button>
        </div>
      )}
    </div>
  );
}
