import type React from 'react';
import type { WeddingConfig } from '@/types/wedding';
import { InvitationTemplate } from './InvitationTemplate';

export interface TemplateProps {
  config: WeddingConfig;
  guestName?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  badge: string;
  description: string;
  component: React.FC<TemplateProps>;
  thumbnail: string;
  available: boolean;
}

export const TEMPLATE_REGISTRY: Record<string, TemplateDefinition> = {
  netflix: {
    id: 'netflix',
    name: 'Netflix Cinematic Experience',
    badge: 'Trending #1',
    description:
      'Gaya antarmuka sinematik terinspirasi platform streaming global dengan video teaser, poster hero, episode list acara, dan end credits roll.',
    component: InvitationTemplate,
    thumbnail: '/images/netflix-cover-bg.jpg',
    available: true,
  },
  floral: {
    id: 'floral',
    name: 'Floral Botanical Elegance',
    badge: 'Coming Soon',
    description:
      'Desain anggun bernuansa bunga botanikal, tipografi serif klasik, dan palet warna pastel yang lembut.',
    component: InvitationTemplate, // fallback to InvitationTemplate until built
    thumbnail: '/images/gallery-1.jpg',
    available: false,
  },
  minimalist: {
    id: 'minimalist',
    name: 'Modern Royal Minimalist',
    badge: 'Coming Soon',
    description:
      'Gaya kontemporer bersih dengan estetika monokrom emas, garis-garis presisi, dan tipografi modern.',
    component: InvitationTemplate,
    thumbnail: '/images/gallery-2.jpg',
    available: false,
  },
};

export const AVAILABLE_TEMPLATES = Object.values(TEMPLATE_REGISTRY);

export function getTemplate(id?: string): TemplateDefinition {
  if (id && TEMPLATE_REGISTRY[id]) {
    return TEMPLATE_REGISTRY[id];
  }
  return TEMPLATE_REGISTRY.netflix;
}
