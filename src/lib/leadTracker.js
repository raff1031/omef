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
  const avgScore = leads.length
    ? (leads.reduce((s, l) => s + (l.score || 5), 0) / leads.length).toFixed(1)
    : 0;
  return { byCategory, byDate, avgScore, total: leads.length };
}
