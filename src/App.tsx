/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { CheckBookingModal } from './components/CheckBookingModal';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { ReservationSection } from './components/ReservationSection';
import { ServicesSection } from './components/ServicesSection';
import { TherapistsAndTrustSection } from './components/TherapistsAndTrustSection';
import { SERVICES } from './data/spaData';
import { submitReservationChange } from './lib/netlifyForms';
import { Reservation, ServiceItem } from './types/booking';

const STORAGE_KEY = 'pijat_barokah_reservations_v1';

export default function App() {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0].id);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Reservation[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [reservations]);

  const scrollToReservation = () => {
    const el = document.getElementById('reservasi');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedServiceId(service.id);
    scrollToReservation();
  };

  const handleCreateReservation = (newReservation: Reservation) => {
    setReservations((prev) => [newReservation, ...prev]);
  };

  const handleReschedule = async (bookingCode: string, newDate: string, newTime: string) => {
    const target = reservations.find((r) => r.bookingCode === bookingCode);
    if (!target) return;
    await submitReservationChange(target, { type: 'reschedule', newDate, newTime });
    setReservations((prev) =>
      prev.map((item) =>
        item.bookingCode === bookingCode
          ? { ...item, date: newDate, timeSlot: newTime, status: 'Dijadwalkan Ulang' }
          : item
      )
    );
  };

  const handleCancelReservation = async (bookingCode: string) => {
    const target = reservations.find((r) => r.bookingCode === bookingCode);
    if (!target) return;
    await submitReservationChange(target, { type: 'cancel' });
    setReservations((prev) =>
      prev.map((item) =>
        item.bookingCode === bookingCode ? { ...item, status: 'Dibatalkan' } : item
      )
    );
  };

  const activeBookingCount = reservations.filter((r) => r.status !== 'Dibatalkan').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F6] text-[#1A1D1B]">
      <Navbar
        onOpenLookup={() => setIsLookupOpen(true)}
        onJumpToReservation={scrollToReservation}
        savedCount={activeBookingCount}
      />

      <main className="flex-1">
        <Hero onJumpToReservation={scrollToReservation} />
        <ServicesSection
          selectedServiceId={selectedServiceId}
          onSelectService={handleSelectService}
        />
        <TherapistsAndTrustSection />
        <ReservationSection
          selectedServiceId={selectedServiceId}
          onChangeServiceId={setSelectedServiceId}
          onCreateReservation={handleCreateReservation}
          onOpenLookup={() => setIsLookupOpen(true)}
        />
      </main>

      <Footer onOpenLookup={() => setIsLookupOpen(true)} />

      <CheckBookingModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        reservations={reservations}
        onReschedule={handleReschedule}
        onCancelReservation={handleCancelReservation}
      />
    </div>
  );
}
