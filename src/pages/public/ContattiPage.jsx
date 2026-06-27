import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';

const INITIAL_FORM = {
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
  azienda: '',
  oggetto: '',
  messaggio: '',
};

export default function ContattiPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = 'Campo obbligatorio';
    if (!form.cognome.trim()) newErrors.cognome = 'Campo obbligatorio';
    if (!form.email.trim()) {
      newErrors.email = 'Campo obbligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Indirizzo email non valido';
    }
    if (!form.oggetto) newErrors.oggetto = 'Seleziona un oggetto';
    if (!form.messaggio.trim()) newErrors.messaggio = 'Campo obbligatorio';
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
    setForm(INITIAL_FORM);
    setErrors({});
  }

  function handleReset() {
    setSubmitted(false);
  }

  const inputBase =
    'w-full rounded-lg border border-gray-200 bg-omef-paper px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-omef-forest focus:outline-none focus:ring-1 focus:ring-omef-forest transition';

  const errorClass = 'border-red-400 focus:border-red-500 focus:ring-red-400';

  return (
    <div className="min-h-screen bg-omef-paper">
      {/* PAGE HERO */}
      <section className="bg-omef-forest text-white py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Contattaci</h1>
          <p className="text-omef-sage text-lg max-w-xl mx-auto">
            Siamo disponibili per preventivi, assistenza tecnica e qualsiasi informazione sui
            nostri prodotti. Rispondiamo sempre entro il giorno lavorativo successivo.
          </p>
        </div>
      </section>

      {/* TWO COLUMN LAYOUT */}
      <section className="bg-omef-paper py-16">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT: CONTACT FORM */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-omef-forest mb-6">Inviaci un messaggio</h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <CheckCircle className="text-omef-forest w-12 h-12" strokeWidth={1.5} />
                <p className="text-lg font-semibold text-omef-forest">Messaggio inviato!</p>
                <p className="text-sm text-omef-muted">
                  Grazie per averci contattato. Ti risponderemo entro 24 ore lavorative.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 text-sm text-omef-forest underline underline-offset-2 hover:text-omef-bark transition"
                >
                  Invia un altro messaggio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Nome / Cognome */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Nome <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      placeholder="Mario"
                      className={`${inputBase} ${errors.nome ? errorClass : ''}`}
                    />
                    {errors.nome && (
                      <p className="text-xs text-red-500 mt-1">{errors.nome}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cognome <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cognome"
                      value={form.cognome}
                      onChange={handleChange}
                      placeholder="Rossi"
                      className={`${inputBase} ${errors.cognome ? errorClass : ''}`}
                    />
                    {errors.cognome && (
                      <p className="text-xs text-red-500 mt-1">{errors.cognome}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="mario.rossi@esempio.it"
                    className={`${inputBase} ${errors.email ? errorClass : ''}`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Telefono */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="+39 000 000 0000"
                    className={inputBase}
                  />
                </div>

                {/* Azienda */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Azienda
                  </label>
                  <input
                    type="text"
                    name="azienda"
                    value={form.azienda}
                    onChange={handleChange}
                    placeholder="Nome azienda (opzionale)"
                    className={inputBase}
                  />
                </div>

                {/* Oggetto */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Oggetto <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="oggetto"
                    value={form.oggetto}
                    onChange={handleChange}
                    className={`${inputBase} ${errors.oggetto ? errorClass : ''}`}
                  >
                    <option value="">Seleziona un oggetto...</option>
                    <option value="preventivo">Richiesta preventivo</option>
                    <option value="assistenza">Assistenza tecnica</option>
                    <option value="concessionario">Diventare concessionario</option>
                    <option value="altro">Altro</option>
                  </select>
                  {errors.oggetto && (
                    <p className="text-xs text-red-500 mt-1">{errors.oggetto}</p>
                  )}
                </div>

                {/* Messaggio */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Messaggio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="messaggio"
                    value={form.messaggio}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Descrivi la tua richiesta..."
                    className={`${inputBase} resize-none ${errors.messaggio ? errorClass : ''}`}
                  />
                  {errors.messaggio && (
                    <p className="text-xs text-red-500 mt-1">{errors.messaggio}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-omef-forest text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-omef-bark transition w-full justify-center"
                  >
                    <Send className="w-4 h-4" />
                    Invia messaggio →
                  </button>
                  <p className="text-xs text-omef-muted text-center mt-3">
                    Risponderemo entro 24 ore lavorative
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT: CONTACT INFO CARDS */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-omef-forest mb-2">Informazioni di contatto</h2>

            <ContactCard icon={<MapPin className="w-5 h-5 text-omef-forest" />} label="Sede">
              Via Bassa dei Gentilini 100<br />
              15060 Basaluzzo (AL), Italia
            </ContactCard>

            <ContactCard icon={<Phone className="w-5 h-5 text-omef-forest" />} label="Telefono">
              <a
                href="tel:+390143197945"
                className="text-omef-forest hover:text-omef-bark transition font-medium"
              >
                0143 19 79 459
              </a>
            </ContactCard>

            <ContactCard icon={<MessageCircle className="w-5 h-5 text-omef-forest" />} label="WhatsApp">
              <a
                href="https://wa.me/393498556830"
                target="_blank"
                rel="noopener noreferrer"
                className="text-omef-forest hover:text-omef-bark transition font-medium"
              >
                +39 349 855 6830
              </a>
            </ContactCard>

            <ContactCard icon={<Mail className="w-5 h-5 text-omef-forest" />} label="Email">
              <a
                href="mailto:info@omefgroup.com"
                className="text-omef-forest hover:text-omef-bark transition font-medium"
              >
                info@omefgroup.com
              </a>
            </ContactCard>

            <ContactCard icon={<Clock className="w-5 h-5 text-omef-forest" />} label="Orari">
              Lun&ndash;Ven 8:00&ndash;18:00
            </ContactCard>

            <div className="mt-2">
              <Link
                to="/concessionari"
                className="inline-flex items-center gap-1 text-sm font-semibold text-omef-forest hover:text-omef-bark border border-omef-forest hover:border-omef-bark rounded-lg px-5 py-2.5 transition"
              >
                Trova il concessionario più vicino →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MAP PLACEHOLDER */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-omef-light rounded-xl p-12 flex flex-col items-center justify-center text-center gap-3 min-h-[220px]">
          <MapPin className="w-10 h-10 text-omef-forest" strokeWidth={1.5} />
          <p className="text-omef-forest font-semibold text-lg">Basaluzzo (AL)</p>
          <p className="text-omef-muted text-sm">Via Bassa dei Gentilini 100, 15060 Basaluzzo (AL), Italia</p>
          <a
            href="https://maps.google.com?q=Via+Bassa+dei+Gentilini+100+Basaluzzo+AL"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-omef-forest underline underline-offset-2 hover:text-omef-bark transition"
          >
            <MapPin className="w-4 h-4" />
            Apri in Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}

function ContactCard({ icon, label, children }) {
  return (
    <div className="bg-white rounded-xl px-5 py-4 shadow-sm flex items-start gap-4">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-semibold text-omef-muted uppercase tracking-wide mb-0.5">{label}</p>
        <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
