"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

interface Message { id: string; role: "user" | "assistant"; content: string; }

export default function SimulatePage() {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [started, setStarted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendMessage(userContent?: string) {
    const content = userContent || input.trim();
    if (!content && started) return;

    const newMessages = started
      ? [...messages, { id: Date.now().toString(), role: "user" as const, content }]
      : messages;

    if (started) {
      setMessages(newMessages);
      setInput("");
    }

    setStreaming(true);
    if (!started) setStarted(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, ...(started ? [] : []), { id: assistantId, role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/coach/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: id,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (response.status === 402) { router.push("/pricing"); return; }
      if (!response.ok) throw new Error("Erreur");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("Pas de stream");

      let fullContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: fullContent } : m));
      }
    } catch {
      setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, content: "Erreur de connexion. Réessaie." } : m));
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-lg">🎯</span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold">Simulation d&apos;entretien</h1>
            <p className="text-[11px] text-gray-400">Le coach joue le recruteur. Réponds comme en vrai.</p>
          </div>
        </div>
        <Link href={`/apply/${id}`} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          ← Retour
        </Link>
      </div>

      {/* Start screen */}
      {!started && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
            <span className="text-4xl">🎤</span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold">Prêt pour ton entretien ?</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-sm">Le coach IA va jouer le rôle du recruteur pour ce poste. Réponds comme si c&apos;était un vrai entretien. Tu recevras un feedback après chaque réponse.</p>
          </div>
          <button onClick={() => sendMessage("Bonjour, je suis prêt pour l'entretien.")}
            className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 cursor-pointer hover:-translate-y-0.5">
            Commencer la simulation
          </button>
          <p className="text-[10px] text-gray-300">Feature Pro — Powered by Claude Haiku 4.5</p>
        </motion.div>
      )}

      {/* Messages */}
      {started && (
        <>
          <div className="flex-1 overflow-y-auto space-y-3 pb-4">
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-white border border-gray-200 rounded-bl-md shadow-sm"
                }`}>
                  {msg.content || (
                    <span className="flex gap-1 text-gray-400">
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 pt-3 border-t border-gray-100">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={streaming}
                placeholder="Ta réponse..." autoFocus
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50 bg-white" />
              <button type="submit" disabled={!input.trim() || streaming}
                className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-600/15 shrink-0">
                Envoyer
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
