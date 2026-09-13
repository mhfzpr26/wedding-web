import fs from 'node:fs';
import path from 'node:path';
import type { WeddingConfig } from '@/types/wedding';

const CONFIG_FILE_PATH = path.join(
  process.cwd(),
  'data',
  'wedding-config.json',
);

export const DEFAULT_WEDDING_CONFIG: WeddingConfig = {
  templateId: 'netflix',
  title: 'Destia & Rakafansa | The Wedding',
  seoDescription:
    'Undangan Pernikahan Destia Dwi Ramadhani & Rakafansa Saputra - 14 November 2026.',
  cover: {
    seriesBadge: 'WEDDING SPECIAL',
    trendingRank: 'in Weddings Today',
    title: 'DESTIA & RAKAFANSA',
    matchPercentage: '99% Match',
    year: '2026',
    ratingBadge: 'SU / ALL AGES',
    qualityBadge: 'UHD 4K',
    synopsis:
      'Dua hati yang dipertemukan oleh takdir, kini siap mengikat janji suci seumur hidup. Sebuah kisah romansa penuh kehangatan, komitmen, dan restu kedua keluarga besar.',
    starring: 'Destia Dwi Ramadhani & Rakafansa Saputra',
    bgImage: '/images/netflix-cover-bg.jpg',
    calendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Destia+%26+Rakafansa&dates=20261114T020000Z/20261114T080000Z&details=Pernikahan+Destia+Dwi+Ramadhani+%26+Rakafansa+Saputra&location=Bekasi',
  },
  opening: {
    posterImage: '/images/gallery-1.jpg',
    statusBadge: 'COMING SOON',
    dateText: '14 November 2026',
    title: 'Destia & Rakafansa:',
    subtitle: 'Our Forever Chapter',
    locationText: 'Masjid Agung Al-Barkah & Hotel Santika Premiere, Bekasi',
    quote:
      'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    quoteSource: 'QS. AR-RUM : 21',
  },
  trailer: {
    badge: 'EXCLUSIVE PREVIEW • TEASER FILM',
    title: 'OFFICIAL WEDDING TRAILER',
    subtitle:
      'Satu-satunya teaser film resmi perjalanan cinta Destia & Rakafansa menuju pelaminan.',
    videoUrl: '/videos/wedding-teaser.mp4',
    posterUrl: '/images/gallery-1.jpg',
    duration: '02:30 • 4K UHD',
    filmTitle: 'Destia & Rakafansa: The Journey',
  },
  couple: {
    bride: {
      name: 'Destia Dwi Ramadhani',
      callname: 'Destia',
      characterRole: 'DESTIA as THE BRIDE',
      bio: 'Pribadi yang hangat, penuh kebaikan, dan tulus. Siap mengarungi samudera kehidupan baru bersama sang pendamping hati.',
      instagram: 'destiadwir',
      photo: '/images/destia.jpg',
      parents: {
        mother: 'Ibu Sri Mulyati',
        father: 'Alm. Bapak M. Hastronugi',
      },
    },
    groom: {
      name: 'Rakafansa Saputra',
      callname: 'Rakafansa',
      characterRole: 'RAKAFANSA as THE GROOM',
      bio: 'Pria pekerja keras, berprinsip, dan setia. Berkomitmen menjadi nahkoda keluarga yang penuh amanah dan kasih sayang.',
      instagram: 'rakafansa',
      photo: '/images/rakafansa.jpg',
      parents: {
        mother: 'Ibu Lenny Gusnita',
        father: 'Bapak Mashudi',
      },
    },
  },
  gallery: [
    {
      id: 'p1',
      src: '/images/gallery-1.jpg',
      title: 'Golden Hour Promise',
      category: 'prewedding',
      tag: 'Sunset Garden • 35mm',
      aspect: 'landscape',
    },
    {
      id: 'p2',
      src: '/images/destia.jpg',
      title: 'The Radiant Bride: Destia',
      category: 'lead',
      tag: 'Bridal Portrait • 85mm f/1.4',
      aspect: 'portrait',
    },
    {
      id: 'p3',
      src: '/images/rakafansa.jpg',
      title: 'The Groom: Rakafansa',
      category: 'lead',
      tag: 'Groom Portrait • 85mm f/1.4',
      aspect: 'portrait',
    },
    {
      id: 'p4',
      src: '/images/gallery-3.jpg',
      title: 'Unfiltered Laughter',
      category: 'prewedding',
      tag: 'Candid Cafe • 50mm f/1.2',
      aspect: 'portrait',
    },
    {
      id: 'p5',
      src: '/images/gallery-2.jpg',
      title: 'Elegance in Black Tie',
      category: 'prewedding',
      tag: 'Grand Ballroom • Studio Light',
      aspect: 'landscape',
    },
    {
      id: 'p6',
      src: '/images/gallery-4.jpg',
      title: 'The Sacred Vows & Rings',
      category: 'prewedding',
      tag: 'Macro Close-Up • 100mm f/2.8',
      aspect: 'landscape',
    },
    {
      id: 'p7',
      src: '/images/gallery-5.jpg',
      title: 'Royal Heritage Songket',
      category: 'prewedding',
      tag: 'Traditional Adat • Royal Navy',
      aspect: 'portrait',
    },
    {
      id: 'p8',
      src: '/images/venue-akad.jpg',
      title: 'Sanctuary of Akad Nikah',
      category: 'venue',
      tag: 'Masjid Agung Al-Barkah',
      aspect: 'landscape',
    },
  ],
  loveStory: [
    {
      year: '2022',
      event: 'Pertama Bertemu',
      desc: 'Kisah kami bermula dari pertemuan tak terduga yang mengubah segalanya. Suasana yang sederhana tapi penuh makna menjadi awal dari perjalanan panjang kami.',
    },
    {
      year: '2024',
      event: 'Mulai Berniat',
      desc: 'Setelah melewati berbagai dinamika bersama, kami memutuskan untuk menjalin ikatan yang lebih serius. Keputusan ini dilandasi oleh rasa saling percaya, menghargai, dan mencintai.',
    },
    {
      year: '2026',
      event: 'Acara Pernikahan',
      desc: 'Hari ini, kami berdiri di hadapan Tuhan dan orang-orang terkasih untuk mengucapkan janji suci. Sebuah momen yang menandai awal kehidupan baru sebagai suami istri.',
    },
  ],
  countdown: {
    targetDate: '2026-11-14T09:00:00+07:00',
    title: 'PREMIERE COUNTDOWN',
    calendarUrl:
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Destia+%26+Rakafansa&dates=20261114T020000Z/20261114T080000Z&details=Pernikahan+Destia+Dwi+Ramadhani+%26+Rakafansa+Saputra&location=Bekasi',
  },
  events: [
    {
      id: 'akad',
      type: 'AKAD NIKAH',
      episodeNumber: 1,
      title: 'The Sacred Vow (Akad Nikah)',
      duration: '90 Menit',
      synopsis:
        'Ijab kabul sakral pengikatan janji suci di hadapan penghulu, para saksi, dan keluarga terkasih. Diselenggarakan dengan penuh khidmat dan rasa syukur.',
      date: 'Sabtu, 14 November 2026',
      time: '09:00 - 10:30 WIB',
      venue: 'Masjid Agung Al-Barkah',
      address: 'Jl. Veteran No. 46, Marga Jaya, Bekasi Selatan, Kota Bekasi',
      mapUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Barkah+Bekasi',
      calendarUrl:
        'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Akad+Nikah+Destia+%26+Rakafansa&dates=20261114T020000Z/20261114T040000Z&details=Pernikahan+Destia+Dwi+Ramadhani+%26+Rakafansa+Saputra&location=Masjid+Agung+Al-Barkah+Bekasi',
    },
    {
      id: 'resepsi',
      type: 'RESEPSI PERNIKAHAN',
      episodeNumber: 2,
      title: 'The Grand Celebration (Resepsi)',
      duration: '180 Menit',
      synopsis:
        'Pesta perayaan penuh suka cita dan ramah tamah bersama sanak famili, sahabat, serta handai tolan. Dimeriahkan oleh jamuan prasmanan dan hiburan musik.',
      date: 'Sabtu, 14 November 2026',
      time: '12:00 - 15:00 WIB',
      venue: 'Grand Ballroom Hotel Santika Mega City',
      address: 'Jl. Jendral Ahmad Yani No. 1, Marga Jaya, Kota Bekasi',
      mapUrl: 'https://maps.google.com/?q=Hotel+Santika+Mega+City+Bekasi',
      calendarUrl:
        'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Resepsi+Pernikahan+Destia+%26+Rakafansa&dates=20261114T050000Z/20261114T080000Z&details=Resepsi+Pernikahan+Destia+Dwi+Ramadhani+%26+Rakafansa+Saputra&location=Hotel+Santika+Bekasi',
    },
  ],
  gifts: [
    {
      id: 'bca',
      bank: 'BCA',
      number: '8820491823',
      owner: 'Destia Dwi Ramadhani',
    },
    {
      id: 'mandiri',
      bank: 'MANDIRI',
      number: '1560018928192',
      owner: 'Rakafansa Saputra',
    },
  ],
  closing: {
    badge: 'END CREDITS • CAST & CREW',
    title: 'SEE YOU AT THE PREMIERE',
    message:
      'Merupakan suatu kebahagiaan dan kehormatan yang teramat besar bagi kami atas kehadiran, doa restu, serta kasih sayang yang Anda curahkan.',
    names: 'DESTIA & RAKAFANSA',
    dateLocation: '14 NOVEMBER 2026 • BEKASI, INDONESIA',
    copyright:
      '© 2026 DESTIA & RAKAFANSA WEDDING SPECIAL • A NETFLIX ORIGINAL CELEBRATION • ALL RIGHTS RESERVED',
    credits: [
      {
        role: 'DIRECTED BY',
        name: 'Love, Destiny & Divine Blessings',
      },
      {
        role: 'LEAD ACTRESS',
        name: 'Destia Dwi Ramadhani',
      },
      {
        role: 'LEAD ACTOR',
        name: 'Rakafansa Saputra',
      },
      {
        role: 'EXECUTIVE PRODUCERS',
        name: 'Keluarga Besar Ibu Sri Mulyati & Keluarga Besar Ibu Lenny Gusnita',
      },
      {
        role: 'SPECIAL THANKS',
        name: 'Seluruh Sahabat, Kerabat & Tamu Undangan Terhormat',
      },
    ],
  },
  music: {
    audioUrl: '/audio/wedding-song.mp3',
    title: 'Wedding Celebration Instrumental',
    autoplay: true,
  },
};

export async function getWeddingConfig(): Promise<WeddingConfig> {
  try {
    const tenantConfigFile = path.join(
      process.cwd(),
      'data',
      'tenants',
      'inv-destia-rakafansa',
      'config.json',
    );
    const targetFile = fs.existsSync(tenantConfigFile)
      ? tenantConfigFile
      : CONFIG_FILE_PATH;

    if (!fs.existsSync(targetFile)) {
      return DEFAULT_WEDDING_CONFIG;
    }
    const raw = fs.readFileSync(targetFile, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<WeddingConfig>;
    return {
      ...DEFAULT_WEDDING_CONFIG,
      ...parsed,
      cover: { ...DEFAULT_WEDDING_CONFIG.cover, ...(parsed.cover || {}) },
      opening: { ...DEFAULT_WEDDING_CONFIG.opening, ...(parsed.opening || {}) },
      trailer: { ...DEFAULT_WEDDING_CONFIG.trailer, ...(parsed.trailer || {}) },
      couple: {
        bride: {
          ...DEFAULT_WEDDING_CONFIG.couple.bride,
          ...(parsed.couple?.bride || {}),
        },
        groom: {
          ...DEFAULT_WEDDING_CONFIG.couple.groom,
          ...(parsed.couple?.groom || {}),
        },
      },
      countdown: {
        ...DEFAULT_WEDDING_CONFIG.countdown,
        ...(parsed.countdown || {}),
      },
      closing: { ...DEFAULT_WEDDING_CONFIG.closing, ...(parsed.closing || {}) },
      music: { ...DEFAULT_WEDDING_CONFIG.music, ...(parsed.music || {}) },
      gallery: parsed.gallery || DEFAULT_WEDDING_CONFIG.gallery,
      events: parsed.events || DEFAULT_WEDDING_CONFIG.events,
      loveStory: parsed.loveStory || DEFAULT_WEDDING_CONFIG.loveStory,
      gifts: parsed.gifts || DEFAULT_WEDDING_CONFIG.gifts,
    };
  } catch (error) {
    console.error('Error reading wedding config, falling back to default:', error);
    return DEFAULT_WEDDING_CONFIG;
  }
}

export async function saveWeddingConfig(config: WeddingConfig): Promise<boolean> {
  try {
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');

    const tenantDir = path.join(
      process.cwd(),
      'data',
      'tenants',
      'inv-destia-rakafansa',
    );
    if (fs.existsSync(tenantDir)) {
      fs.writeFileSync(
        path.join(tenantDir, 'config.json'),
        JSON.stringify(config, null, 2),
        'utf-8',
      );
    }
    return true;
  } catch (error) {
    console.error('Error saving wedding config:', error);
    return false;
  }
}
