import {
  BRAND_FULL_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP_NUMBER,
} from '../data/spaData';

interface FooterProps {
  onOpenLookup: () => void;
}

export function Footer({ onOpenLookup }: FooterProps) {
  return (
    <footer className="bg-[#F7F8F6] border-t border-[#E3E6E2] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E3E6E2]">
          <div className="md:col-span-5 space-y-3">
            <a href="#top" className="font-display text-2xl font-semibold text-[#1A1D1B]">
              {BRAND_FULL_NAME}
            </a>
            <p className="text-sm leading-relaxed text-[#5A625D] max-w-sm">
              Jasa pijat panggilan hotel, rumah, dan kos untuk Kota Serang &amp; sekitarnya. Hadir
              membawa kenyamanan dan relaksasi langsung ke tempat Anda.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <p className="font-semibold text-[#1A1D1B]">Navigasi</p>
            <ul className="space-y-2 text-[#5A625D]">
              <li>
                <a href="#layanan" className="hover:text-[#1A1D1B] transition-colors">
                  Daftar Layanan &amp; Tarif
                </a>
              </li>
              <li>
                <a href="#prosedur" className="hover:text-[#1A1D1B] transition-colors">
                  Standar Pelayanan
                </a>
              </li>
              <li>
                <a href="#reservasi" className="hover:text-[#1A1D1B] transition-colors">
                  Buat Reservasi
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenLookup}
                  className="hover:text-[#1A1D1B] transition-colors cursor-pointer"
                >
                  Cek Status Reservasi
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5 text-sm text-[#5A625D]">
            <p className="font-semibold text-[#1A1D1B]">Kontak &amp; Area Layanan</p>
            <p>Kota Serang, Cipocok Jaya, Taktakan, Kasemen, Ciruas &amp; Cilegon</p>
            <p>
              WhatsApp &amp; Telepon:{' '}
              <a
                href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#1B4332] hover:underline tabular-nums"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </p>
            <p>
              Email:{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-[#1A1D1B] hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#5A625D]">
          <p>
            &copy; {new Date().getFullYear()} {BRAND_FULL_NAME}. Seluruh hak cipta dilindungi.
          </p>
          <p>Jasa pijat panggilan hotel, rumah, dan kos untuk Kota Serang &amp; sekitarnya.</p>
        </div>
      </div>
    </footer>
  );
}
