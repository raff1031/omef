import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, MapPin, Loader2, Bot, User, Package, Users } from 'lucide-react';
import { chatWithClaude, classifyLead } from '../lib/claude';
import { buildSystemPrompt } from '../lib/systemPrompt';
import { saveLead, getLeads } from '../lib/leadTracker';
import { getLocation, getNearestDealers } from '../lib/geo';
import { DEALERS } from '../data/dealers';
import { STOCK } from '../data/stock';
import DealerCard from '../components/DealerCard';
import StatusBadge from '../components/StatusBadge';

// ── helpers ──────────────────────────────────────────────────────────────────

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Ciao! Sono l'assistente AI di OMEF GROUP. Posso aiutarti con disponibilita' prodotti, trovare il concessionario piu' vicino, consigli tecnici e incentivi 2026. Come posso aiutarti?",
  dealers: null,
  timestamp: Date.now(),
};

const QUICK_CHIPS = [
  { label: 'Verifica stock',    text: "Verifica disponibilita' delle cesoie forestali" },
  { label: 'Trova dealer',      text: null, geo: true },
  { label: 'Consiglio tecnico', text: 'Quale cesoia scegliere per un escavatore da 5 tonnellate?' },
  { label: 'Noleggio',          text: 'Quali sono i prezzi per il noleggio di un escavatore?' },
  { label: 'Bandi 2026',        text: 'Quali incentivi ci sono nel 2026 per le attrezzature forestali?' },
];

// Stocks sorted: red first, then amber, then green
const SORTED_STOCK = [...STOCK].sort((a, b) => {
  const order = { red: 0, amber: 1, green: 2 };
  return (order[a.status] ?? 3) - (order[b.status] ?? 3);
});

const DEALER_KEYWORDS = ['concessionario', 'dealer', 'vicino', 'rivenditore', 'dove comprare'];

function isDealerQuery(text) {
  const t = text.toLowerCase();
  return DEALER_KEYWORDS.some(k => t.includes(k));
}

// ── TypingIndicator ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-[#EEF2E8] flex items-center justify-center flex-shrink-0 text-base">
        🌲
      </div>
      <div className="bg-[#EEF2E8] text-[#152E20] rounded-2xl rounded-tl-sm px-4 py-3">
        <span className="inline-flex items-center gap-1">
          <DotPulse delay="0ms" />
          <DotPulse delay="200ms" />
          <DotPulse delay="400ms" />
        </span>
      </div>
    </div>
  );
}

function DotPulse({ delay }) {
  return (
    <span
      className="typing-dot w-2 h-2 bg-[#5A6A5C] rounded-full inline-block"
      style={{ animationDelay: delay }}
    />
  );
}

// ── MessageBubble ─────────────────────────────────────────────────────────────

function MessageBubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex gap-3 justify-end items-start">
        <div className="bg-[#152E20] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap">
          {msg.content}
        </div>
        <div className="w-8 h-8 rounded-full bg-[#152E20] flex items-center justify-center flex-shrink-0">
          <User size={15} className="text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-[#EEF2E8] flex items-center justify-center flex-shrink-0 text-base">
        🌲
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-[#EEF2E8] text-[#152E20] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap">
          {msg.content || <span className="text-[#5A6A5C] italic">...</span>}
        </div>
        {msg.dealers && msg.dealers.length > 0 && (
          <div className="mt-1 max-w-[85%]">
            {msg.dealers.map(d => (
              <DealerCard key={d.id} dealer={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── StockWidget ───────────────────────────────────────────────────────────────

function StockWidget() {
  const top3 = SORTED_STOCK.slice(0, 3);
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Package size={16} className="text-[#3D6B2A]" />
        <span className="text-sm font-semibold text-[#152E20]">Magazzino</span>
      </div>
      <div className="flex flex-col gap-2">
        {top3.map(item => (
          <div key={item.id} className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-[#152E20] truncate leading-tight">
              {item.name}
            </span>
            <StatusBadge status={item.status} label={item.label} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LeadWidget ────────────────────────────────────────────────────────────────

function LeadWidget({ count }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Users size={16} className="text-[#3D6B2A]" />
        <span className="text-sm font-semibold text-[#152E20]">Lead sessione</span>
      </div>
      <div key={count} className="text-3xl font-bold text-[#152E20] mb-0.5 tabular-nums">
        {count}
      </div>
      <p className="text-xs text-[#5A6A5C] mb-3">conversazioni tracciate</p>
      <a
        href="#/leads"
        className="text-xs text-[#3D6B2A] hover:text-[#152E20] font-medium transition-colors"
      >
        Vedi tutti &rarr;
      </a>
    </div>
  );
}

// ── NearestDealerWidget ───────────────────────────────────────────────────────

function NearestDealerWidget({ userLocation }) {
  if (!userLocation) return null;
  const nearest = getNearestDealers(DEALERS, userLocation.lat, userLocation.lon, 1)[0];
  if (!nearest) return null;

  return (
    <div className="bg-[#EEF2E8] rounded-2xl p-4 border border-[#7A9E50]/20">
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-[#3D6B2A]" />
        <span className="text-sm font-semibold text-[#152E20]">Dealer piu' vicino</span>
      </div>
      <DealerCard dealer={nearest} />
    </div>
  );
}

// ── ChatPage (main) ───────────────────────────────────────────────────────────

export default function ChatPage({ apiKey }) {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLabel, setLocationLabel] = useState('');
  const [leadCount, setLeadCount] = useState(() => getLeads().length);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Read prefill from StockPage "Chiedi disponibilita'" button
  useEffect(() => {
    const prefill = sessionStorage.getItem('omef_prefill');
    if (prefill) {
      sessionStorage.removeItem('omef_prefill');
      setInput(prefill);
    }
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  function handleInputChange(e) {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }

  // Build conversation history for API (exclude empty streaming stubs)
  function buildHistory(msgs) {
    return msgs
      .filter(m => (m.role === 'user' || m.role === 'assistant') && m.content)
      .map(m => ({ role: m.role, content: m.content }));
  }

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return;

      const userMsg = {
        id: makeId(),
        role: 'user',
        content: text.trim(),
        dealers: null,
        timestamp: Date.now(),
      };

      // Add user message
      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);

      // Fire classify in parallel
      const classifyPromise = classifyLead(text, apiKey).catch(() => ({
        product: 'Generico',
        category: 'info',
        score: 5,
      }));

      // Build system prompt with current location
      const systemPrompt = buildSystemPrompt(userLocation);

      // Stub for streaming assistant message
      const assistantId = makeId();
      const assistantStub = {
        id: assistantId,
        role: 'assistant',
        content: '',
        dealers: null,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantStub]);

      try {
        // Build history from current messages + the new user msg (exclude the empty stub)
        const historyMsgs = [...messages, userMsg].filter(
          m => (m.role === 'user' || m.role === 'assistant') && m.content
        );
        const history = historyMsgs.map(m => ({ role: m.role, content: m.content }));

        await chatWithClaude({
          messages: history,
          systemPrompt,
          apiKey,
          onChunk: (_delta, full) => {
            setMessages(prev =>
              prev.map(m => (m.id === assistantId ? { ...m, content: full } : m))
            );
          },
        });

        // Await classify result
        const { product, category, score } = await classifyPromise;

        // Save lead
        saveLead({
          question: text,
          product,
          category,
          score,
          location: locationLabel || 'Non condivisa',
          page: '/',
        });
        setLeadCount(getLeads().length);

        // Attach dealers if relevant
        if (isDealerQuery(text)) {
          let dealers;
          if (userLocation) {
            dealers = getNearestDealers(DEALERS, userLocation.lat, userLocation.lon, 3);
          } else {
            dealers = DEALERS.slice(0, 3);
          }
          setMessages(prev =>
            prev.map(m => (m.id === assistantId ? { ...m, dealers } : m))
          );
        }
      } catch (err) {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `Errore: ${err.message || 'Qualcosa e\' andato storto. Riprova.'}`,
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiKey, isLoading, messages, userLocation, locationLabel]
  );

  async function requestGeolocAndSend() {
    try {
      const pos = await getLocation();
      setUserLocation(pos);
      const label = `${pos.lat.toFixed(4)}, ${pos.lon.toFixed(4)}`;
      setLocationLabel(label);
      await sendMessage("Trovami il concessionario piu' vicino alla mia posizione");
    } catch {
      await sendMessage("Trovami il concessionario piu' vicino alla mia posizione");
    }
  }

  function handleChipClick(chip) {
    if (chip.geo) {
      requestGeolocAndSend();
    } else {
      sendMessage(chip.text);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const val = input.trim();
      if (val) {
        setInput('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        sendMessage(val);
      }
    }
  }

  function handleSend() {
    const val = input.trim();
    if (val) {
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      sendMessage(val);
    }
  }

  return (
    <div className="flex gap-6 items-start">
      {/* ── LEFT: Chat area ── */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <div className="bg-[#152E20] rounded-full w-10 h-10 flex items-center justify-center text-xl flex-shrink-0">
              🌲
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#152E20] text-sm leading-tight">
                Assistente OMEF
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-[#5A6A5C]">Online</span>
              </div>
            </div>
            <Bot size={18} className="text-[#5A6A5C]" />
          </div>

          {/* Quick chips */}
          <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-thin border-b border-gray-100">
            {QUICK_CHIPS.map(chip => (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip)}
                disabled={isLoading}
                className="bg-[#EEF2E8] text-[#152E20] text-sm px-3 py-1.5 rounded-full border border-[#7A9E50]/30 hover:bg-[#7A9E50]/20 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="h-[420px] md:h-[520px] overflow-y-auto flex flex-col gap-3 p-4 scroll-smooth">
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-2 items-end">
            <button
              onClick={requestGeolocAndSend}
              disabled={isLoading}
              title="Condividi posizione"
              className="text-[#5A6A5C] hover:text-[#7A9E50] transition-colors p-1 flex-shrink-0 disabled:opacity-40"
            >
              <MapPin size={18} />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Scrivi un messaggio..."
              className="flex-1 resize-none border-0 focus:ring-0 outline-none text-sm text-[#152E20] placeholder-[#5A6A5C]/60 bg-transparent leading-relaxed py-1 disabled:opacity-50"
              style={{ maxHeight: '120px' }}
            />

            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-[#152E20] text-white rounded-xl px-4 py-2 flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Sidebar ── */}
      <div className="w-80 flex-shrink-0 sticky top-4 hidden md:flex flex-col gap-4">
        <StockWidget />
        <LeadWidget count={leadCount} />
        {userLocation && <NearestDealerWidget userLocation={userLocation} />}
      </div>
    </div>
  );
}
