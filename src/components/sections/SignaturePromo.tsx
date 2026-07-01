import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { IMG } from "@/lib/constants/media";

export function SignaturePromo() {
  return (
    <section className="theater-surface relative overflow-hidden">
      <div className="gold-thread absolute left-1/2 top-0 w-1/2 -translate-x-1/2" />

      <Reveal className="mx-auto max-w-7xl px-8 pb-8 pt-14 sm:px-16">
        <span className="text-[10px] font-medium uppercase tracking-[0.45em] text-gold-bright/80">
          Exclusivite
        </span>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-12 gap-y-3">
          <h3 className="font-display text-3xl leading-tight text-washi sm:text-5xl">
            Decouvrez nos creations signature
          </h3>
          <p className="max-w-md pb-1.5 text-sm font-light leading-relaxed text-washi/55">
            Des mariages audacieux de saveurs et de textures, imagines par nos chefs
            pour surprendre vos sens.
          </p>
        </div>
      </Reveal>

      <Reveal className="relative">
        <div className="relative aspect-[21/9] w-full sm:aspect-[21/8]">
          <Image
            src={IMG.fireShow}
            alt="Sushi fire show"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-kuro to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-kuro to-transparent" />
        </div>
      </Reveal>

      <div className="relative z-10 flex justify-center pb-16 pt-2">
        <Link
          href="/menu"
          className="gold-breathe rounded-lg bg-gradient-to-r from-gold to-gold-bright px-10 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-kuro transition-transform duration-300 hover:scale-[1.03]"
        >
          Explorer la Collection
        </Link>
      </div>
    </section>
  );
}
