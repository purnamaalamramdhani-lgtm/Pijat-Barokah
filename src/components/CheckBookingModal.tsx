import { AlertCircle, Calendar, CheckCircle2, Clock, Search, X, XCircle } from 'lucide-react';
import { useState } from 'react';
import { formatIDR, TIME_SLOTS } from '../data/spaData';
import { Reservation } from '../types/booking';

interface CheckBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  onReschedule: (bookingCode: string, newDate: string, newTime: string) => Promise<void>;
  onCancelReservation: (bookingCode: string) => Promise<void>;
}

export function CheckBookingModal({
  isOpen,
  onClose,
  reservations,
  onReschedule,
  onCancelReservation,
}: CheckBookingModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [actionError, setActionError] = useState<{ code: string; message: string } | null>(null);

  if (!isOpen) return null;

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const displayedReservations = trimmedQuery
    ? reservations.filter(
        (r) =>
          r.bookingCode.toLowerCase().includes(trimmedQuery) ||
          r.whatsapp.toLowerCase().includes(trimmedQuery) ||
          r.customerName.toLowerCase().includes(trimmedQuery)
      )
    : reservations;

  const startReschedule = (reservation: Reservation) => {
    setActionError(null);
    setEditingCode(reservation.bookingCode);
    setNewDate(reservation.date);
    setNewTime(reservation.timeSlot);
  };

  const runAction = async (bookingCode: string, action: () => Promise<void>) => {
    if (pendingCode) return;
    setActionError(null);
    setPendingCode(bookingCode);
    try {
      await action();
      return true;
    } catch {
      setActionError({
        code: bookingCode,
        message: 'Perubahan gagal terkirim ke admin. Periksa koneksi internet Anda lalu coba lagi.',
      });
      return false;
    } finally {
      setPendingCode(null);
    }
  };

  const confirmReschedule = async (bookingCode: string) => {
    if (!newDate || !newTime) return;
    const ok = await runAction(bookingCode, () => onReschedule(bookingCode, newDate, newTime));
    if (ok) setEditingCode(null);
  };

  const confirmCancel = (bookingCode: string) => {
    if (!window.confirm('Batalkan reservasi ini? Admin akan menerima pemberitahuan pembatalan.')) {
      return;
    }
    void runAction(bookingCode, () => onCancelReservation(bookingCode));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lookup-modal-title"
    >
      <div className="w-full max-w-lg h-full bg-[#F7F8F6] border-l border-[#E3E6E2] flex flex-col shadow-xl">
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-[#E3E6E2] flex items-center justify-between gap-4">
          <div>
            <h2 id="lookup-modal-title" className="font-display text-2xl font-semibold text-[#1A1D1B]">
              Cek &amp; Kelola Reservasi
            </h2>
            <p className="text-xs text-[#5A625D] mt-0.5">
              Cari dengan kode reservasi atau nomor WhatsApp Anda
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel reservasi"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#5A625D] hover:text-[#1A1D1B] hover:bg-[#ECEEEB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 bg-white border-b border-[#E3E6E2]">
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#5A625D] absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Contoh: BRK-1124-4821 atau 0858..."
              aria-label="Cari kode reservasi atau nomor WhatsApp"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F7F8F6] border border-[#E3E6E2] rounded-lg text-[#1A1D1B] placeholder:text-[#8E9691] focus:outline-none focus:border-[#1B4332]"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {displayedReservations.length === 0 ? (
            <div className="bg-white border border-[#E3E6E2] rounded-xl p-8 text-center">
              <p className="font-display text-xl font-semibold text-[#1A1D1B]">
                Belum Ada Reservasi Ditemukan
              </p>
              <p className="text-sm text-[#5A625D] mt-2">
                {reservations.length === 0
                  ? 'Reservasi yang Anda buat di perangkat ini akan tersimpan otomatis dan dapat dikelola langsung dari sini.'
                  : 'Periksa kembali kode reservasi atau nomor WhatsApp yang Anda masukkan.'}
              </p>
            </div>
          ) : (
            displayedReservations.map((res) => {
              const isCancelled = res.status === 'Dibatalkan';
              const isEditing = editingCode === res.bookingCode;
              const isPending = pendingCode === res.bookingCode;
              const errorMessage =
                actionError?.code === res.bookingCode ? actionError.message : null;

              return (
                <article
                  key={res.bookingCode}
                  className="bg-white border border-[#E3E6E2] rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E3E6E2]">
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#5A625D] tabular-nums">
                        {res.bookingCode}
                      </p>
                      <h3 className="font-display text-xl font-semibold text-[#1A1D1B] mt-0.5">
                        {res.serviceName}
                      </h3>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        isCancelled ? 'text-[#8C2D19]' : 'text-[#1B4332]'
                      }`}
                    >
                      {isCancelled ? (
                        <XCircle className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      )}
                      <span>{res.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-[#5A625D]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#1B4332] shrink-0" aria-hidden="true" />
                      <span className="tabular-nums text-[#1A1D1B] font-medium">{res.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#1B4332] shrink-0" aria-hidden="true" />
                      <span className="tabular-nums text-[#1A1D1B] font-medium">
                        {res.timeSlot} WIB · {res.duration} mnt
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-[#5A625D] space-y-1">
                    <p>
                      <span className="font-medium text-[#1A1D1B]">Pemesan:</span> {res.customerName}{' '}
                      ({res.whatsapp})
                    </p>
                    <p>
                      <span className="font-medium text-[#1A1D1B]">Lokasi:</span> {res.propertyType},{' '}
                      {res.areaName} — {res.address}
                    </p>
                    <p>
                      <span className="font-medium text-[#1A1D1B]">Total:</span>{' '}
                      <span className="font-semibold text-[#1A1D1B] tabular-nums">
                        {formatIDR(res.totalPrice)}
                      </span>{' '}
                      ({res.paymentMethod})
                    </p>
                  </div>

                  {isEditing && !isCancelled && (
                    <div className="p-3.5 bg-[#F7F8F6] border border-[#E3E6E2] rounded-lg space-y-3">
                      <p className="text-xs font-semibold text-[#1A1D1B]">Pilih Jadwal Baru</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          className="px-2.5 py-2 text-xs bg-white border border-[#E3E6E2] rounded-md tabular-nums"
                        />
                        <select
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="px-2.5 py-2 text-xs bg-white border border-[#E3E6E2] rounded-md tabular-nums"
                        >
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot} WIB
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => confirmReschedule(res.bookingCode)}
                          disabled={isPending}
                          className="px-3 py-1.5 text-xs font-medium bg-[#1B4332] text-white rounded-md cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                        >
                          {isPending ? 'Menyimpan…' : 'Simpan Perubahan'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCode(null)}
                          disabled={isPending}
                          className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E3E6E2] text-[#5A625D] rounded-md cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 p-3 text-xs text-[#8C2D19] bg-[#FDF2F0] border border-[#E5B8AE] rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {!isCancelled && !isEditing && (
                    <div className="pt-3 border-t border-[#E3E6E2] flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => startReschedule(res)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-medium bg-[#F7F8F6] hover:bg-[#EDF3EF] text-[#1A1D1B] border border-[#E3E6E2] rounded-md transition-colors cursor-pointer"
                      >
                        Ubah Jadwal
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmCancel(res.bookingCode)}
                        disabled={isPending}
                        className="px-3 py-1.5 text-xs font-medium text-[#8C2D19] hover:bg-[#FDF2F0] border border-[#E5B8AE] rounded-md transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                      >
                        {isPending ? 'Memproses…' : 'Batalkan'}
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
