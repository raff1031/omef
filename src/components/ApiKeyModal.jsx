import { useState } from "react";
import { Eye, EyeOff, ExternalLink } from "lucide-react";

export default function ApiKeyModal({ isOpen, onSubmit, onDemo }) {
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-allow-browser": "true",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1,
          messages: [{ role: "user", content: "hi" }],
        }),
      });

      if (res.ok) {
        onSubmit(key.trim());
      } else {
        const data = await res.json().catch(() => ({}));
        setError(
          data?.error?.message || `Chiave non valida (status ${res.status}).`
        );
      }
    } catch {
      setError("Errore di rete. Controlla la connessione e riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-8">
        {/* Logo area */}
        <div className="flex flex-col items-center mb-6 text-center">
          <span className="text-5xl mb-3">🌲</span>
          <h1 className="text-2xl font-bold text-omef-forest tracking-wide">
            OMEF GROUP
          </h1>
          <p className="text-omef-muted text-sm mt-1 tracking-widest uppercase">
            Sistema AI — Demo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Key input */}
          <div>
            <label
              htmlFor="api-key"
              className="block text-sm font-medium text-omef-forest mb-1"
            >
              Anthropic API Key
            </label>
            <div className="relative">
              <input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setError("");
                }}
                placeholder="sk-ant-..."
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-omef-sage focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-omef-muted hover:text-omef-forest transition-colors"
                aria-label={showKey ? "Nascondi chiave" : "Mostra chiave"}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Warning box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
            <p className="font-semibold mb-0.5">Attenzione</p>
            <p>
              Demo only — non usare la propria API key su siti pubblici. Questa
              chiave viene usata solo in sessione e non viene salvata su alcun
              server.
            </p>
          </div>

          {/* Get key link */}
          <p className="text-xs text-omef-muted text-center">
            Non hai una chiave?{" "}
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-omef-olive hover:underline inline-flex items-center gap-0.5"
            >
              Ottienila su console.anthropic.com
              <ExternalLink size={11} />
            </a>
          </p>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !key.trim()}
            className="w-full bg-omef-forest text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-omef-olive transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verifica in corso..." : "Accedi con API Key"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-omef-muted">oppure</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Demo mode button */}
          <button
            type="button"
            onClick={onDemo}
            className="w-full bg-omef-light text-omef-forest border border-omef-sage/40 rounded-lg py-2.5 text-sm font-semibold hover:bg-omef-sage/20 transition-colors"
          >
            🌲 Prova la Demo — senza API Key
          </button>
          <p className="text-xs text-omef-muted text-center">
            Risposte pre-configurate · nessun costo · nessuna registrazione
          </p>
        </form>
      </div>
    </div>
  );
}
