import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="pt-20 pb-8 px-6 md:px-12 bg-dark-2 border-t border-white/[0.03]">
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/logo.png"
              alt="Wakame"
              width={110}
              height={36}
              className="w-[110px] h-auto object-contain mb-5"
            />
            <p className="text-white/30 font-light leading-relaxed text-xs max-w-[220px]">
              L&apos;excellence de la gastronomie japonaise livree a votre porte. Une
              quete permanente de perfection.
            </p>
          </div>
          <div className="space-y-4">
            <h6 className="text-gold font-semibold uppercase tracking-[0.2em] text-[10px]">
              Villes
            </h6>
            <ul className="space-y-2.5 text-white/35 text-xs">
              {["Casablanca", "Rabat", "Kenitra"].map((city) => (
                <li key={city}>
                  <Link
                    href="#"
                    className="hover:text-gold transition-colors duration-300"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h6 className="text-gold font-semibold uppercase tracking-[0.2em] text-[10px]">
              Informations
            </h6>
            <ul className="space-y-2.5 text-white/35 text-xs">
              {[
                ["Newsletter", "#"],
                ["Mentions Legales", "#"],
                ["Confidentialite", "#"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-gold transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h6 className="text-gold font-semibold uppercase tracking-[0.2em] text-[10px]">
              Nous Suivre
            </h6>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/wakame_official/?hl=fr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suivez-nous sur Instagram"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-gold hover:text-dark hover:border-gold transition-all duration-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/20 text-[9px] uppercase tracking-[0.2em]">
            &copy; 2024 Wakame Sushi. L&apos;art de l&apos;Omakase.
          </p>
          <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] text-white/20">
            <span>Tous droits reserves</span>
            <span>Developpe par Artisans Digital</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
