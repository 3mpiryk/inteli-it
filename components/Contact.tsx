import React, { useState } from 'react';
import { Language } from '../types';
import { CONTACT_FORM } from '../constants';
import { Send } from 'lucide-react';

interface ContactProps {
  lang: Language;
}

const Contact: React.FC<ContactProps> = ({ lang }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/mgvgznka', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute right-0 bottom-0 w-1/2 h-full bg-blue-900/10 blur-3xl -z-10" />

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto glass-card rounded-2xl p-8 md:p-12 shadow-2xl border border-white/10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">
              {CONTACT_FORM.title[lang]}
            </h2>
            <p className="text-slate-300 text-lg">
              {CONTACT_FORM.subtitle[lang]}
            </p>
          </div>

          {/* ZWYKŁY FORMULARZ HTML -> POST DO FORMSPREE */}
          {/* Wysyłka przez fetch, aby nie przechodzić na stronę Formspree */}
          {status === 'success' && (
            <div
              role="status"
              aria-live="polite"
              className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 text-center md:col-span-2"
            >
              {lang === 'pl'
                ? 'Dziękujemy! Twoja wiadomość została wysłana.'
                : 'Thank you! Your message has been sent.'}
            </div>
          )}

          {status === 'error' && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100 text-center md:col-span-2"
            >
              {lang === 'pl'
                ? 'Wystąpił błąd przy wysyłce formularza. Spróbuj ponownie później.'
                : 'An error occurred while sending the form. Please try again later.'}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-2">
              <label htmlFor="contact-name" className="text-sm font-medium text-slate-400">
                {CONTACT_FORM.fields.name[lang]}
              </label>
              <input
                id="contact-name"
                required
                type="text"
                name="name"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-email" className="text-sm font-medium text-slate-400">
                {CONTACT_FORM.fields.email[lang]}
              </label>
              <input
                id="contact-email"
                required
                type="email"
                name="email"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-company" className="text-sm font-medium text-slate-400">
                {CONTACT_FORM.fields.company[lang]}
              </label>
              <input
                id="contact-company"
                required
                type="text"
                name="company"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-size" className="text-sm font-medium text-slate-400">
                {CONTACT_FORM.fields.size[lang]}
              </label>
              <select
                id="contact-size"
                name="size"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors appearance-none"
              >
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="200+">200+</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="contact-message" className="text-sm font-medium text-slate-400">
                {CONTACT_FORM.fields.problem[lang]}
              </label>
              <textarea
                id="contact-message"
                rows={4}
                name="message"
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="..."
              />
            </div>

            {/* Dodatkowe pola ukryte / meta */}
            <input
              type="hidden"
              name="_subject"
              value="Nowa wiadomość z formularza inteli-it.com"
            />
            <input
              type="hidden"
              name="form-name"
              value="inteli-it-website-contact"
            />
            <input type="hidden" name="_language" value={lang} />

            <div className="md:col-span-2 flex flex-col items-center gap-4 mt-4">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900/60 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                {status === 'submitting'
                  ? lang === 'pl'
                    ? 'Wysyłanie...'
                    : 'Sending...'
                  : CONTACT_FORM.fields.submit[lang]}
                <Send className="w-4 h-4" />
              </button>
              <p className="text-xs text-slate-500 text-center">
                {CONTACT_FORM.consent[lang]}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;