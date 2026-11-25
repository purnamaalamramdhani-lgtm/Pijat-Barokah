import { useState } from 'react';
import { formatIDR, SERVICES } from '../data/spaData';
import { ServiceCategory, ServiceItem } from '../types/booking';
import { ResilientImage } from './ResilientImage';

interface ServicesSectionProps {
  selectedServiceId: string;
  onSelectService: (service: ServiceItem) => void;
}

const CATEGORIES: { id: ServiceCategory; label: string }[] = [
  { id: 'semua', label: 'Semua Layanan' },
  { id: 'fullbody', label: 'Pijat Fullbody' },
  { id: 'tradisional', label: 'Pijat + Kerokan' },
  { id: 'perawatan', label: 'Pijat + Scrub' },
];

export function ServicesSection({ selectedServiceId, onSelectService }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('semua');

  const filteredServices =
    activeCategory === 'semua'
      ? SERVICES
      : SERVICES.filter((service) => service.category === activeCategory);

  return (
    <section id="layanan" className="py-14 lg:py-20 border-t border-[#E3E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium text-[#5A625D] mb-2">
              Layanan Massage · Pijat Barokah Serang
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1D1B] text-balance">
              Pilihan Layanan &amp; Daftar Tarif Resmi
            </h2>
          </div>

          {/* Interactive Filter Segmented Control */}
          <div
            role="tablist"
            aria-label="Filter kategori layanan"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#ECEEEB] rounded-lg self-start lg:self-auto"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] ${
                    isActive
                      ? 'bg-white text-[#1A1D1B] shadow-xs'
                      : 'text-[#5A625D] hover:text-[#1A1D1B]'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Uniform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredServices.map((service) => {
            const isSelected = selectedServiceId === service.id;
            const firstDuration = service.availableDurations[0];
            const startingPrice = service.prices[firstDuration] || 0;

            return (
              <article
                key={service.id}
                className={`flex flex-col bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? 'border-[#1B4332] ring-1 ring-[#1B4332]'
                    : 'border-[#E3E6E2] hover:border-[#C7CEC9]'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#EDF3EF]">
                  <ResilientImage
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    fallbackLabel={service.name}
                  />
                </div>

                <div className="flex flex-col flex-1 p-6">
                  {/* Unboxed clean metadata */}
                  <div className="flex items-center gap-2 text-xs text-[#5A625D] mb-2">
                    <span>{service.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{service.pressure}</span>
                  </div>

                  <h3 className="font-display text-2xl font-semibold text-[#1A1D1B] leading-snug mb-2">
                    {service.name}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#5A625D] mb-5">
                    {service.shortDescription}
                  </p>

                  {/* Transparent Price Breakdown per Duration */}
                  <div className="border-t border-[#E3E6E2]/80 pt-4 mb-6 space-y-2">
                    {service.availableDurations.map((mins) => (
                      <div
                        key={mins}
                        className="flex items-center justify-between text-sm text-[#5A625D]"
                      >
                        <span>Durasi {mins} Menit</span>
                        <span className="font-semibold text-[#1A1D1B] tabular-nums">
                          {formatIDR(service.prices[mins] || 0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-[#E3E6E2] flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#5A625D]">Mulai dari ({firstDuration} menit)</p>
                      <p className="text-base font-semibold text-[#1A1D1B] tabular-nums">
                        {formatIDR(startingPrice)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectService(service)}
                      className={`px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] ${
                        isSelected
                          ? 'bg-[#1B4332] text-white'
                          : 'bg-[#EDF3EF] text-[#1B4332] hover:bg-[#1B4332] hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Terpilih · Pesan' : 'Pilih Layanan'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
