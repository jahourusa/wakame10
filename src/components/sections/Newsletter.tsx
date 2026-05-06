"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  return (
    <Reveal className="bg-dark-3 rounded-2xl p-10 md:p-16 lg:p-20 relative overflow-hidden border border-white/[0.03] mt-28">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gold/[0.03] rounded-full blur-[100px]" />
      <div className="max-w-xl mx-auto text-center space-y-8 relative z-10">
        <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
          Newsletter
        </span>
        <h4 className="font-display text-3xl md:text-4xl">
          Restez Informe des Nouveautes
        </h4>
        <p className="text-white/40 font-light text-sm">
          Inscrivez-vous pour recevoir nos invitations exclusives et decouvrir nos
          creations saisonnieres en avant-premiere.
        </p>
        <form
          className="flex flex-col sm:flex-row gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setStatus("ok");
            setEmail("");
          }}
        >
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Votre adresse email"
            className="flex-1 bg-dark-4 border border-white/5 rounded-lg px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30 focus:ring-1 focus:ring-gold/20 transition-all"
          />
          <button
            type="submit"
            className="btn-gold px-8 py-3.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.15em] whitespace-nowrap"
          >
            S&apos;inscrire
          </button>
        </form>
        {status === "ok" && (
          <p className="text-gold text-xs uppercase tracking-[0.2em]">
            Merci, vous etes inscrit.
          </p>
        )}
      </div>
    </Reveal>
  );
}
