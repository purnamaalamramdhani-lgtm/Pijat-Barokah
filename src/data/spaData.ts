import { ServiceArea, ServiceItem } from '../types/booking';

export const BRAND_NAME = 'Pijat Barokah';
export const BRAND_FULL_NAME = 'Pijat Barokah Serang';
export const CONTACT_PHONE_DISPLAY = '+62 858-6356-7232';
export const CONTACT_WHATSAPP_NUMBER = '6285863567232';
export const CONTACT_EMAIL = 'Massagepala@gmail.com';

export const HERO_IMAGE = '/src/assets/images/hero_spa_sanctuary_1795584952603.jpg';

export const SERVICES: ServiceItem[] = [
  {
    id: 'pijat-fullbody',
    name: 'Pijat Fullbody',
    category: 'fullbody',
    categoryLabel: 'Relaksasi Menyeluruh',
    pressure: '60 / 90 / 120 Menit',
    shortDescription:
      'Terapi massage yang membantu meredakan ketegangan otot, meningkatkan sirkulasi darah, dan memberikan relaksasi menyeluruh.',
    benefits: [
      'Meredakan ketegangan otot tubuh',
      'Melancarkan sirkulasi darah',
      'Mengembalikan kebugaran & kualitas tidur',
    ],
    image: '/src/assets/images/service_balinese_massage_1795584952074.jpg',
    availableDurations: [60, 90, 120],
    prices: {
      60: 200000,
      90: 300000,
      120: 350000,
    },
  },
  {
    id: 'pijat-kerokan',
    name: 'Pijat + Kerokan',
    category: 'tradisional',
    categoryLabel: 'Terapi Tradisional',
    pressure: '90 / 120 Menit',
    shortDescription:
      'Terapi tradisional yang sering digunakan untuk meredakan masuk angin, pegal-pegal, dan kelelahan.',
    benefits: [
      'Meredakan masuk angin & badan meriang',
      'Mengurai pegal-pegal di punggung & leher',
      'Menggunakan minyak hangat & alat steril',
    ],
    image: '/src/assets/images/service_deep_tissue_1795584952593.jpg',
    availableDurations: [90, 120],
    prices: {
      90: 350000,
      120: 400000,
    },
  },
  {
    id: 'pijat-scrub',
    name: 'Pijat + Scrub',
    category: 'perawatan',
    categoryLabel: 'Perawatan Tubuh',
    pressure: '90 / 120 Menit',
    shortDescription:
      'Perawatan tubuh untuk mengangkat sel kulit mati, meremajakan kulit, dan memberikan kelembutan serta keharuman pada kulit.',
    benefits: [
      'Mengangkat sel kulit mati secara lembut',
      'Meremajakan & melembutkan kulit',
      'Memberikan keharuman alami yang tahan lama',
    ],
    image: '/src/assets/images/service_reflexology_herbal_1795584952817.jpg',
    availableDurations: [90, 120],
    prices: {
      90: 350000,
      120: 400000,
    },
  },
];

export const SERVICE_AREAS: ServiceArea[] = [
  { id: 'serang-kota', name: 'Kota Serang (Pusat & Cipocok Jaya)', etaText: 'Estimasi tiba 30–45 menit', transportFee: 0 },
  { id: 'serang-taktakan', name: 'Taktakan & Serang Barat', etaText: 'Estimasi tiba 40–50 menit', transportFee: 0 },
  { id: 'serang-kasemen', name: 'Kasemen & Walantaka', etaText: 'Estimasi tiba 45–60 menit', transportFee: 0 },
  { id: 'ciruas-kragilan', name: 'Ciruas & Kragilan', etaText: 'Estimasi tiba 50–60 menit', transportFee: 15000 },
  { id: 'cilegon', name: 'Kota Cilegon & Sekitarnya', etaText: 'Estimasi tiba 60 menit', transportFee: 25000 },
];

export const TIME_SLOTS = [
  '08:00',
  '09:30',
  '11:00',
  '13:00',
  '14:30',
  '16:00',
  '17:30',
  '19:00',
  '20:30',
  '22:00',
];

export const HYGIENE_STANDARDS = [
  {
    number: '01',
    title: 'Peralatan Bersih & Minyak Pijat Berkualitas',
    description:
      'Terapis datang membawa perlengkapan pijat bersih, minyak aromaterapi hangat, serta lulur scrub pilihan yang aman dan nyaman di kulit.',
  },
  {
    number: '02',
    title: 'Terapis Ramah, Amanah & Profesional',
    description:
      'Setiap sesi ditangani terapis berpengalaman dengan teknik pijat terukur yang mengutamakan kenyamanan, kesopanan, dan privasi pelanggan.',
  },
  {
    number: '03',
    title: 'Praktis ke Hotel, Rumah & Kos di Serang',
    description:
      'Tanpa perlu macet atau antre di luar. Cukup pesan dari tempat Anda beristirahat, terapis kami siap datang langsung ke lokasi di Kota Serang dan sekitarnya.',
  },
];

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
