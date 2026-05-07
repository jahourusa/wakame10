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
    <div
      className="py-7 overflow-hidden border-y border-dark/10"
      style={{
        background:
          "linear-gradient(135deg, #BF933A 0%, #F0BF61 50%, #BF933A 100%)",
      }}
    >
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[...services, ...services].map((s, i) => (
          <div key={i} className="flex items-center mx-3">
            <div className="flex items-center gap-3 mx-12">
              <span className="material-symbols-outlined text-dark text-[24px]">
                {s.icon}
              </span>
              <span className="text-dark text-[14px] font-semibold">
                {s.label}
              </span>
            </div>
            <span className="text-dark/30 text-lg">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
