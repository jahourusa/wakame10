"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { BrushStroke } from "@/components/menu-experience/LineArt";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  return (
    <Reveal className="relative mt-28 overflow-hidden rounded-2xl border border-gold/15 bg-kuro-2/80 p-10 backdrop-blur-xl md:p-16 lg:p-20">
      <span className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l border-t border-gold/40" />
      <span className="pointer-events-none absolute right-0 top-0 h-4 w-4 border-r border-t border-gold/40" />
      <span className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b border-l border-gold/40" />
      <span className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b border-r border-gold/40" />

      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/[0.06] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-xl space-y-8 text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-gold-bright/80">
          Newsletter
        </span>
        <h4 className="font-display text-3xl text-washi md:text-4xl">
          Restez informe des nouveautes
        </h4>
        <BrushStroke className="mx-auto h-5 w-44 text-gold" />
        <p className="font-cormorant text-lg italic text-gold-bright/80">
          l&apos;art de l&apos;omakase, en avant-premiere
        </p>
        <p className="text-sm font-light leading-relaxed text-washi/55">
          Inscrivez-vous pour recevoir nos invitations exclusives et decouvrir nos
          creations saisonnieres en avant-premiere.
        </p>
        <form
          className="flex flex-col gap-3 sm:flex-row"
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
            className="flex-1 rounded-lg border border-gold/20 bg-kuro/60 px-5 py-3.5 text-sm text-washi placeholder:text-washi/30 focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/30"
          />
          <button
            type="submit"
            className="gold-breathe whitespace-nowrap rounded-lg bg-gradient-to-r from-gold to-gold-bright px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-kuro transition-transform duration-300 hover:scale-[1.03]"
          >
            S&apos;inscrire
          </button>
        </form>
        {status === "ok" && (
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold-bright">
            Merci, vous etes inscrit.
          </p>
        )}
      </div>
    </Reveal>
  );
}
