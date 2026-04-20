"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STATUSES = [
  { value: "generated", label: "Generee", color: "bg-primary/10 text-primary border-primary/20" },
  { value: "applied", label: "Postule", color: "bg-accent/10 text-accent border-accent/20" },
  { value: "interview", label: "Entretien", color: "bg-success/10 text-success border-success/20" },
  { value: "rejected", label: "Refuse", color: "bg-danger/10 text-danger border-danger/20" },
  { value: "hired", label: "Embauche !", color: "bg-success/10 text-success border-success/20" },
];

export function StatusManager({ applicationId, currentStatus }: { applicationId: string; currentStatus: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const current = STATUSES.find((s) => s.value === currentStatus) || STATUSES[0];

  async function updateStatus(newStatus: string) {
    const supabase = createClient();
    await supabase.from("applications").update({ status: newStatus }).eq("id", applicationId);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${current.color}`}
      >
        {current.label} ▾
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg p-1 min-w-[140px]">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => updateStatus(s.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer hover:bg-surface ${
                  s.value === currentStatus ? "bg-surface font-bold" : ""
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
