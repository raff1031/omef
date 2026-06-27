# OMEF GROUP — AI Demo · Claude Code Handoff

> **Obiettivo:** Costruire e deployare una demo statica su GitHub Pages che mostri il sistema AI integrato di OMEF Group. La demo è autocontenuta, usa React + Vite, e si deploya automaticamente via GitHub Actions.

---

## Contesto del progetto

OMEF GROUP S.R.L. è un'azienda italiana produttrice di attrezzature forestali (cesoie, trince, spaccalegna, pinze, potatrici) con sede a Castelletto d'Orba (AL). Il sistema che stai costruendo è una **demo** del backend AI che integra:

1. **Chat AI** — assistente conversazionale che conosce prodotti, stock e concessionari
2. **Stock checker** — verifica disponibilità magazzino per 10 SKU
3. **Dealer Finder** — trova il concessionario più vicino via geolocalizzazione del browser
4. **Lead Tracker** — salva ogni interazione in localStorage con prodotto + location + score
5. **Seasonal Dashboard** — grafico domanda mensile per categoria prodotto (utile per pianificazione produzione)

**Stack AI:** Claude Sonnet 4.6 per la chat, Claude Haiku 4.5 per la classificazione veloce dei lead.

**Nota importante:** Questa è una demo client-side. L'utente inserisce la propria API key nella UI. In produzione, le chiamate passerebbero attraverso un API server Node.js (mai esporre la chiave nel frontend).

---

## Stack tecnico

```
Framework:     React 18 + Vite
Styling:       Tailwind CSS v3
Charts:        Recharts
Icons:         Lucide React
Routing:       React Router v6 (hash routing per GitHub Pages)
AI:            Anthropic SDK (chiamate dirette dal browser nella demo)
Deploy:        GitHub Pages via GitHub Actions
```

Tutto statico — nessun backend, nessun server. GitHub Pages serve i file buildati.

---

## Setup iniziale

```bash
# 1. Crea il progetto
npm create vite@latest omef-ai-demo -- --template react
cd omef-ai-demo

# 2. Installa dipendenze
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install recharts lucide-react react-router-dom

# 3. Configura Tailwind (tailwind.config.js)
# content: ["./index.html", "./src/**/*.{js,jsx}"]

# 4. Configura Vite per GitHub Pages (vite.config.js)
# base: '/omef-ai-demo/'   ← nome del repo GitHub

# 5. Aggiungi a package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"
```

---

## Struttura file

```
omef-ai-demo/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx
│   ├── App.jsx                    ← Router + layout shell
│   ├── index.css                  ← Tailwind directives + custom CSS
│   │
│   ├── data/
│   │   ├── stock.js               ← Mock stock data (10 SKU)
│   │   ├── dealers.js             ← Mock dealers (lat/lon, 15 concessionari)
│   │   └── seasonality.js         ← Domanda mensile per categoria
│   │
│   ├── lib/
│   │   ├── claude.js              ← Wrapper chiamate API Anthropic
│   │   ├── geo.js                 ← Haversine distance + geolocation
│   │   ├── leadTracker.js         ← CRUD localStorage per lead
│   │   └── systemPrompt.js        ← System prompt dinamico con stock+dealer context
│   │
│   ├── components/
│   │   ├── Layout.jsx             ← Sidebar nav + header
│   │   ├── ApiKeyModal.jsx        ← Modal inserimento API key al primo accesso
│   │   ├── StatusBadge.jsx        ← Badge verde/ambra/rosso disponibilità
│   │   └── DealerCard.jsx         ← Card concessionario nella chat
│   │
│   └── pages/
│       ├── ChatPage.jsx           ← Chat AI principale (pagina default)
│       ├── StockPage.jsx          ← Dashboard stock magazzino
│       ├── DealerPage.jsx         ← Mappa dealer + finder
│       ├── SeasonPage.jsx         ← Grafico stagionalità + consigli produzione
│       └── LeadsPage.jsx          ← CRM lead tracker
│
├── .github/
│   └── workflows/
│       └── deploy.yml             ← GitHub Actions deploy su gh-pages
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Palette colori (brand OMEF)

Aggiungi in `tailwind.config.js` sotto `theme.extend.colors`:

```js
omef: {
  forest: '#152E20',
  earth:  '#1E3A18',
  olive:  '#3D6B2A',
  sage:   '#7A9E50',
  bark:   '#C4924A',
  light:  '#EEF2E8',
  paper:  '#F6F4F0',
  muted:  '#5A6A5C',
}
```

---

## Dati mock — `src/data/stock.js`

```js
export const STOCK = [
  { id: 'BI100',  name: 'Cesoia Forestale BI100',  category: 'cesoie',     qty: 8,  status: 'green',  label: 'Disponibile',    minWeight: 1, maxWeight: 5  },
  { id: 'BI200',  name: 'Cesoia Forestale BI200',  category: 'cesoie',     qty: 3,  status: 'amber',  label: 'Ultimi pezzi',   minWeight: 3, maxWeight: 10 },
  { id: 'BI300',  name: 'Cesoia Forestale BI300',  category: 'cesoie',     qty: 0,  status: 'red',    label: 'Su ordinazione', minWeight: 5, maxWeight: 20 },
  { id: 'SPV1',   name: 'Spaccalegna SPV1',        category: 'legna',      qty: 12, status: 'green',  label: 'Disponibile',    minWeight: 1, maxWeight: 5  },
  { id: 'TE1',    name: 'Trincia a Mazze TE1',     category: 'trince',     qty: 5,  status: 'green',  label: 'Disponibile',    minWeight: 1, maxWeight: 8  },
  { id: 'PFIMX',  name: 'Pinza per Legna PFIMX',   category: 'pinze',      qty: 2,  status: 'amber',  label: 'Ultimi pezzi',   minWeight: 1, maxWeight: 6  },
  { id: 'HD',     name: 'Pinza per Legna HD',      category: 'pinze',      qty: 7,  status: 'green',  label: 'Disponibile',    minWeight: 2, maxWeight: 8  },
  { id: 'BF1200', name: 'Barra Falciante BF1200',  category: 'potatura',   qty: 4,  status: 'green',  label: 'Disponibile',    minWeight: 1, maxWeight: 5  },
  { id: 'FR90',   name: 'Fresaceppi FR90',         category: 'terreno',    qty: 1,  status: 'amber',  label: 'Ultimo pezzo',   minWeight: 2, maxWeight: 8  },
  { id: 'ST90',   name: 'Estirpa Ceppi ST90 (usato)', category: 'usato',  qty: 1,  status: 'green',  label: 'Disponibile',    minWeight: 1, maxWeight: 5  },
];
```

---

## Dati mock — `src/data/dealers.js`

```js
export const DEALERS = [
  { id: 1,  name: 'AgroMeccanica Piemonte',   city: 'Asti',        province: 'AT', lat: 44.90, lon: 8.21,  tel: '0141 456 789', email: 'asti@omefgroup.com'    },
  { id: 2,  name: 'Forestale Service Nord',   city: 'Genova',      province: 'GE', lat: 44.40, lon: 8.93,  tel: '010 234 567',  email: 'ge@omefgroup.com'      },
  { id: 3,  name: 'Verde & Bosco Srl',        city: 'Torino',      province: 'TO', lat: 45.07, lon: 7.69,  tel: '011 345 678',  email: 'to@omefgroup.com'      },
  { id: 4,  name: 'Macchinari Forestali Est', city: 'Milano',      province: 'MI', lat: 45.46, lon: 9.19,  tel: '02 456 789',   email: 'mi@omefgroup.com'      },
  { id: 5,  name: 'AgroPro Liguria',          city: 'La Spezia',   province: 'SP', lat: 44.10, lon: 9.82,  tel: '0187 234 567', email: 'sp@omefgroup.com'      },
  { id: 6,  name: 'Foresta & Prato',          city: 'Firenze',     province: 'FI', lat: 43.77, lon: 11.25, tel: '055 345 678',  email: 'fi@omefgroup.com'      },
  { id: 7,  name: 'Centro Verde Emiliano',    city: 'Bologna',     province: 'BO', lat: 44.49, lon: 11.34, tel: '051 456 789',  email: 'bo@omefgroup.com'      },
  { id: 8,  name: 'Macchine Verdi Sud',       city: 'Napoli',      province: 'NA', lat: 40.85, lon: 14.27, tel: '081 567 890',  email: 'na@omefgroup.com'      },
  { id: 9,  name: 'Sicilia Forestale',        city: 'Palermo',     province: 'PA', lat: 38.11, lon: 13.36, tel: '091 678 901',  email: 'pa@omefgroup.com'      },
  { id: 10, name: 'Verde Veneto',             city: 'Verona',      province: 'VR', lat: 45.44, lon: 10.99, tel: '045 789 012',  email: 'vr@omefgroup.com'      },
  { id: 11, name: 'Foresta Toscana',          city: 'Siena',       province: 'SI', lat: 43.32, lon: 11.33, tel: '0577 234 567', email: 'si@omefgroup.com'      },
  { id: 12, name: 'Nord Est Forestale',       city: 'Treviso',     province: 'TV', lat: 45.67, lon: 12.24, tel: '0422 345 678', email: 'tv@omefgroup.com'      },
  { id: 13, name: 'Calabria Verde',           city: 'Cosenza',     province: 'CS', lat: 39.30, lon: 16.25, tel: '0984 456 789', email: 'cs@omefgroup.com'      },
  { id: 14, name: 'Sardegna Forestale',       city: 'Cagliari',    province: 'CA', lat: 39.22, lon: 9.12,  tel: '070 567 890',  email: 'ca@omefgroup.com'      },
  { id: 15, name: 'Alto Adige Forst',         city: 'Bolzano',     province: 'BZ', lat: 46.50, lon: 11.36, tel: '0471 678 901', email: 'bz@omefgroup.com'      },
];
```

---

## Dati mock — `src/data/seasonality.js`

```js
// Domanda per mese (0=Gen … 11=Dic), scala 1-10
export const SEASONALITY = [
  {
    id: 'cesoie',
    label: 'Cesoie / Taglio alberi',
    color: '#3D6B2A',
    data: [3, 4, 8, 9, 8, 6, 5, 4, 6, 7, 6, 3],
    productionLead: 10, // settimane anticipo consigliato
    peak: [3, 4],       // mesi indice picco (Aprile, Maggio)
  },
  {
    id: 'trince',
    label: 'Trince / Sfalcio',
    color: '#7A9E50',
    data: [3, 4, 7, 8, 9, 9, 7, 5, 7, 5, 4, 3],
    productionLead: 8,
    peak: [4, 5],
  },
  {
    id: 'legna',
    label: 'Spaccalegna / Legna',
    color: '#C4924A',
    data: [5, 5, 4, 4, 4, 5, 7, 9, 10, 9, 7, 6],
    productionLead: 12,
    peak: [8, 9],
  },
  {
    id: 'noleggio',
    label: 'Noleggio Escavatori',
    color: '#2A5FA8',
    data: [3, 3, 6, 8, 9, 9, 7, 5, 8, 8, 6, 3],
    productionLead: 6,
    peak: [4, 5],
  },
];

export const MONTHS_FULL  = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
                              'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
export const MONTHS_SHORT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
```

---

## `src/lib/geo.js`

```js
// Distanza haversine in km
export function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.asin(Math.sqrt(a)));
}

// Promise che wrappa navigator.geolocation
export function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation non supportata'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => reject(err),
      { timeout: 8000 }
    );
  });
}

// Trova i N dealer più vicini dato lat/lon
export function getNearestDealers(dealers, lat, lon, n = 3) {
  return dealers
    .map(d => ({ ...d, km: haversine(lat, lon, d.lat, d.lon) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, n);
}
```

---

## `src/lib/leadTracker.js`

```js
const KEY = 'omef_leads_v1';

export function getLeads() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function saveLead({ question, product, category, location, score, page }) {
  const leads = getLeads();
  const lead = {
    id: Date.now(),
    question,
    product:  product  || 'Richiesta generica',
    category: category || 'info',
    location: location || 'Non condivisa',
    score:    score    || 5,
    page:     page     || '/',
    ts: new Date().toISOString(),
    time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString('it-IT'),
  };
  leads.push(lead);
  try { localStorage.setItem(KEY, JSON.stringify(leads.slice(-200))); } catch {}
  return lead;
}

export function clearLeads() {
  localStorage.removeItem(KEY);
}

export function getLeadStats(leads) {
  const byCategory = {};
  const byDate = {};
  leads.forEach(l => {
    byCategory[l.category] = (byCategory[l.category] || 0) + 1;
    byDate[l.date] = (byDate[l.date] || 0) + 1;
  });
  const avgScore = leads.length ? (leads.reduce((s, l) => s + (l.score || 5), 0) / leads.length).toFixed(1) : 0;
  return { byCategory, byDate, avgScore, total: leads.length };
}
```

---

## `src/lib/systemPrompt.js`

```js
import { STOCK } from '../data/stock';
import { DEALERS } from '../data/dealers';

export function buildSystemPrompt(userLocation = null) {
  const stockStr = STOCK.map(s =>
    `- ${s.name} (${s.id}): ${
      s.status === 'green' ? 'DISPONIBILE' :
      s.status === 'amber' ? `ULTIMI PEZZI (${s.qty} rimasti)` : 'SU ORDINAZIONE'
    } | Peso escavatore: ${s.minWeight}-${s.maxWeight} ton`
  ).join('\n');

  const dealerStr = userLocation
    ? (() => {
        const { getNearestDealers, haversine } = require('./geo');
        return getNearestDealers(DEALERS, userLocation.lat, userLocation.lon, 5)
          .map(d => `- ${d.name}, ${d.city} (${d.province}) — ${d.km} km — Tel: ${d.tel}`)
          .join('\n');
      })()
    : 'Posizione utente non ancora condivisa. Chiedi comune o provincia se serve trovare il dealer.';

  return `Sei l'assistente AI di OMEF GROUP S.R.L., produttore italiano di attrezzature forestali dal 1991.
Sede: Castelletto d'Orba (AL) · Tel: 0143 19 79 459 · WhatsApp: +39 349 855 6830
Sito: omefgroup.com

## STOCK MAGAZZINO ATTUALE
${stockStr}

## CONCESSIONARI PIÙ VICINI ALL'UTENTE
${dealerStr}

## PRODOTTI E COMPATIBILITÀ
Le attrezzature si montano su escavatori tramite attacco rapido universale.
- Cesoie BI100: 1-5 ton | BI200: 3-10 ton | BI300: 5-20 ton → taglio alberi fino a Ø 30/50/70 cm
- Spaccalegna SPV1: 1-5 ton → divisione tronchi idraulica
- Trincia TE1: 1-8 ton → trinciatura erba, arbusti, piante fino a Ø 20 cm
- Pinza HD/PFIMX: 2-8 ton → movimentazione e carico tronchi
- Barra Falciante BF1200: 1-5 ton → sfalcio bordi stradali e potatura meccanica
- Fresaceppi FR90: 2-8 ton → rimozione ceppi fino a Ø 40 cm

## NOLEGGIO ESCAVATORI (prezzi indicativi IVA esclusa)
Mini 14q: €95/giorno · €420/settimana · €1.350/mese
Mini 19q: €115/giorno · €510/settimana · €1.600/mese
Mini 28q: €140/giorno · €620/settimana · €1.950/mese
Mini 55q: €175/giorno · €780/settimana · €2.450/mese
Midi 70q: €210/giorno · €950/settimana · €3.000/mese
Attrezzature extra: +€40-65/giorno

## BANDI INCENTIVI 2026
- ISI INAIL: fino al 65% (80% giovani agricoltori) per attrezzature sicurezza
- Credito imposta 4.0: 40-45% su attrezzature EU interconnesse (Legge Bilancio 2026)
- ISMEA Innovazione: 40-80% su macchine forestali innovative

## ISTRUZIONI
- Rispondi sempre in italiano
- Sii conciso: max 5-6 righe per risposta
- Non inventare prezzi per le attrezzature (solo noleggio ha prezzi sopra)
- Se chiede un dealer e non hai la location, chiedi comune/provincia
- Proponi sempre un'azione concreta (WhatsApp, telefono, contatto email)
- Linguaggio professionale ma diretto, da esperto del settore`;
}
```

---

## `src/lib/claude.js`

```js
// DEMO ONLY — in produzione le chiamate passano per un API proxy server
// Mai esporre API key in frontend in produzione

const ANTHROPIC_BASE = 'https://api.anthropic.com/v1';

export async function chatWithClaude({ messages, systemPrompt, apiKey, onChunk }) {
  const response = await fetch(`${ANTHROPIC_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-allow-browser': 'true',   // ← richiesto per chiamate browser dirette
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  // Leggi SSE stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        const text = parsed.delta?.text || '';
        if (text) {
          fullText += text;
          onChunk?.(text, fullText);
        }
      } catch {}
    }
  }
  return fullText;
}

// Micro-call Haiku per classificare rapidamente il lead
export async function classifyLead(question, apiKey) {
  const response = await fetch(`${ANTHROPIC_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 100,
      system: `Classifica questa domanda su attrezzature forestali OMEF.
Rispondi SOLO con JSON valido, nessun testo aggiuntivo:
{"product": "<nome prodotto o 'Generico'>", "category": "<cesoie|trince|legna|pinze|potatura|terreno|noleggio|usato|info>", "score": <1-10 urgenza acquisto>}`,
      messages: [{ role: 'user', content: question }],
    }),
  });
  if (!response.ok) return { product: 'Generico', category: 'info', score: 5 };
  const data = await response.json();
  try {
    const text = data.content?.[0]?.text || '{}';
    return JSON.parse(text);
  } catch {
    return { product: 'Generico', category: 'info', score: 5 };
  }
}
```

---

## `src/components/ApiKeyModal.jsx`

Modal che appare al primo accesso. Salva la key in `sessionStorage` (non localStorage — per sicurezza si cancella alla chiusura del browser).

```jsx
// Props: isOpen, onSubmit(key)
// Mostra:
// - Campo input password per API key
// - Link a console.anthropic.com per ottenerla
// - Warning: "Demo only — non usare in produzione"
// - Pulsante conferma
// La key viene validata facendo una micro-chiamata di test (es. models list)
```

---

## `src/pages/ChatPage.jsx` — Specifiche UI

```
Layout: due colonne su desktop, una su mobile

COLONNA SINISTRA (flex-1):
  - Header: avatar 🌲 + "Assistente OMEF" + dot verde pulsante "Online"
  - Quick chips cliccabili:
      "🔍 Verifica stock"       → invia "Verifica disponibilità cesoie forestali"
      "📍 Trova concessionario" → attiva geoloc poi invia "Trovami il dealer più vicino"
      "⚙️ Consiglio tecnico"    → invia "Cesoia giusta per escavatore 5 tonnellate?"
      "🚜 Noleggio"             → invia "Prezzi noleggio escavatore"
      "💶 Bandi 2026"           → invia "Quali incentivi ci sono nel 2026 per le attrezzature?"
  - Chat area (scrollabile, h-96 md:h-[500px])
      Messaggi bot: avatar 🌲 + bubble sfondo omef-light
      Messaggi utente: bubble sfondo omef-forest testo bianco
      Typing indicator: 3 dot che saltano
      Dealer cards inline: quando risponde con concessionari (vedi DealerCard)
  - Input area:
      Textarea auto-resize (min 1 riga, max 4)
      Icona 📍 per richiedere geolocalizzazione
      Bottone invia (disabilitato durante loading)

COLONNA DESTRA (w-80, sticky top-4):
  - Card "Stock in evidenza" → mostra 3 SKU con status più critico (amber/red prima)
  - Card "Lead questa sessione" → counter animato
  - Card "Concessionario più vicino" → appare dopo geoloc
```

**Comportamento chat:**
1. Utente invia messaggio
2. Mostra typing indicator
3. Chiama `classifyLead` con Haiku (in parallelo, non blocca UI)
4. Chiama `chatWithClaude` con Sonnet in streaming → aggiorna il bubble in tempo reale
5. Quando Sonnet finisce: salva lead in localStorage con dati da Haiku
6. Se la risposta contiene dealer (rilevato da keyword "concessionario" nella domanda) → appende DealerCards

---

## `src/pages/StockPage.jsx` — Specifiche UI

```
Header: "📦 Stock Magazzino — OMEF GROUP" + ultimo aggiornamento simulato

Filtri (pill buttons):
  Tutti | Cesoie | Trince | Legna | Pinze | Potatura | Terreno | Usato

Griglia prodotti (3 col desktop, 2 tablet, 1 mobile):
  Ogni card:
    - Nome prodotto (bold)
    - ID modello (muted)
    - StatusBadge: verde "Disponibile" / ambra "Ultimi pezzi" / rosso "Su ordinazione"
    - Quantità: "8 pz. a magazzino" o "Su richiesta"
    - Peso compatibile: "Escavatore: 1-5 ton"
    - Bottone "Chiedi disponibilità" → apre chat con messaggio pre-compilato

Stats bar in fondo:
  Disponibili: 7 · Ultimi pezzi: 3 · Su ordinazione: 1
```

---

## `src/pages/DealerPage.jsx` — Specifiche UI

```
Sezione "Trova il dealer più vicino":
  - Bottone "📍 Usa la mia posizione" → chiama getLocation()
  - Input testo "Oppure scrivi comune/provincia" (futuro: geocoding API)
  - Loading state durante geoloc

Risultati (dopo geoloc):
  Lista verticale dei 3 dealer più vicini, ordinati per km:
    - Numero posizione (1, 2, 3)
    - Nome dealer + città + provincia
    - Distanza in km (badge colorato: verde <50km, ambra 50-150km, rosso >150km)
    - Tel + email
    - "Chiama ora" button (tel:) + "WhatsApp" link

Griglia completa tutti i dealer (sotto il fold):
  "Tutti i 15 concessionari OMEF in Italia"
  Tabella: Dealer | Città | Provincia | Telefono | Distanza (se geoloc attiva)
```

---

## `src/pages/SeasonPage.jsx` — Specifiche UI

```
Header: "📅 Stagionalità & Piano Produzione"
Sottotitolo: "Domanda stimata per categoria prodotto · Anticipa la produzione di 8-12 settimane"

Grafico principale (Recharts LineChart o AreaChart):
  - X axis: mesi Gen-Dic
  - Y axis: 0-10 (domanda)
  - 4 linee colorate: Cesoie, Trince, Spaccalegna, Noleggio
  - Rettangolo evidenziato sul mese corrente
  - Legend in basso
  - Tooltip custom: mostra tutti i valori al hover

Sezione "Cosa produrre adesso":
  Mese corrente: <nome mese>
  Cards per ogni categoria (se domanda >= 7 nelle prossime 8-12 settimane):
    - Nome categoria
    - Domanda attuale e picco previsto
    - "⚡ Avvia produzione ora per coprire il picco di <mese picco>"

Sezione "Piano trimestrali":
  Tabella: Trimestre | Cesoie | Trince | Spaccalegna | Noleggio
  Calcola media dei 3 mesi per ciascun trimestre
```

---

## `src/pages/LeadsPage.jsx` — Specifiche UI

```
Header: "📊 Lead Tracker — Sessione corrente"
Stats row: Totale | Avg Score | Categoria più richiesta | Ultima richiesta

Grafici (Recharts):
  BarChart: Lead per categoria (cesoie, trince, legna, pinze, info, noleggio)
  LineChart: Lead per data (ultimi 7 giorni — mostra solo date con dati)

Tabella lead (più recenti in cima):
  Colonne: # | Prodotto | Domanda | Categoria | Location | Score | Data/Ora
  Score: colored badge (1-3 rosso, 4-6 ambra, 7-10 verde)
  
Bottone "🗑 Cancella lead sessione" (con confirm dialog)

Empty state quando non ci sono lead:
  Illustrazione minimale + "Nessun lead ancora. Inizia una conversazione nella chat."
```

---

## `src/App.jsx` — Routing

```jsx
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
// HashRouter perché GitHub Pages non supporta history API

// Routes:
// /        → ChatPage (default)
// /stock   → StockPage
// /dealers → DealerPage
// /season  → SeasonPage
// /leads   → LeadsPage

// ApiKeyModal appare sopra tutto se !sessionStorage.getItem('omef_api_key')
```

---

## GitHub Actions — `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/omef-ai-demo/',   // ← CAMBIA con il nome esatto del tuo repo GitHub
})
```

---

## `index.html` — meta tags

```html
<meta name="description" content="OMEF GROUP — Demo sistema AI: stock checker, dealer finder, chat assistente forestale">
<meta property="og:title" content="OMEF AI Demo">
<meta property="og:description" content="Assistente AI per attrezzature forestali: stock, concessionari, stagionalità">
```

---

## Note per Claude Code

**Ordine di sviluppo consigliato:**
1. Setup progetto Vite + Tailwind + routing
2. Dati mock (`/data/`) + lib utilities (`/lib/`)
3. `ApiKeyModal` — blocca tutto senza key valida
4. `ChatPage` — il pezzo più importante, con streaming
5. `StockPage` — più semplice, solo display dati
6. `DealerPage` — geoloc + haversine
7. `SeasonPage` — Recharts + logica "cosa produrre adesso"
8. `LeadsPage` — Recharts + tabella localStorage
9. GitHub Actions deploy
10. Test su mobile (Tailwind responsive)

**Cose da non fare:**
- Non hardcodare l'API key nel codice (l'utente la inserisce nel modal)
- Non usare react-leaflet per le mappe (troppo pesante per demo statica — usa lista testuale dealer)
- Non aggiungere backend/server — tutto statico
- Non usare Fugu (non disponibile EU) — solo Claude Sonnet + Haiku

**Warning CORS:** Le chiamate dirette a `api.anthropic.com` dal browser richiedono l'header `anthropic-dangerous-allow-browser: true`. Questo è intenzionale per la demo. Documentarlo nel README con un warning visibile.

**README.md deve includere:**
- Screenshot della demo
- Istruzioni: "Ottieni una API key su console.anthropic.com → inseriscila nel modal"
- Warning: "Demo only — non usare la propria API key in produzione su siti pubblici"
- Link alla demo live su GitHub Pages
- Spiegazione architettura backend per produzione (Node.js proxy)

---

## Checklist finale prima del deploy

- [ ] `vite.config.js` ha il `base` corretto con il nome del repo
- [ ] GitHub Pages abilitato nelle impostazioni del repo (Settings → Pages → Source: GitHub Actions)
- [ ] `ApiKeyModal` funziona e la key viene salvata in `sessionStorage`
- [ ] Chat streaming funziona senza bloccarsi
- [ ] Geolocalizzazione richiede permesso correttamente
- [ ] `localStorage` salva e recupera i lead
- [ ] Build `npm run build` passa senza errori
- [ ] Deploy via `git push main` triggera GitHub Actions
- [ ] La demo funziona su mobile (testare con DevTools)
