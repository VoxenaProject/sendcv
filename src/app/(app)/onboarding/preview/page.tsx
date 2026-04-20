"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { CVTemplateEngine, PRESETS, PALETTES } from "@/components/cv-templates/engine";
import type { StructuredCV } from "@/types";

const BUILD_STEPS = [
  { text: "Analyse de ton profil...", icon: "🔍", duration: 1200 },
  { text: "Structuration de l'expérience...", icon: "📋", duration: 1000 },
  { text: "Optimisation des bullet points...", icon: "⚡", duration: 1200 },
  { text: "Application du template...", icon: "🎨", duration: 800 },
  { text: "Finalisation...", icon: "✨", duration: 600 },
];

export default function OnboardingPreviewPage() {
  const [phase, setPhase] = useState<"building" | "reveal" | "done">("building");
  const [buildStep, setBuildStep] = useState(0);
  const [cv, setCv] = useState<StructuredCV | null>(null);
  const router = useRouter();

  // Charger le profil et construire le CV
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!data) return;

      const p = data as Record<string, string | null>;

      // Parse experience text back into structured format
      const expLines = (p.experience || "").split("\n\n").filter(Boolean);
      const experiences = expLines.map((block) => {
        const lines = block.split("\n");
        const firstLine = lines[0] || "";
        const match = firstLine.match(/^(.+?) chez (.+?) \((.+?)\)$/);
        return {
          title: match?.[1] || firstLine,
          company: match?.[2] || "",
          location: "",
          dates: match?.[3] || "",
          bullets: lines.slice(1).filter(Boolean).map((l) => l.trim()).filter(Boolean),
        };
      }).filter((e) => e.title);

      // If no bullets, create from description
      const expsWithBullets = experiences.map((e) => ({
        ...e,
        bullets: e.bullets.length > 0 ? e.bullets : ["Contribution significative aux objectifs de l'équipe"],
      }));

      const eduLines = (p.education || "").split("\n").filter(Boolean);
      const education = eduLines.map((line) => {
        const match = line.match(/^(.+?),\s*(.+?)\s*\((.+?)\)$/);
        return {
          degree: match?.[1] || line,
          school: match?.[2] || "",
          dates: match?.[3] || "",
        };
      });

      const skills = (p.skills || "").split(",").map((s) => s.trim()).filter(Boolean);
      const langParts = (p.languages || "").split(",").map((s) => s.trim()).filter(Boolean);
      const languages = langParts.map((l) => {
        const match = l.match(/^(.+?)\s*\((.+?)\)$/);
        return { language: match?.[1] || l, level: match?.[2] || "" };
      });

      const structured: StructuredCV = {
        full_name: p.full_name || "Mon CV",
        headline: p.headline || "",
        location: p.location || "",
        email: p.email || "",
        linkedin: p.linkedin_url || "",
        summary: `${p.headline || "Professionnel"} avec une expertise en ${skills.slice(0, 3).join(", ") || "son domaine"}. ${expsWithBullets.length > 0 ? `${expsWithBullets.length} expérience${expsWithBullets.length > 1 ? "s" : ""} professionnelle${expsWithBullets.length > 1 ? "s" : ""}.` : ""} ${languages.length > 0 ? `${languages.length} langue${languages.length > 1 ? "s" : ""} maîtrisée${languages.length > 1 ? "s" : ""}.` : ""}`.trim(),
        experiences: expsWithBullets,
        education,
        skills,
        languages,
      };

      setCv(structured);
    }
    load();
  }, []);

  // Build animation sequence
  useEffect(() => {
    if (!cv) return;
    let timeout: NodeJS.Timeout;
    let totalDelay = 0;

    BUILD_STEPS.forEach((step, i) => {
      totalDelay += step.duration;
      setTimeout(() => setBuildStep(i + 1), totalDelay);
    });

    timeout = setTimeout(() => setPhase("reveal"), totalDelay + 400);
    return () => clearTimeout(timeout);
  }, [cv]);

  useEffect(() => {
    if (phase === "reveal") {
      const t = setTimeout(() => setPhase("done"), 1200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <AnimatePresence mode="wait">
        {/* ━━━ Phase 1: Building ━━━ */}
        {phase === "building" && (
          <motion.div key="building" exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center min-h-[60vh]">
            {/* Pulsing circle */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/30"
            >
              <span className="text-4xl">📄</span>
            </motion.div>

            <h2 className="text-xl font-extrabold mb-2">Création de ton CV...</h2>
            <p className="text-sm text-gray-400 mb-8">Powered by Claude Opus 4.7</p>

            {/* Steps */}
            <div className="space-y-3 w-full max-w-xs">
              {BUILD_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={buildStep > i ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                    buildStep > i ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {buildStep > i ? "✓" : step.icon}
                  </div>
                  <span className={`text-sm ${buildStep > i ? "text-gray-800 font-medium" : "text-gray-400"}`}>{step.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ━━━ Phase 2: Reveal ━━━ */}
        {(phase === "reveal" || phase === "done") && cv && (
          <motion.div key="reveal" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            {/* Success header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30"
              >
                <span className="text-3xl">✨</span>
              </motion.div>
              <h1 className="text-2xl font-extrabold">Voilà ton CV !</h1>
              <p className="text-sm text-gray-500 mt-1">Généré à partir de ton profil. Personnalise-le pour chaque offre.</p>
            </motion.div>

            {/* CV Preview with glow effect */}
            <motion.div
              initial={{ boxShadow: "0 0 0 0 rgba(99, 102, 241, 0)" }}
              animate={{ boxShadow: ["0 0 60px 10px rgba(99, 102, 241, 0.15)", "0 0 30px 5px rgba(99, 102, 241, 0.05)"] }}
              transition={{ delay: 0.6, duration: 2, ease: "easeOut" }}
              className="rounded-2xl border border-gray-200 overflow-hidden"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <CVTemplateEngine cv={cv} preset={PRESETS[1]} palette="indigo" />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 space-y-3"
            >
              <button
                onClick={() => router.push("/apply")}
                className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all cursor-pointer shadow-xl shadow-indigo-600/20 hover:-translate-y-0.5"
              >
                Personnaliser pour une offre d&apos;emploi →
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 rounded-2xl bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-all cursor-pointer"
              >
                Aller au dashboard
              </button>
              <p className="text-xs text-gray-400 text-center">
                Ce CV est un aperçu de base. Colle une offre d&apos;emploi pour que l&apos;IA le personnalise avec les mots-clés ATS et le double scoring Recruteur.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
