'use client';

import TuneIcon from '@mui/icons-material/Tune';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { EditorCompletenessBar } from '@/components/admin/molecules/EditorCompletenessBar';
import { EditorTabNavigation } from '@/components/admin/molecules/EditorTabNavigation';
import { TenantContextBar } from '@/components/admin/molecules/TenantContextBar';
import { ClosingEditorTab } from '@/components/admin/organisms/editor/ClosingEditorTab';
import { CountdownEditorTab } from '@/components/admin/organisms/editor/CountdownEditorTab';
import { CoupleEditorTab } from '@/components/admin/organisms/editor/CoupleEditorTab';
import { CoverEditorTab } from '@/components/admin/organisms/editor/CoverEditorTab';
import { EventsEditorTab } from '@/components/admin/organisms/editor/EventsEditorTab';
import { GalleryEditorTab } from '@/components/admin/organisms/editor/GalleryEditorTab';
import { GiftsEditorTab } from '@/components/admin/organisms/editor/GiftsEditorTab';
import { MediaEditorTab } from '@/components/admin/organisms/editor/MediaEditorTab';
import { RsvpMonitorTab } from '@/components/admin/organisms/editor/RsvpMonitorTab';
import { StoryEditorTab } from '@/components/admin/organisms/editor/StoryEditorTab';
import { TemplateSelectorTab } from '@/components/admin/organisms/editor/TemplateSelectorTab';
import { useAdminStore } from '@/stores/useAdminStore';

export const StudioEditor: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const configLoading = useAdminStore((s) => s.configLoading);
  const editorTab = useAdminStore((s) => s.editorTab);

  return (
    <Box sx={{ mx: -3, mt: -3 }}>
      {/* Context Switcher Bar */}
      <TenantContextBar />

      {configLoading || !config ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress
            size={32}
            thickness={3}
            sx={{ color: 'primary.main' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TuneIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Memuat konfigurasi konten undangan…
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          {/* Status Kelengkapan Konten (Completeness Progress & Checklist) */}
          <EditorCompletenessBar />

          {/* Navigasi 2 Tingkat (4 Kategori Utama + Sub-Bagian) */}
          <EditorTabNavigation />

          {/* Active Tab Content Panel */}
          <Box sx={{ p: { xs: 2, md: 3 } }}>
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
          </Box>
        </>
      )}
    </Box>
  );
};
