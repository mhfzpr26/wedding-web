interface PersonParents {
  mother: string;
  father: string;
}

export interface WeddingBrideGroom {
  name: string;
  callname: string;
  characterRole?: string;
  bio?: string;
  instagram?: string;
  photo?: string;
  parents: PersonParents;
}

export interface WeddingCouple {
  bride: WeddingBrideGroom;
  groom: WeddingBrideGroom;
}

export interface WeddingEventItem {
  id: string;
  type: string; // 'AKAD NIKAH' | 'RESEPSI PERNIKAHAN' | etc.
  episodeNumber: number;
  title: string;
  duration: string;
  synopsis: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
  calendarUrl: string;
  venuePhoto?: string;
}

export interface WeddingCountdown {
  targetDate: string; // e.g. "2026-11-14T09:00:00+07:00"
  title?: string;
  calendarUrl?: string;
}

export interface WeddingCover {
  seriesBadge: string; // "A NETFLIX WEDDING SPECIAL"
  trendingRank: string; // "#1 in Weddings Today"
  title: string; // "DESTIA & RAKAFANSA"
  matchPercentage?: string; // e.g. "99% Match" (optional)
  year: string; // "2026"
  ratingBadge: string; // "SU / ALL AGES"
  qualityBadge?: string;
  synopsis: string;
  starring?: string; // "Destia Dwi Ramadhani & Rakafansa Saputra"
  bgImage: string; // "/images/netflix-cover-bg.jpg"
  calendarUrl?: string;
}

export interface WeddingOpening {
  posterImage: string; // "/images/gallery-1.jpg"
  statusBadge: string; // "COMING SOON"
  dateText: string; // "14 November 2026"
  title: string; // "Destia & Rakafansa:"
  subtitle: string; // "Our Forever Chapter"
  locationText: string; // "Masjid Agung Al-Barkah & Hotel Santika Premiere, Bekasi"
  quote: string;
  quoteSource: string; // "QS. AR-RUM : 21"
}

export interface WeddingTrailer {
  badge: string; // "EXCLUSIVE PREVIEW • TEASER FILM"
  title: string; // "WEDDING TRAILER"
  subtitle: string; // "Satu-satunya teaser film resmi perjalanan cinta Destia & Rakafansa menuju pelaminan."
  videoUrl: string; // "/videos/wedding-teaser.mp4"
  posterUrl: string; // "/images/gallery-1.jpg"
  duration: string; // "02:30 • 4K UHD"
  filmTitle: string; // "Destia & Rakafansa: The Journey"
}

export interface WeddingGalleryItem {
  id: string;
  src: string;
  title: string;
  category: 'prewedding' | 'lead' | 'venue';
  tag: string;
  aspect: 'portrait' | 'landscape' | 'square';
}

export interface WeddingTimelineItem {
  id?: string;
  year: string;
  event: string;
  desc: string;
  season?: string;
  duration?: string;
}

export interface WeddingBankAccount {
  id: string;
  bank: string;
  number: string;
  owner: string;
}

interface WeddingClosingCredit {
  role: string;
  name: string;
}

export interface WeddingClosing {
  badge: string; // "END CREDITS • CAST & CREW"
  title: string; // "SEE YOU AT THE PREMIERE"
  message: string;
  names: string; // "DESTIA & RAKAFANSA"
  dateLocation: string; // "14 NOVEMBER 2026 • BEKASI, INDONESIA"
  copyright: string;
  credits?: WeddingClosingCredit[];
}

export interface WeddingMusic {
  audioUrl: string;
  title: string;
  artist?: string;
  autoplay: boolean;
}

export interface WeddingPrivacyMode {
  noMedia?: boolean;
  groomInitial?: string;
  brideInitial?: string;
  coupleInitials?: string;
}

export interface WeddingConfig {
  templateId: string; // 'netflix'
  title: string;
  seoDescription: string;
  cover: WeddingCover;
  opening: WeddingOpening;
  trailer: WeddingTrailer;
  couple: WeddingCouple;
  gallery: WeddingGalleryItem[];
  loveStory: WeddingTimelineItem[];
  countdown: WeddingCountdown;
  events: WeddingEventItem[];
  gifts: WeddingBankAccount[];
  closing: WeddingClosing;
  music: WeddingMusic;
  privacyMode?: WeddingPrivacyMode;
}

export type InvitationStatus = 'draft' | 'published' | 'inactive';

export interface ClientRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  package: string;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface InvitationRecord {
  id: string;
  clientId: string;
  title: string;
  slug: string;
  templateId: string;
  status: InvitationStatus;
  eventDate: string;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
    phone?: string;
    package?: string;
  } | null;
  rsvpsCount?: number;
  attendingCount?: number;
}

export interface SaasStats {
  totalClients: number;
  totalInvitations: number;
  publishedCount: number;
  draftCount: number;
  inactiveCount: number;
  totalTemplates: number;
  totalRsvps: number;
}
