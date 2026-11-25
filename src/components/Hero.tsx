import { ArrowRight } from 'lucide-react';
import { BRAND_FULL_NAME, HERO_IMAGE } from '../data/spaData';
import { ResilientImage } from './ResilientImage';

interface HeroProps {
  onJumpToReservation: () => void;
}

export function Hero({ onJumpToReservation }: HeroProps) {
  return (
    <section id="top" className="pt-8 pb-12 lg:pt-14 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center py-2 lg:py-6">
            <p className="text-xs sm:text-sm font-medium text-[#5A625D] tracking-wide mb-4">
              {BRAND_FULL_NAME} · Pijat Panggilan Hotel, Rumah &amp; Kos
            </p>
            <h1 className="font-display text-[clamp(2.25rem,4vw,3.75rem)] font-semibold leading-[1.08] tracking-tight text-[#1A1D1B] text-balance max-w-xl mb-6">
              Kenyamanan &amp; Relaksasi Langsung untuk Kota Serang &amp; Sekitarnya
            </h1>
            <p className="text-base sm:text-[17px] leading-relaxed text-[#5A625D] max-w-lg mb-8">
              Pijat Barokah merupakan jasa pijat panggilan hotel, rumah, dan kos untuk Kota Serang
              &amp; sekitarnya. Dengan layanan profesional dan berkualitas tinggi, kami membantu
              menghilangkan stres dan ketegangan tubuh akibat rutinitas sehari-hari.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={onJumpToReservation}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] focus-visible:ring-offset-2"
              >
                <span>Pesan Terapis Sekarang</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <a
                href="#layanan"
                className="text-sm font-medium text-[#1A1D1B] hover:text-[#1B4332] underline underline-offset-4 decoration-[#1A1D1B]/30 hover:decoration-[#1B4332] transition-colors whitespace-nowrap shrink-0"
              >
                Lihat Daftar Layanan
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-xl overflow-hidden border border-[#E3E6E2] bg-[#EDF3EF] aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[440px]">
              <ResilientImage
                src={HERO_IMAGE}
                alt="Layanan Pijat Barokah Serang — Pijat panggilan ke hotel, rumah, dan kos"
                className="w-full h-full object-cover"
                fallbackLabel="Pijat Barokah Serang"
              />
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Metric Strip */}
        <div className="mt-10 lg:mt-14 bg-white border border-[#E3E6E2] rounded-xl grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#E3E6E2]">
          <div className="p-5 sm:p-6">
            <p className="text-xl sm:text-2xl font-display font-semibold text-[#1A1D1B] tabular-nums">
              Hotel, Rumah &amp; Kos
            </p>
            <p className="mt-1 text-xs sm:text-sm text-[#5A625D]">
              Panggilan langsung ke lokasi Anda
            </p>
          </div>
          <div className="p-5 sm:p-6 border-l border-[#E3E6E2] lg:border-l-0">
            <p className="text-xl sm:text-2xl font-display font-semibold text-[#1A1D1B] tabular-nums">
              Mulai Rp 200.000
            </p>
            <p className="mt-1 text-xs sm:text-sm text-[#5A625D]">
              Pilihan durasi 60, 90, hingga 120 menit
            </p>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-xl sm:text-2xl font-display font-semibold text-[#1A1D1B] tabular-nums">
              Serang &amp; Sekitarnya
            </p>
            <p className="mt-1 text-xs sm:text-sm text-[#5A625D]">
              Estimasi tiba 30–60 menit ke lokasi
            </p>
          </div>
          <div className="p-5 sm:p-6 border-l border-[#E3E6E2] lg:border-l-0">
            <p className="text-xl sm:text-2xl font-display font-semibold text-[#1A1D1B] tabular-nums">
              08:00 – 22:00
            </p>
            <p className="mt-1 text-xs sm:text-sm text-[#5A625D]">
              Melayani setiap hari via reservasi &amp; WA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
