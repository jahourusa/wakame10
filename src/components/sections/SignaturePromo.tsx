import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { IMG } from "@/lib/constants/media";

export function SignaturePromo() {
  return (
    <Reveal as="section" className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
      <div className="relative h-72 lg:h-auto overflow-hidden">
        <Image
          src={IMG.fireShow}
          alt="Sushi fire show"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="bg-dark-3 flex items-center justify-center px-10 md:px-16 py-16">
        <div className="max-w-md space-y-8">
          <span className="text-gold text-[10px] uppercase tracking-[0.35em] font-semibold">
            Exclusivite
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl italic leading-[1.15]">
            Decouvrez Nos Creations Signature
          </h2>
          <p className="text-white/40 font-light text-sm leading-relaxed">
            Des mariages audacieux de saveurs et de textures, imagines par nos chefs pour
            surprendre vos sens.
          </p>
          <Link
            href="/menu"
            className="inline-block btn-gold px-10 py-4 rounded-lg font-bold text-[11px] uppercase tracking-[0.15em]"
          >
            Explorer la Collection
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
