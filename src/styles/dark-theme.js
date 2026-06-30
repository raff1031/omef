// Shared dark-theme styles for OMEF public website
// Import via: import { DARK_CSS } from '../../styles/dark-theme';

export const DARK_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

.omef-dark * { box-sizing: border-box; }
.omef-dark { font-family: 'Inter', system-ui, sans-serif; background: #0a1a0e; color: #F1F5F9; min-height: 100vh; line-height: 1.6; -webkit-font-smoothing: antialiased; }
.omef-dark h1, .omef-dark h2, .omef-dark h3, .omef-dark h4 { font-family: 'Syne', sans-serif; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; color: #F1F5F9; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(48px); } to { opacity: 1; transform: translateY(0); } }
@keyframes floatA { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(40px, -30px) rotate(8deg); } }
@keyframes floatB { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-30px, 40px); } }
@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
@keyframes wordAnim { 0% { opacity: 0; transform: translateY(20px); } 15%, 85% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }

.omef-dark .rv { opacity: 0; transform: translateY(28px); transition: opacity .7s cubic-bezier(.4,0,.2,1), transform .7s cubic-bezier(.4,0,.2,1); }
.omef-dark .rv.on { opacity: 1; transform: none; }

.omef-dark .nav-link { color: #b8c4ba; text-decoration: none; font-size: 14px; font-weight: 500; transition: color .2s; cursor: pointer; }
.omef-dark .nav-link:hover, .omef-dark .nav-link.active { color: #C4924A; }

.omef-dark .btn-primary { background: linear-gradient(135deg, #C4924A, #d4a050); color: #0a1a0e; border: none; padding: 14px 28px; border-radius: 10px; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; transition: transform .25s, box-shadow .25s; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
.omef-dark .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(196, 146, 74, 0.35); }

.omef-dark .btn-ghost { background: transparent; color: #F1F5F9; border: 1px solid rgba(255,255,255,.18); padding: 14px 28px; border-radius: 10px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; transition: all .25s; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
.omef-dark .btn-ghost:hover { border-color: #C4924A; background: rgba(196,146,74,.08); }

.omef-dark .card { background: rgba(15, 35, 22, 0.65); border: 1px solid rgba(255,255,255,.07); border-radius: 18px; overflow: hidden; transition: transform .35s cubic-bezier(.4,0,.2,1), border-color .35s, box-shadow .35s; }
.omef-dark .card:hover { transform: translateY(-6px); border-color: rgba(196,146,74,.4); box-shadow: 0 24px 60px rgba(0,0,0,.4), 0 0 0 1px rgba(196,146,74,.2); }

.omef-dark .tag-pill { display: inline-block; background: rgba(196,146,74,.08); color: #d4a050; padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; margin: 4px 6px 0 0; border: 1px solid rgba(196,146,74,.15); }

.omef-dark .section-label { display: inline-block; padding: 6px 14px; border-radius: 999px; background: rgba(196,146,74,.08); color: #d4a050; font-size: 11px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; margin-bottom: 18px; }

.omef-dark .input { width: 100%; background: rgba(15, 35, 22, 0.6); border: 1px solid rgba(255,255,255,.08); color: #F1F5F9; padding: 14px 18px; border-radius: 10px; font-family: 'Inter', sans-serif; font-size: 15px; transition: border-color .2s, background .2s; outline: none; }
.omef-dark .input:focus { border-color: #C4924A; background: rgba(15, 35, 22, 0.85); }
.omef-dark .input::placeholder { color: #64748B; }

.omef-dark .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.omef-dark .status-green { background: rgba(74, 222, 128, .12); color: #4ade80; border: 1px solid rgba(74, 222, 128, .25); }
.omef-dark .status-amber { background: rgba(196, 146, 74, .12); color: #d4a050; border: 1px solid rgba(196, 146, 74, .25); }
.omef-dark .status-red { background: rgba(248, 113, 113, .12); color: #f87171; border: 1px solid rgba(248, 113, 113, .25); }
.omef-dark .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.omef-dark .ticker-track { display: flex; gap: 60px; white-space: nowrap; animation: ticker 40s linear infinite; will-change: transform; }
.omef-dark .ticker-item { font-size: 14px; color: #5a6c5e; font-weight: 500; letter-spacing: 0.05em; display: inline-flex; align-items: center; gap: 60px; }
.omef-dark .ticker-item::after { content: '◆'; color: rgba(196,146,74,.3); font-size: 8px; }

.omef-dark .filter-chip { padding: 8px 16px; border-radius: 999px; background: rgba(15, 35, 22, 0.5); border: 1px solid rgba(255,255,255,.08); color: #b8c4ba; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .2s; }
.omef-dark .filter-chip:hover { border-color: rgba(196,146,74,.4); color: #F1F5F9; }
.omef-dark .filter-chip.active { background: linear-gradient(135deg, #C4924A, #d4a050); color: #0a1a0e; border-color: transparent; font-weight: 700; }

.omef-dark a { color: inherit; }

@media (prefers-reduced-motion: reduce) {
  .omef-dark * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}

@media (max-width: 768px) {
  .omef-nav-links { display: none !important; }
  .omef-mobile-only { display: flex !important; }
}
@media (min-width: 769px) {
  .omef-mobile-only { display: none !important; }
}
`;

// Re-usable IntersectionObserver hooks
export function makeRevealHook(useState, useEffect, useRef) {
  return function useReveal(delay = 0) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return { ref, className: `rv${visible ? ' on' : ''}`, style: { transitionDelay: `${delay}ms` } };
  };
}
