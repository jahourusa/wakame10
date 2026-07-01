const services = [
  { icon: "speed", label: "Livraison Rapide" },
  { icon: "payments", label: "Paiement a la Livraison" },
  { icon: "eco", label: "Produits 100% Frais" },
  { icon: "verified", label: "Qualite Garantie" },
  { icon: "schedule", label: "Ouvert 7j/7" },
  { icon: "workspace_premium", label: "Emballage Premium" },
];

export function ServiceMarquee() {
  return (
    <div className="washi-surface relative overflow-hidden py-4">
      <div className="gold-thread absolute inset-x-0 top-0" />
      <div className="gold-thread absolute inset-x-0 bottom-0" />
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {[...services, ...services].map((s, i) => (
          <div key={i} className="flex items-center">
            <div className="mx-10 flex items-center gap-3">
              <span className="material-symbols-outlined text-gold-dim text-[20px]">
                {s.icon}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink">
                {s.label}
              </span>
            </div>
            <span className="text-gold-dim/50 text-xs">&bull;</span>
          </div>
        ))}
      </div>
    </div>
  );
}
