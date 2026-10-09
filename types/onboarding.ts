export interface OnboardingCoupleData {
  groom: {
    fullName: string;
    callName: string;
    fatherName: string;
    motherName: string;
    childOrder: string; // e.g. "Putra pertama dari"
    instagram: string;
    photo: string;
    bio: string;
  };
  bride: {
    fullName: string;
    callName: string;
    fatherName: string;
    motherName: string;
    childOrder: string; // e.g. "Putri kedua dari"
    instagram: string;
    photo: string;
    bio: string;
  };
  coverPhoto: string;
}

export interface OnboardingEventDetail {
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "08:00"
  endTime: string; // e.g. "10:00" or "Selesai"
  venueName: string;
  address: string;
  mapUrl: string;
}

export interface OnboardingEventData {
  akad: OnboardingEventDetail;
  resepsi: OnboardingEventDetail;
  additionalEvents?: Array<{
    id?: string;
    title: string;
    date: string;
    time: string;
    venueName: string;
    address: string;
    mapUrl: string;
  }>;
}

export interface OnboardingStoryData {
  stories: Array<{
    id?: string;
    year: string;
    title: string;
    desc: string;
  }>;
  galleryPhotos: string[];
  videoUrl?: string;
}

export interface OnboardingGiftData {
  bankAccounts: Array<{
    id?: string;
    bank: string;
    number: string;
    owner: string;
  }>;
  qrisImage?: string;
  physicalGiftAddress?: {
    recipientName: string;
    phone: string;
    address: string;
  };
  musicTitle?: string;
  audioUrl?: string;
}

export interface OnboardingClosingData {
  quote: string;
  quoteSource: string;
  closingMessage: string;
}

export interface OnboardingFormData {
  couple: OnboardingCoupleData;
  events: OnboardingEventData;
  story: OnboardingStoryData;
  gift: OnboardingGiftData;
  closing: OnboardingClosingData;
}

import type { RsvpRecord } from '@/types/rsvp';
import type { WishRecord } from '@/types/wishes';

export interface OnboardingResponseData {
  invitation: {
    id: string;
    title: string;
    slug: string;
    status: string;
    eventDate: string;
    templateId: string;
  };
  client?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    package?: string;
  } | null;
  formData: OnboardingFormData;
  rsvps?: RsvpRecord[];
  wishes?: WishRecord[];
}
