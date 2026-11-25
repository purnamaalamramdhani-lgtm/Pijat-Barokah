import { Reservation } from '../types/booking';

/**
 * Submits data to a Netlify Form registered via public/__forms.html.
 * Netlify Forms only accepts URL-encoded bodies (not JSON).
 */
async function submitNetlifyForm(formName: string, fields: Record<string, string>) {
  const body = new URLSearchParams({ 'form-name': formName, 'bot-field': '', ...fields });

  const response = await fetch('/__forms.html', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Form submission failed with status ${response.status}`);
  }
}

export function submitReservation(reservation: Reservation) {
  return submitNetlifyForm('reservasi', {
    subject: `Reservasi Baru ${reservation.bookingCode} - ${reservation.customerName}`,
    nama: reservation.customerName,
    kode_reservasi: reservation.bookingCode,
    whatsapp: reservation.whatsapp,
    layanan: reservation.serviceName,
    durasi: `${reservation.duration} menit`,
    tanggal: reservation.date,
    jam: `${reservation.timeSlot} WIB`,
    tipe_lokasi: reservation.propertyType,
    area: reservation.areaName,
    alamat: reservation.address,
    catatan: reservation.notes || '-',
    metode_pembayaran: reservation.paymentMethod,
    harga_layanan: String(reservation.servicePrice),
    biaya_transport: String(reservation.transportFee),
    total: String(reservation.totalPrice),
  });
}

type ChangeRequest =
  | { type: 'reschedule'; newDate: string; newTime: string }
  | { type: 'cancel' };

export function submitReservationChange(reservation: Reservation, change: ChangeRequest) {
  const label = change.type === 'reschedule' ? 'Jadwal Ulang' : 'Pembatalan';
  return submitNetlifyForm('perubahan-reservasi', {
    subject: `${label} Reservasi ${reservation.bookingCode} - ${reservation.customerName}`,
    nama: reservation.customerName,
    kode_reservasi: reservation.bookingCode,
    whatsapp: reservation.whatsapp,
    jenis_perubahan: label,
    layanan: `${reservation.serviceName} (${reservation.duration} menit)`,
    jadwal_lama: `${reservation.date} ${reservation.timeSlot} WIB`,
    jadwal_baru:
      change.type === 'reschedule'
        ? `${change.newDate} ${change.newTime} WIB`
        : 'Dibatalkan oleh pelanggan',
  });
}
