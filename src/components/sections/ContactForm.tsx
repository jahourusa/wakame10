"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BrushStroke } from "@/components/menu-experience/LineArt";

const CONTACT_EMAIL = "contact@wakame.ma";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const phone = String(fd.get("phone") ?? "");
    const subject = String(fd.get("subject") ?? "Message via wakame.ma");
    const message = String(fd.get("message") ?? "");

    const body = `Nom: ${name}%0D%0AEmail: ${email}%0D%0ATelephone: ${phone}%0D%0A%0D%0A${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative space-y-6 rounded-2xl border border-gold/25 bg-washi-2/60 p-10 text-center backdrop-blur-md"
      >
        <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-gold/40" />
        <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-gold/40" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-gold/40" />
        <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-gold/40" />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-washi text-gold-dim">
          <span className="material-symbols-outlined text-[32px]">check_circle</span>
        </div>
        <h3 className="font-display text-2xl text-ink">Message prepare</h3>
        <BrushStroke className="mx-auto h-5 w-40 text-gold" />
        <p className="text-sm font-light leading-relaxed text-ink-soft">
          Votre client mail s&apos;ouvre pour envoyer le message. Sinon, ecrivez-nous
          directement a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-gold-dim">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative space-y-5 rounded-2xl border border-gold/20 bg-washi-2/60 p-8 backdrop-blur-md md:p-10"
    >
      <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-gold/40" />
      <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-gold/40" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-gold/40" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-gold/40" />

      <div>
        <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-dim">
          Ecrivez-nous
        </span>
        <h3 className="mt-3 font-display text-2xl text-ink md:text-3xl">
          Un mot, une reservation, une envie
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Nom complet" name="name" required />
        <Field label="Telephone" name="phone" type="tel" />
        <Field label="Email" name="email" type="email" required className="md:col-span-2" />
        <Field label="Sujet" name="subject" className="md:col-span-2" />
      </div>

      <label className="block">
        <span className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">
          Message
        </span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Dites-nous tout..."
          className="mt-1.5 w-full rounded-lg border border-ink/15 bg-washi px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/25"
        />
      </label>

      <button
        type="submit"
        className="gold-breathe flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-bright px-7 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-kuro transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        Envoyer le message
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>

      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-ink-soft/50">
        ou par telephone : 05 37 XX XX XX
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  className,
  ...rest
}: { label: string; name: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">
        {label}
      </span>
      <input
        name={name}
        className="mt-1.5 w-full rounded-lg border border-ink/15 bg-washi px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/25"
        {...rest}
      />
    </label>
  );
}
