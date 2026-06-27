import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Phone, Mail, ChevronRight } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/catalogo", label: "Catalogo" },
  { to: "/chi-siamo", label: "Chi Siamo" },
  { to: "/concessionari", label: "Concessionari" },
  { to: "/contatti", label: "Contatti" },
];

export default function PublicLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-omef-paper">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-omef-forest text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl leading-none">🌲</span>
              <span className="flex items-baseline gap-1">
                <span className="text-lg font-bold tracking-wide text-white">OMEF</span>
                <span className="text-sm font-medium text-white/70 tracking-widest uppercase">GROUP</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded text-sm font-medium transition-colors ${
                      isActive
                        ? "text-omef-bark bg-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* CTA Button (desktop) */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => navigate("/demo")}
                className="ml-4 px-4 py-2 bg-omef-bark text-white text-sm font-semibold rounded hover:bg-omef-bark/90 transition-colors"
              >
                Prova l'AI →
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-omef-earth border-t border-white/10">
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded text-sm font-medium transition-colors ${
                      isActive
                        ? "text-omef-bark bg-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/demo");
                }}
                className="mt-2 px-3 py-2 bg-omef-bark text-white text-sm font-semibold rounded hover:bg-omef-bark/90 transition-colors text-left"
              >
                Prova l'AI →
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="bg-omef-forest text-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left: Brand */}
            <div className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl leading-none">🌲</span>
                <span className="flex items-baseline gap-1">
                  <span className="text-lg font-bold tracking-wide text-white">OMEF</span>
                  <span className="text-sm font-medium text-white/50 tracking-widest uppercase">GROUP</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed">
                Attrezzature forestali per escavatori dal 1980.
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                Via Bassa dei Gentilini 100<br />
                15060 Basaluzzo (AL)
              </p>
            </div>

            {/* Center: Links */}
            <div>
              <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
                Navigazione
              </h3>
              <ul className="flex flex-col gap-2">
                {[
                  { to: "/catalogo", label: "Catalogo" },
                  { to: "/chi-siamo", label: "Chi Siamo" },
                  { to: "/concessionari", label: "Concessionari" },
                  { to: "/contatti", label: "Contatti" },
                  { to: "/demo", label: "Demo AI" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="flex items-center gap-1 text-sm hover:text-white transition-colors group"
                    >
                      <ChevronRight
                        size={14}
                        className="text-omef-bark opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Contacts */}
            <div>
              <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
                Contatti
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <a
                    href="tel:+390143197459"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Phone size={15} className="text-omef-bark shrink-0" />
                    0143 19 79 459
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@omefgroup.com"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Mail size={15} className="text-omef-bark shrink-0" />
                    info@omefgroup.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/393498556830"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-[15px] h-[15px] text-omef-bark shrink-0"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    +39 349 855 6830
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-xs text-white/40 text-center">
              © 2026 OMEF GROUP S.R.L. — P.IVA 00123456789 | Tutti i diritti riservati
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
