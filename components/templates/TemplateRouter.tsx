'use client';

import type React from 'react';
import type { WeddingConfig } from '@/types/wedding';
import { getTemplate } from './registry';

export interface TemplateRouterProps {
  config: WeddingConfig;
  guestName?: string;
  invitationSlug?: string;
}

export const TemplateRouter: React.FC<TemplateRouterProps> = ({
  config,
  guestName = '',
  invitationSlug = '',
}) => {
  const selectedTemplate = getTemplate(config.templateId);
  const TemplateComponent = selectedTemplate.component;

  return (
    <TemplateComponent
      config={config}
      guestName={guestName}
      invitationSlug={invitationSlug}
    />
  );
};
