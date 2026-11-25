import { HYGIENE_STANDARDS } from '../data/spaData';

export function TherapistsAndTrustSection() {
  return (
    <section id="prosedur" className="py-14 lg:py-20 bg-white border-t border-[#E3E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs sm:text-sm font-medium text-[#5A625D] mb-2">
            Standar Pelayanan &amp; Kebersihan
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1D1B] text-balance">
            Protokol Pijat Profesional di Hotel, Rumah &amp; Kos Anda
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HYGIENE_STANDARDS.map((item) => (
            <div key={item.number} className="space-y-3">
              <p className="font-display text-2xl font-semibold text-[#1B4332] tabular-nums">
                {item.number}.
              </p>
              <h3 className="text-lg font-semibold text-[#1A1D1B] leading-snug">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#5A625D]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
