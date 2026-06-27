import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MessageSquare, Package, MapPin, BarChart2, Users, Menu, X } from "lucide-react";

const navItems = [
  { to: "/demo", label: "Chat AI", icon: MessageSquare },
  { to: "/demo/stock", label: "Magazzino", icon: Package },
  { to: "/demo/dealers", label: "Concessionari", icon: MapPin },
  { to: "/demo/season", label: "Stagionalita'", icon: BarChart2 },
  { to: "/demo/leads", label: "Lead Tracker", icon: Users },
];

const pageTitles = {
  "/demo": "Chat AI",
  "/demo/stock": "Magazzino",
  "/demo/dealers": "Concessionari",
  "/demo/season": "Stagionalita'",
  "/demo/leads": "Lead Tracker",
};

function Sidebar({ onClose }) {
  return (
    <div className="flex flex-col h-full bg-[#152E20] w-56">
      {/* Logo area */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <span className="text-3xl">🌲</span>
        <div className="leading-tight">
          <div className="text-white font-bold text-xl tracking-wide">OMEF</div>
          <div className="text-white/60 text-xs tracking-widest uppercase">Group</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-white/60 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-4 py-3 rounded-lg mx-2 text-white transition-colors",
                isActive
                  ? "bg-white/20 font-semibold"
                  : "hover:bg-white/10 font-normal",
              ].join(" ")
            }
          >
            <Icon size={18} />
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Version badge */}
      <div className="px-5 py-4 border-t border-white/10">
        <span className="text-white/40 text-xs">v0.1 Demo</span>
      </div>
    </div>
  );
}

export default function Layout({ children, isDemo, onOpenModal }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? "OMEF";

  return (
    <div className="min-h-screen bg-[#F6F4F0]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-56 z-30 shadow-lg">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50 flex h-full w-56 shadow-xl">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="md:ml-56 flex flex-col min-h-screen">
        {/* Demo banner */}
        {isDemo && (
          <div className="bg-omef-bark/90 text-white text-xs text-center py-1.5 px-4 flex items-center justify-center gap-2">
            <span>🌲 Modalità Demo — risposte pre-configurate</span>
            <button
              onClick={onOpenModal}
              className="underline hover:no-underline font-semibold opacity-90 hover:opacity-100"
            >
              Usa API Key reale →
            </button>
          </div>
        )}

        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 sticky top-0 z-20">
          <button
            className="md:hidden mr-4 text-[#5A6A5C] hover:text-[#152E20] transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <h1 className="font-semibold text-[#152E20] text-base flex-1">{pageTitle}</h1>

          <span className="text-[#5A6A5C] text-sm hidden sm:block">
            OMEF GROUP S.R.L.
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
