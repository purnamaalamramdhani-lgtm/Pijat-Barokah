import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onOpenLookup: () => void;
  onJumpToReservation: () => void;
  savedCount: number;
}

export function Navbar({ onOpenLookup, onJumpToReservation, savedCount }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (action?: () => void) => {
    setMobileOpen(false);
    if (action) action();
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#F7F8F6]/95 backdrop-blur-sm border-b border-[#E3E6E2]">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-2xl sm:text-[26px] font-semibold tracking-tight text-[#1A1D1B] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-sm"
        >
          Pijat Barokah
        </a>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A625D]"
        >
          <a
            href="#layanan"
            className="hover:text-[#1A1D1B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-sm"
          >
            Layanan
          </a>
          <a
            href="#prosedur"
            className="hover:text-[#1A1D1B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-sm"
          >
            Prosedur
          </a>
          <a
            href="#reservasi"
            className="hover:text-[#1A1D1B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-sm"
          >
            Reservasi
          </a>
          <button
            type="button"
            onClick={onOpenLookup}
            className="hover:text-[#1A1D1B] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-sm"
          >
            {savedCount > 0 ? `Cek Reservasi (${savedCount})` : 'Cek Reservasi'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick(onJumpToReservation)}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] focus-visible:ring-offset-2"
          >
            Buat Reservasi
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#1A1D1B] hover:bg-[#E3E6E2]/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#F7F8F6] border-b border-[#E3E6E2] px-4 py-4 space-y-2 shadow-sm">
          <a
            href="#layanan"
            onClick={() => handleNavClick()}
            className="block py-2.5 text-sm font-medium text-[#1A1D1B] border-b border-[#E3E6E2]/60"
          >
            Layanan
          </a>
          <a
            href="#prosedur"
            onClick={() => handleNavClick()}
            className="block py-2.5 text-sm font-medium text-[#1A1D1B] border-b border-[#E3E6E2]/60"
          >
            Prosedur
          </a>
          <a
            href="#reservasi"
            onClick={() => handleNavClick()}
            className="block py-2.5 text-sm font-medium text-[#1A1D1B] border-b border-[#E3E6E2]/60"
          >
            Reservasi
          </a>
          <button
            type="button"
            onClick={() => handleNavClick(onOpenLookup)}
            className="w-full text-left py-2.5 text-sm font-medium text-[#1A1D1B] border-b border-[#E3E6E2]/60 cursor-pointer"
          >
            {savedCount > 0 ? `Cek Reservasi (${savedCount})` : 'Cek Reservasi'}
          </button>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleNavClick(onJumpToReservation)}
              className="w-full py-3 px-4 text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143326] rounded-lg transition-colors cursor-pointer"
            >
              Buat Reservasi
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
