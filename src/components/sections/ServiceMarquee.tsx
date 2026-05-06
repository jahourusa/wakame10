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
    <div className="py-7 bg-dark-2 border-y border-white/5 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[...services, ...services].map((s, i) => (
          <div key={i} className="flex items-center mx-3">
            <div className="flex items-center gap-3 mx-12">
              <span className="material-symbols-outlined text-gold text-[24px]">
                {s.icon}
              </span>
              <span className="text-white/60 text-[14px] font-medium">{s.label}</span>
            </div>
            <span className="text-gold/20 text-lg">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
