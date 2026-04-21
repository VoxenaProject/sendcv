"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const STATUSES = [
  { value: "generated", label: "Générée", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "applied", label: "Postulé", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "interview", label: "Entretien", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "rejected", label: "Refusé", color: "bg-red-50 text-red-600 border-red-200" },
  { value: "hired", label: "Embauché !", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
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
      <button onClick={() => setOpen(!open)}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${current.color}`}>
        {current.label} ▾
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-1 min-w-[140px]">
            {STATUSES.map((s) => (
              <button key={s.value} onClick={() => updateStatus(s.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer hover:bg-gray-50 ${
                  s.value === currentStatus ? "bg-gray-50 font-bold" : ""
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
