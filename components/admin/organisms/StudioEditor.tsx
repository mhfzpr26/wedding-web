'use client';

import type React from 'react';
import MovieIcon from '@mui/icons-material/Movie';
import { useAdminStore } from '@/stores/useAdminStore';
import { TenantContextBar } from '@/components/admin/molecules/TenantContextBar';
import { EditorTabNavigation } from '@/components/admin/molecules/EditorTabNavigation';
import { TemplateSelectorTab } from '@/components/admin/organisms/editor/TemplateSelectorTab';
import { CoupleEditorTab } from '@/components/admin/organisms/editor/CoupleEditorTab';
import { EventsEditorTab } from '@/components/admin/organisms/editor/EventsEditorTab';
import { MediaEditorTab } from '@/components/admin/organisms/editor/MediaEditorTab';
import { CoverEditorTab } from '@/components/admin/organisms/editor/CoverEditorTab';
import { CountdownEditorTab } from '@/components/admin/organisms/editor/CountdownEditorTab';
import { GalleryEditorTab } from '@/components/admin/organisms/editor/GalleryEditorTab';
import { StoryEditorTab } from '@/components/admin/organisms/editor/StoryEditorTab';
import { GiftsEditorTab } from '@/components/admin/organisms/editor/GiftsEditorTab';
import { ClosingEditorTab } from '@/components/admin/organisms/editor/ClosingEditorTab';
import { RsvpMonitorTab } from '@/components/admin/organisms/editor/RsvpMonitorTab';

export const StudioEditor: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const configLoading = useAdminStore((s) => s.configLoading);
  const editorTab = useAdminStore((s) => s.editorTab);

  return (
    <div>
      {/* Top Editor Context Switcher Bar */}
      <TenantContextBar />

      {configLoading || !config ? (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem 0',
            color: 'var(--admin-text-secondary)',
          }}
        >
          <MovieIcon
            style={{
              fontSize: '3rem',
              opacity: 0.3,
              animation: 'spin 2s linear infinite',
            }}
          />
          <p style={{ marginTop: '1rem' }}>
            Memuat data konfigurasi tenant undangan...
          </p>
        </div>
      ) : (
        <>
          {/* 11 Navigation Tabs for Content Studio */}
          <EditorTabNavigation />

          {/* Active Sub-tab Organism */}
          {editorTab === 'template' && <TemplateSelectorTab />}
          {editorTab === 'couple' && <CoupleEditorTab />}
          {editorTab === 'events' && <EventsEditorTab />}
          {editorTab === 'media' && <MediaEditorTab />}
          {editorTab === 'cover' && <CoverEditorTab />}
          {editorTab === 'countdown' && <CountdownEditorTab />}
          {editorTab === 'gallery' && <GalleryEditorTab />}
          {editorTab === 'story' && <StoryEditorTab />}
          {editorTab === 'gifts' && <GiftsEditorTab />}
          {editorTab === 'closing' && <ClosingEditorTab />}
          {editorTab === 'rsvps' && <RsvpMonitorTab />}
        </>
      )}
    </div>
  );
};
