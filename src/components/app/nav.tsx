"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Accueil", icon: HomeIcon, mobileOnly: false },
  { href: "/apply", label: "Candidater", icon: PlusIcon, mobileOnly: false },
  { href: "/templates", label: "Templates", icon: LayoutIcon, mobileOnly: false },
  { href: "/pricing", label: "Crédits", icon: CreditIcon, mobileOnly: true },
  { href: "/settings", label: "Profil", icon: UserIcon, mobileOnly: true },
];

// ━━━ Desktop Nav ━━━
export function DesktopNav({ credits, name }: { credits: number; name: string }) {
  const pathname = usePathname();

  return (
    <nav className="hidden sm:block sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/80">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-baseline gap-0.5">
            <span className="text-[18px] font-black tracking-tight">send</span>
            <span className="text-[18px] font-black tracking-tight text-indigo-600">cv</span>
            <span className="text-[8px] text-gray-300 font-semibold">.ai</span>
          </Link>
          <div className="flex items-center gap-1">
            {NAV_ITEMS.filter((n) => !n.mobileOnly).map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <item.icon size={15} active={active} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="flex items-center gap-1.5 text-xs bg-indigo-50 px-3 py-1.5 rounded-full font-bold text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors">
            <CreditIcon size={13} active={false} />
            {credits}
          </Link>
          <Link href="/settings" className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold hover:scale-105 transition-transform">
            {name.charAt(0).toUpperCase()}
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ━━━ Mobile Bottom Nav (app-like) ━━━
export function MobileNav({ credits }: { credits: number }) {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-gray-100/80 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] ${
                active ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              {item.href === "/apply" ? (
                // Bouton central proéminent
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center -mt-4 shadow-lg transition-all ${
                  active ? "bg-indigo-600 shadow-indigo-600/30" : "bg-indigo-600 shadow-indigo-600/20"
                }`}>
                  <PlusIcon size={20} active={true} white />
                </div>
              ) : (
                <item.icon size={20} active={active} />
              )}
              <span className={`text-[10px] font-medium ${item.href === "/apply" ? "-mt-0.5" : ""}`}>
                {item.href === "/pricing" ? `${credits}` : item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ━━━ Icons (inline SVG, pas de dépendance) ━━━
function HomeIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#4338ca" : "#9ca3af"} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function PlusIcon({ size, active, white }: { size: number; active: boolean; white?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={white ? "#fff" : active ? "#4338ca" : "#9ca3af"} strokeWidth={2.5} strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function LayoutIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#4338ca" : "#9ca3af"} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

function CreditIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#4338ca" : "#9ca3af"} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function UserIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#4338ca" : "#9ca3af"} strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
