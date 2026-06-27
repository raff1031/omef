// Pre-scripted demo responses — no API key needed
const DEMO_RESPONSES = [
  {
    keywords: ['cesoia', 'cesoie', 'stock', 'disponib', 'magazzino'],
    reply: `Ecco la disponibilità attuale delle cesoie forestali OMEF:

• **BI100** (1-5 ton) — ✅ Disponibile, 8 pz. in magazzino
• **BI200** (3-10 ton) — ⚠️ Ultimi 3 pezzi disponibili
• **BI300** (5-20 ton) — 🔴 Su ordinazione (tempi ~4 settimane)

Per la BI200 ti consiglio di confermare subito — con 3 pezzi rimasti si esaurisce in fretta.
Vuoi che ti metta in contatto con il concessionario più vicino? 📞`,
  },
  {
    keywords: ['dealer', 'concessionario', 'vicino', 'rivenditore', 'dove'],
    reply: `Per trovare il concessionario OMEF più vicino a te, attiva la geolocalizzazione con il pulsante 📍 in basso.

I nostri 15 dealer autorizzati coprono tutta Italia, dal Piemonte alla Sicilia.

🏆 **I più attivi nel nord Italia:**
• AgroMeccanica Piemonte — Asti (AT) · 0141 456 789
• Verde & Bosco Srl — Torino (TO) · 011 345 678
• Forestale Service Nord — Genova (GE) · 010 234 567

Clicca 📍 per trovare quello più vicino a te con la distanza esatta in km.`,
  },
  {
    keywords: ['5 ton', '5ton', 'cinque ton', 'escavatore', 'quale cesoia', 'consiglio', 'tecnico', 'scegliere'],
    reply: `Per un escavatore da 5 tonnellate la scelta ideale è la **Cesoia BI200**.

✅ **BI200** — compatibile 3-10 ton → perfetta per il tuo escavatore
• Diametro taglio fino a Ø 50 cm
• Attacco rapido universale
• 3 pezzi disponibili in magazzino

La BI100 sarebbe sottodimensionata (max 5 ton, poco margine), la BI300 sovradimensionata.

Per preventivo e spedizione: WhatsApp **+39 349 855 6830** o chiama **0143 19 79 459** ✉️`,
  },
  {
    keywords: ['noleggio', 'affitto', 'escavatore', 'prezzo', 'costo', 'tariffa'],
    reply: `Prezzi noleggio escavatori OMEF (IVA esclusa):

| Modello | Giorno | Settimana | Mese |
|---------|--------|-----------|------|
| Mini 14q | €95 | €420 | €1.350 |
| Mini 19q | €115 | €510 | €1.600 |
| Mini 28q | €140 | €620 | €1.950 |
| Mini 55q | €175 | €780 | €2.450 |
| Midi 70q | €210 | €950 | €3.000 |

Le attrezzature forestali (cesoie, trince, pinze) si aggiungono a **+€40-65/giorno**.

Per preventivo personalizzato: 📱 WhatsApp **+39 349 855 6830**`,
  },
  {
    keywords: ['bandi', 'incentiv', '2026', 'agevolaz', 'contribut', 'finanziament'],
    reply: `Incentivi 2026 per attrezzature forestali — panoramica:

💰 **ISI INAIL** — fino al **65%** di contributo a fondo perduto
→ Sale all'**80%** per giovani agricoltori under 40
→ Scadenza: bando primavera 2026

📊 **Credito d'imposta 4.0** — **40-45%** su attrezzature EU interconnesse
→ Legge di Bilancio 2026, accessibile tutto l'anno

🌳 **ISMEA Innovazione** — **40-80%** per macchine forestali innovative
→ Ideale per cesoie e trince OMEF che rientrano nei parametri

Per capire quale bando fa per te, contatta il nostro ufficio commerciale: **0143 19 79 459** — ti guidiamo nella pratica. 🤝`,
  },
  {
    keywords: ['trincia', 'trinciatura', 'sfalcio', 'erba', 'arbusti'],
    reply: `Per la trinciatura OMEF propone la **Trincia a Mazze TE1**:

✅ **TE1** — compatibile 1-8 ton
• Trinciatura erba, arbusti e piante fino a Ø 20 cm
• Ideale per sfalcio bordi stradali e pulizia boschi
• 5 pezzi disponibili in magazzino

Per sfalcio leggero su piccoli escavatori (1-5 ton) valuta anche la **Barra Falciante BF1200** — più precisa sui bordi stradali.

Vuoi un confronto tecnico tra i due modelli? 🌿`,
  },
  {
    keywords: ['spaccalegna', 'legna', 'tronchi', 'divisione'],
    reply: `Per la divisione dei tronchi OMEF ha lo **Spaccalegna SPV1**:

✅ **SPV1** — compatibile 1-5 ton
• Divisione idraulica tronchi — veloce e potente
• Perfetto per piccoli e medi escavatori
• 12 pezzi disponibili — ottima disponibilità ✅

Abbinato alla **Pinza per Legna HD** (2-8 ton) per movimentazione e carico diventa un sistema completo per la gestione del legname.

Vuoi informazioni sui prezzi? Contatta il dealer più vicino! 🪵`,
  },
];

const DEFAULT_RESPONSE = `Ciao! Sono l'assistente AI di OMEF GROUP in modalità demo.

Posso aiutarti con:
• 📦 **Disponibilità prodotti** — cesoie, trince, spaccalegna, pinze
• 📍 **Trovare il concessionario** più vicino a te
• ⚙️ **Consigli tecnici** — quale attrezzo per il tuo escavatore
• 🚜 **Prezzi noleggio** escavatori
• 💶 **Incentivi 2026** — ISI INAIL, credito d'imposta, ISMEA

Prova uno dei tasti rapidi qui sopra oppure scrivi la tua domanda! 🌲

*Modalità demo — inserisci una API key Anthropic per l'AI completa.*`;

function findResponse(text) {
  const lower = text.toLowerCase();
  for (const { keywords, reply } of DEMO_RESPONSES) {
    if (keywords.some(k => lower.includes(k))) return reply;
  }
  return DEFAULT_RESPONSE;
}

export async function chatWithClaude({ messages, onChunk }) {
  const lastMsg = messages.filter(m => m.role === 'user').at(-1)?.content || '';
  const fullText = findResponse(lastMsg);

  // Simulate streaming char by char with variable speed
  let accumulated = '';
  for (let i = 0; i < fullText.length; i++) {
    accumulated += fullText[i];
    onChunk?.(fullText[i], accumulated);
    // Faster for spaces, slower for punctuation
    const delay = /[.!?]/.test(fullText[i]) ? 40 : fullText[i] === ' ' ? 8 : 15;
    await new Promise(r => setTimeout(r, delay));
  }
  return fullText;
}

export async function classifyLead(question) {
  const lower = question.toLowerCase();
  if (lower.includes('cesoia') || lower.includes('taglio')) return { product: 'Cesoia BI200', category: 'cesoie', score: 8 };
  if (lower.includes('trincia') || lower.includes('sfalcio')) return { product: 'Trincia TE1', category: 'trince', score: 7 };
  if (lower.includes('legna') || lower.includes('spaccalegna')) return { product: 'Spaccalegna SPV1', category: 'legna', score: 6 };
  if (lower.includes('noleggio') || lower.includes('affitto')) return { product: 'Noleggio Escavatore', category: 'noleggio', score: 5 };
  if (lower.includes('bandi') || lower.includes('incentiv')) return { product: 'Incentivi 2026', category: 'info', score: 4 };
  if (lower.includes('dealer') || lower.includes('concessionario')) return { product: 'Richiesta Dealer', category: 'info', score: 6 };
  return { product: 'Richiesta generica', category: 'info', score: 4 };
}
