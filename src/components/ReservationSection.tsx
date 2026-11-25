import {
  AlertCircle,
  Calendar,
  Check,
  Loader2,
  Copy,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BRAND_FULL_NAME,
  CONTACT_PHONE_DISPLAY,
  CONTACT_WHATSAPP_NUMBER,
  formatIDR,
  SERVICE_AREAS,
  SERVICES,
  TIME_SLOTS,
} from '../data/spaData';
import {
  DurationMinutes,
  PaymentMethod,
  PropertyType,
  Reservation,
} from '../types/booking';
import { submitReservation } from '../lib/netlifyForms';

interface ReservationSectionProps {
  selectedServiceId: string;
  onChangeServiceId: (id: string) => void;
  onCreateReservation: (reservation: Reservation) => void;
  onOpenLookup: () => void;
}

function getLocalISODate(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatReadableDate(isoDate: string): string {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function isSlotAvailableForDate(slot: string, isoDate: string): boolean {
  const todayISO = getLocalISODate(0);
  if (isoDate !== todayISO) {
    return true;
  }
  const now = new Date();
  const [slotHour, slotMin] = slot.split(':').map(Number);
  const slotTotalMinutes = slotHour * 60 + slotMin;
  const minAllowedMinutes = now.getHours() * 60 + now.getMinutes() + 45;
  return slotTotalMinutes >= minAllowedMinutes;
}

export function ReservationSection({
  selectedServiceId,
  onChangeServiceId,
  onCreateReservation,
  onOpenLookup,
}: ReservationSectionProps) {
  const todayISO = useMemo(() => getLocalISODate(0), []);
  const tomorrowISO = useMemo(() => getLocalISODate(1), []);
  const dayAfterISO = useMemo(() => getLocalISODate(2), []);

  const hasSlotsToday = useMemo(
    () => TIME_SLOTS.some((slot) => isSlotAvailableForDate(slot, todayISO)),
    [todayISO]
  );

  const [duration, setDuration] = useState<DurationMinutes>(90);
  const [date, setDate] = useState<string>(() => (hasSlotsToday ? todayISO : tomorrowISO));
  const [timeSlot, setTimeSlot] = useState<string>(() => {
    const initialDate = hasSlotsToday ? todayISO : tomorrowISO;
    return TIME_SLOTS.find((slot) => isSlotAvailableForDate(slot, initialDate)) || '13:00';
  });

  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Hotel');
  const [areaId, setAreaId] = useState<string>(SERVICE_AREAS[0].id);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    'Bayar di Tempat (Tunai / QRIS)'
  );

  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Reservation | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = useMemo(
    () => SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0],
    [selectedServiceId]
  );

  useEffect(() => {
    if (!selectedService.availableDurations.includes(duration)) {
      setDuration(selectedService.availableDurations[0]);
    }
  }, [selectedService, duration]);

  const selectedArea = useMemo(
    () => SERVICE_AREAS.find((a) => a.id === areaId) || SERVICE_AREAS[0],
    [areaId]
  );

  useEffect(() => {
    if (!isSlotAvailableForDate(timeSlot, date)) {
      const nextAvailable = TIME_SLOTS.find((slot) => isSlotAvailableForDate(slot, date));
      if (nextAvailable) {
        setTimeSlot(nextAvailable);
      }
    }
  }, [date, timeSlot]);

  const effectiveDuration = selectedService.availableDurations.includes(duration)
    ? duration
    : selectedService.availableDurations[0];
  const servicePrice = selectedService.prices[effectiveDuration] || 0;
  const transportFee = selectedArea.transportFee;
  const totalPrice = servicePrice + transportFee;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    const trimmedName = customerName.trim();
    const cleanedPhone = whatsapp.replace(/[\s\-()]/g, '');
    const trimmedAddress = address.trim();

    if (trimmedName.length < 2) {
      setFormError('Mohon masukkan nama lengkap Anda (minimal 2 karakter).');
      return;
    }

    if (!/^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(cleanedPhone)) {
      setFormError(
        'Mohon masukkan nomor WhatsApp Indonesia yang valid (contoh: 085863567232).'
      );
      return;
    }

    if (!date || !timeSlot || !isSlotAvailableForDate(timeSlot, date)) {
      setFormError('Mohon pilih tanggal dan jam kedatangan yang masih tersedia.');
      return;
    }

    if (trimmedAddress.length < 8) {
      setFormError(
        'Mohon isi alamat lengkap beserta nama hotel/nomor kamar, rumah, atau kos Anda.'
      );
      return;
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const dateStamp = date.slice(5).replace('-', '');
    const bookingCode = `BRK-${dateStamp}-${randomDigits}`;

    const newReservation: Reservation = {
      bookingCode,
      createdAt: new Date().toISOString(),
      status: 'Dikonfirmasi',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      duration: effectiveDuration,
      date,
      timeSlot,
      customerName: trimmedName,
      whatsapp: cleanedPhone,
      propertyType,
      areaId: selectedArea.id,
      areaName: selectedArea.name,
      address: trimmedAddress,
      notes: notes.trim(),
      paymentMethod,
      servicePrice,
      transportFee,
      totalPrice,
    };

    setIsSubmitting(true);
    try {
      await submitReservation(newReservation);
    } catch {
      setFormError(
        `Reservasi gagal terkirim. Periksa koneksi internet Anda lalu coba lagi, atau hubungi WhatsApp ${CONTACT_PHONE_DISPLAY}.`
      );
      return;
    } finally {
      setIsSubmitting(false);
    }

    onCreateReservation(newReservation);
    setConfirmedBooking(newReservation);
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  };

  const buildWhatsAppLink = (booking: Reservation) => {
    const message = [
      `Halo ${BRAND_FULL_NAME}, saya ingin konfirmasi reservasi pijat panggilan:`,
      `Kode Reservasi: ${booking.bookingCode}`,
      `Nama: ${booking.customerName}`,
      `Layanan: ${booking.serviceName} (${booking.duration} Menit)`,
      `Jadwal: ${formatReadableDate(booking.date)} pukul ${booking.timeSlot} WIB`,
      `Lokasi: ${booking.propertyType} - ${booking.areaName}`,
      `Alamat: ${booking.address}`,
      booking.notes ? `Catatan: ${booking.notes}` : null,
      `Total: ${formatIDR(booking.totalPrice)} (${booking.paymentMethod})`,
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${CONTACT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="reservasi" className="py-14 lg:py-20 bg-white border-t border-[#E3E6E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs sm:text-sm font-medium text-[#5A625D] mb-2">
            Reservasi {BRAND_FULL_NAME}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1D1B] text-balance">
            Pesan Sesi Pijat ke Hotel, Rumah &amp; Kos
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#5A625D]">
            Pilih layanan dan durasi, tentukan jadwal kedatangan, lalu konfirmasi alamat Anda di
            Kota Serang &amp; sekitarnya.
          </p>
        </div>

        {confirmedBooking ? (
          <div className="max-w-3xl bg-[#F7F8F6] border border-[#1B4332]/30 rounded-xl p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3E6E2]">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1B4332] mb-2">
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Reservasi Tercatat · {BRAND_FULL_NAME}</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1A1D1B]">
                  Terima kasih, {confirmedBooking.customerName}
                </h3>
              </div>

              <div className="bg-white border border-[#E3E6E2] rounded-lg px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] text-[#5A625D]">Kode Reservasi</p>
                  <p className="font-mono text-base font-semibold text-[#1A1D1B] tabular-nums">
                    {confirmedBooking.bookingCode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(confirmedBooking.bookingCode)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#EDF3EF] text-[#1B4332] hover:bg-[#1B4332] hover:text-white rounded-md transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[#E3E6E2] text-sm">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#5A625D]">Layanan &amp; Durasi</p>
                  <p className="font-semibold text-[#1A1D1B] mt-0.5">
                    {confirmedBooking.serviceName} ({confirmedBooking.duration} Menit)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#5A625D]">Jadwal Kedatangan</p>
                  <p className="font-semibold text-[#1A1D1B] mt-0.5 tabular-nums">
                    {formatReadableDate(confirmedBooking.date)} · Pukul {confirmedBooking.timeSlot} WIB
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#5A625D]">Lokasi Kunjungan</p>
                  <p className="font-semibold text-[#1A1D1B] mt-0.5">
                    {confirmedBooking.propertyType} · {confirmedBooking.areaName}
                  </p>
                  <p className="text-xs text-[#5A625D] mt-0.5">{confirmedBooking.address}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5A625D]">Metode Pembayaran &amp; Total</p>
                  <p className="font-semibold text-[#1A1D1B] mt-0.5 tabular-nums">
                    {formatIDR(confirmedBooking.totalPrice)}
                  </p>
                  <p className="text-xs text-[#5A625D] mt-0.5">{confirmedBooking.paymentMethod}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-[#5A625D]">
                Kirimkan detail reservasi ini ke WhatsApp admin ({CONTACT_PHONE_DISPLAY}) untuk
                mempercepat koordinasi keberangkatan terapis.
              </p>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href={buildWhatsAppLink(confirmedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#1B4332] text-white hover:bg-[#143326] rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Kirim ke WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenLookup}
                  className="px-4 py-2.5 text-sm font-medium bg-white border border-[#E3E6E2] text-[#1A1D1B] hover:border-[#1B4332] rounded-lg transition-colors cursor-pointer"
                >
                  Kelola Jadwal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setFormError(null);
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-[#5A625D] hover:text-[#1A1D1B] underline underline-offset-4 cursor-pointer"
                >
                  Pesan Lagi
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
          >
            {/* Left Column: 3-Step Form */}
            <div className="lg:col-span-7 space-y-10">
              {/* Step 1: Layanan & Durasi */}
              <div className="space-y-5">
                <div className="flex items-baseline justify-between border-b border-[#E3E6E2] pb-3">
                  <h3 className="font-display text-2xl font-semibold text-[#1A1D1B]">
                    01. Pilih Layanan &amp; Durasi
                  </h3>
                  <span className="text-xs text-[#5A625D]">Langkah 1 dari 3</span>
                </div>

                <div>
                  <label
                    htmlFor="service-select"
                    className="block text-sm font-medium text-[#1A1D1B] mb-2"
                  >
                    Layanan Massage
                  </label>
                  <select
                    id="service-select"
                    value={selectedService.id}
                    onChange={(e) => onChangeServiceId(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-[#F7F8F6] border border-[#E3E6E2] rounded-lg text-[#1A1D1B] focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332]"
                  >
                    {SERVICES.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} — {service.categoryLabel}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="block text-sm font-medium text-[#1A1D1B] mb-2">
                    Pilihan Durasi &amp; Tarif
                  </span>
                  <div
                    className={`grid gap-3 ${
                      selectedService.availableDurations.length === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-3'
                    }`}
                  >
                    {selectedService.availableDurations.map((mins) => {
                      const isSelected = effectiveDuration === mins;
                      const price = selectedService.prices[mins] || 0;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setDuration(mins)}
                          className={`p-3.5 text-left rounded-lg border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] ${
                            isSelected
                              ? 'bg-[#EDF3EF] border-[#1B4332] text-[#1A1D1B]'
                              : 'bg-white border-[#E3E6E2] hover:border-[#C7CEC9] text-[#5A625D]'
                          }`}
                        >
                          <p className="text-sm font-semibold text-[#1A1D1B] tabular-nums">
                            {mins} Menit
                          </p>
                          <p className="text-xs text-[#5A625D] mt-0.5 tabular-nums">
                            {formatIDR(price)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 2: Jadwal Kedatangan */}
              <div className="space-y-5">
                <div className="flex items-baseline justify-between border-b border-[#E3E6E2] pb-3">
                  <h3 className="font-display text-2xl font-semibold text-[#1A1D1B]">
                    02. Jadwal Kedatangan
                  </h3>
                  <span className="text-xs text-[#5A625D]">Langkah 2 dari 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <span className="block text-sm font-medium text-[#1A1D1B] mb-2">
                      Pilihan Cepat Tanggal
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Hari Ini', value: todayISO, disabled: !hasSlotsToday },
                        { label: 'Besok', value: tomorrowISO, disabled: false },
                        { label: 'Lusa', value: dayAfterISO, disabled: false },
                      ].map((item) => {
                        const active = date === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            disabled={item.disabled}
                            onClick={() => setDate(item.value)}
                            className={`py-2.5 px-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                              item.disabled
                                ? 'bg-[#F7F8F6] text-[#A2ABA5] border-[#E3E6E2] cursor-not-allowed'
                                : active
                                  ? 'bg-[#1B4332] text-white border-[#1B4332] cursor-pointer'
                                  : 'bg-white text-[#1A1D1B] border-[#E3E6E2] hover:border-[#1B4332] cursor-pointer'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-date"
                      className="block text-sm font-medium text-[#1A1D1B] mb-2"
                    >
                      Atau Pilih Tanggal Lain
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      min={todayISO}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F8F6] border border-[#E3E6E2] rounded-lg text-[#1A1D1B] tabular-nums focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-medium text-[#1A1D1B] mb-2">
                    Jam Kedatangan Terapis (WIB)
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {TIME_SLOTS.map((slot) => {
                      const available = isSlotAvailableForDate(slot, date);
                      const isSelected = timeSlot === slot && available;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={!available}
                          onClick={() => setTimeSlot(slot)}
                          className={`py-2.5 px-3 text-sm font-medium rounded-lg border tabular-nums transition-colors ${
                            !available
                              ? 'bg-[#F7F8F6] text-[#A2ABA5] border-[#E3E6E2] line-through cursor-not-allowed'
                              : isSelected
                                ? 'bg-[#1B4332] text-white border-[#1B4332] cursor-pointer'
                                : 'bg-white text-[#1A1D1B] border-[#E3E6E2] hover:border-[#1B4332] cursor-pointer'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Lokasi & Data Pemesan */}
              <div className="space-y-5">
                <div className="flex items-baseline justify-between border-b border-[#E3E6E2] pb-3">
                  <h3 className="font-display text-2xl font-semibold text-[#1A1D1B]">
                    03. Lokasi Kunjungan &amp; Data Pemesan
                  </h3>
                  <span className="text-xs text-[#5A625D]">Langkah 3 dari 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="customer-name"
                      className="block text-sm font-medium text-[#1A1D1B] mb-2"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      required
                      placeholder="Contoh: Hendra Saputra"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-[#F7F8F6] border border-[#E3E6E2] rounded-lg text-[#1A1D1B] placeholder:text-[#8E9691] focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="customer-whatsapp"
                      className="block text-sm font-medium text-[#1A1D1B] mb-2"
                    >
                      Nomor WhatsApp Aktif
                    </label>
                    <input
                      id="customer-whatsapp"
                      type="tel"
                      required
                      placeholder="085863567232"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-[#F7F8F6] border border-[#E3E6E2] rounded-lg text-[#1A1D1B] placeholder:text-[#8E9691] tabular-nums focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-sm font-medium text-[#1A1D1B] mb-2">
                      Tipe Lokasi
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Hotel', 'Rumah', 'Kos'] as PropertyType[]).map((type) => {
                        const active = propertyType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setPropertyType(type)}
                            className={`py-2.5 px-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                              active
                                ? 'bg-[#EDF3EF] text-[#1B4332] border-[#1B4332]'
                                : 'bg-white text-[#5A625D] border-[#E3E6E2] hover:border-[#C7CEC9]'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="service-area"
                      className="block text-sm font-medium text-[#1A1D1B] mb-2"
                    >
                      Area Layanan (Serang &amp; Sekitarnya)
                    </label>
                    <select
                      id="service-area"
                      value={areaId}
                      onChange={(e) => setAreaId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F8F6] border border-[#E3E6E2] rounded-lg text-[#1A1D1B] focus:outline-none focus:border-[#1B4332]"
                    >
                      {SERVICE_AREAS.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name} ({area.transportFee === 0 ? 'Gratis Transport' : `+${formatIDR(area.transportFee)}`})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="full-address"
                    className="block text-sm font-medium text-[#1A1D1B] mb-2"
                  >
                    Alamat Lengkap / Nama Hotel &amp; Nomor Kamar / Kos
                  </label>
                  <textarea
                    id="full-address"
                    rows={3}
                    required
                    placeholder="Contoh: Hotel Horison Ultima Ratu Serang Kamar 305 / Jl. Mayor Muslich No. 1, Kota Serang"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-[#F7F8F6] border border-[#E3E6E2] rounded-lg text-[#1A1D1B] placeholder:text-[#8E9691] focus:outline-none focus:border-[#1B4332]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="booking-notes"
                      className="block text-sm font-medium text-[#1A1D1B] mb-2"
                    >
                      Catatan Tekanan / Keluhan <span className="font-normal text-[#5A625D]">(Opsional)</span>
                    </label>
                    <input
                      id="booking-notes"
                      type="text"
                      placeholder="Contoh: Fokus punggung & bahu, tekanan sedang"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-[#F7F8F6] border border-[#E3E6E2] rounded-lg text-[#1A1D1B] placeholder:text-[#8E9691] focus:outline-none focus:border-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="payment-method"
                      className="block text-sm font-medium text-[#1A1D1B] mb-2"
                    >
                      Metode Pembayaran
                    </label>
                    <select
                      id="payment-method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F7F8F6] border border-[#E3E6E2] rounded-lg text-[#1A1D1B] focus:outline-none focus:border-[#1B4332]"
                    >
                      <option value="Bayar di Tempat (Tunai / QRIS)">
                        Bayar di Tempat (Tunai / QRIS)
                      </option>
                      <option value="Transfer Bank">Transfer Bank</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Reservation Summary */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-[#F7F8F6] border border-[#E3E6E2] rounded-xl p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-medium text-[#5A625D]">Ringkasan Reservasi</p>
                <h3 className="font-display text-2xl font-semibold text-[#1A1D1B] mt-1">
                  {selectedService.name}
                </h3>
              </div>

              <div className="space-y-3 text-sm border-y border-[#E3E6E2] py-5">
                <div className="flex items-start gap-3 text-[#1A1D1B]">
                  <Calendar className="w-4 h-4 text-[#1B4332] mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-medium">{formatReadableDate(date)}</p>
                    <p className="text-xs text-[#5A625D] tabular-nums">
                      Pukul {timeSlot} WIB · Durasi {effectiveDuration} menit
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-[#1A1D1B]">
                  <MapPin className="w-4 h-4 text-[#1B4332] mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-medium">
                      {propertyType} · {selectedArea.name}
                    </p>
                    <p className="text-xs text-[#5A625D]">{selectedArea.etaText}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between text-[#5A625D]">
                  <span>
                    {selectedService.name} ({effectiveDuration} mnt)
                  </span>
                  <span className="font-medium text-[#1A1D1B] tabular-nums">
                    {formatIDR(servicePrice)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#5A625D]">
                  <span>Biaya Transportasi ({selectedArea.name})</span>
                  <span className="font-medium text-[#1A1D1B] tabular-nums">
                    {transportFee === 0 ? 'Gratis' : formatIDR(transportFee)}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E3E6E2] flex items-baseline justify-between">
                  <span className="font-semibold text-[#1A1D1B]">Total Pembayaran</span>
                  <span className="font-display text-2xl font-semibold text-[#1B4332] tabular-nums">
                    {formatIDR(totalPrice)}
                  </span>
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3.5 text-xs sm:text-sm text-[#8C2D19] bg-[#FDF2F0] border border-[#E5B8AE] rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-medium text-white bg-[#1B4332] hover:bg-[#143326] disabled:opacity-70 disabled:cursor-wait rounded-lg transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] focus-visible:ring-offset-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Mengirim Reservasi…</span>
                  </>
                ) : (
                  'Konfirmasi Reservasi'
                )}
              </button>

              <div className="flex items-start gap-2 text-xs text-[#5A625D]">
                <ShieldCheck className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Butuh bantuan cepat? Hubungi WhatsApp {CONTACT_PHONE_DISPLAY}. Pembayaran
                  dilakukan setelah terapis tiba di lokasi.
                </span>
              </div>
            </aside>
          </form>
        )}
      </div>
    </section>
  );
}
