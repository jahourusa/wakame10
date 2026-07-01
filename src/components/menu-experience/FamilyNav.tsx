"use client";

import type { Family } from "@/lib/menu/families";

export default function FamilyNav({
  families,
  activeFamily,
  onJump,
}: {
  families: Family[];
  activeFamily: string;
  onJump: (id: string) => void;
}) {
  const fam = families.find((f) => f.id === activeFamily) ?? families[0];
  if (!fam) return null;

  return (
    <nav className="sticky top-[76px] z-30 -mx-6 border-b border-ink/10 bg-washi/95 px-6 backdrop-blur-md sm:-mx-10 sm:top-[84px] sm:px-10">
      <div className="no-scrollbar flex gap-1 overflow-x-auto pt-3">
        {families.map((f) => (
          <button
            key={f.id}
            onClick={() => onJump(`fam-${f.id}`)}
            className={`relative cursor-pointer whitespace-nowrap px-4 pb-3 pt-1.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
              f.id === activeFamily ? "text-ink" : "text-ink-soft/70 hover:text-ink"
            }`}
          >
            {f.label}
            <span
              className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gold transition-transform duration-400 ${
                f.id === activeFamily ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto py-2.5">
        {families.flatMap((f) =>
          f.categories.map((c) => {
            const isActive = f.id === activeFamily;
            return (
              <button
                key={`${f.id}-${c.id}`}
                onClick={() => onJump(`cat-${c.id}`)}
                className={`cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[11px] font-light tracking-wide transition-all duration-300 hover:border-gold/60 hover:bg-gold/10 hover:text-ink ${
                  isActive
                    ? "border-gold/40 bg-gold/10 text-ink"
                    : "border-ink/10 text-ink-soft/70"
                }`}
              >
                {c.title}
              </button>
            );
          })
        )}
      </div>
    </nav>
  );
}
