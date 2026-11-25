export type ServiceCategory = 'semua' | 'fullbody' | 'tradisional' | 'perawatan';

export type DurationMinutes = 60 | 90 | 120;

export interface ServiceItem {
  id: string;
  name: string;
  category: Exclude<ServiceCategory, 'semua'>;
  categoryLabel: string;
  pressure: string;
  shortDescription: string;
  benefits: string[];
  image: string;
  availableDurations: DurationMinutes[];
  prices: Partial<Record<DurationMinutes, number>>;
}

export interface ServiceArea {
  id: string;
  name: string;
  etaText: string;
  transportFee: number;
}

export type PropertyType = 'Rumah' | 'Kos' | 'Hotel';
export type PaymentMethod = 'Bayar di Tempat (Tunai / QRIS)' | 'Transfer Bank';
export type BookingStatus = 'Dikonfirmasi' | 'Dijadwalkan Ulang' | 'Dibatalkan';

export interface Reservation {
  bookingCode: string;
  createdAt: string;
  status: BookingStatus;
  serviceId: string;
  serviceName: string;
  duration: DurationMinutes;
  date: string;
  timeSlot: string;
  customerName: string;
  whatsapp: string;
  propertyType: PropertyType;
  areaId: string;
  areaName: string;
  address: string;
  notes: string;
  paymentMethod: PaymentMethod;
  servicePrice: number;
  transportFee: number;
  totalPrice: number;
}
