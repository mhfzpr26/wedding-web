'use client';

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CollectionsIcon from '@mui/icons-material/Collections';
import EventIcon from '@mui/icons-material/Event';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PaletteIcon from '@mui/icons-material/Palette';
import PeopleIcon from '@mui/icons-material/People';
import TimerIcon from '@mui/icons-material/Timer';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import type React from 'react';
import type { EditorTab } from '@/stores/useAdminStore';
import { useAdminStore } from '@/stores/useAdminStore';

interface TabConfig {
  id: EditorTab;
  label: string;
  icon: React.ReactNode;
}

const editorTabs: TabConfig[] = [
  { id: 'template', label: 'Template', icon: <PaletteIcon fontSize="small" /> },
  { id: 'cover', label: 'Cover', icon: <ImageIcon fontSize="small" /> },
  { id: 'couple', label: 'Pasangan', icon: <PeopleIcon fontSize="small" /> },
  { id: 'events', label: 'Acara', icon: <EventIcon fontSize="small" /> },
  { id: 'media', label: 'Media', icon: <MusicNoteIcon fontSize="small" /> },
  { id: 'countdown', label: 'Countdown', icon: <TimerIcon fontSize="small" /> },
  {
    id: 'gallery',
    label: 'Galeri',
    icon: <CollectionsIcon fontSize="small" />,
  },
  { id: 'story', label: 'Cerita', icon: <AutoStoriesIcon fontSize="small" /> },
  { id: 'gifts', label: 'Hadiah', icon: <CardGiftcardIcon fontSize="small" /> },
  { id: 'closing', label: 'Penutup', icon: <ChecklistIcon fontSize="small" /> },
  {
    id: 'rsvps',
    label: 'Monitor RSVP',
    icon: <AssignmentTurnedInIcon fontSize="small" />,
  },
];

export const EditorTabNavigation: React.FC = () => {
  const editorTab = useAdminStore((s) => s.editorTab);
  const setEditorTab = useAdminStore((s) => s.setEditorTab);

  const currentIndex = editorTabs.findIndex((t) => t.id === editorTab);

  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Tabs
        value={currentIndex === -1 ? 0 : currentIndex}
        onChange={(_, idx) => setEditorTab(editorTabs[idx].id)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          px: 1,
          '& .MuiTabs-scrollButtons': {
            color: 'text.secondary',
          },
        }}
      >
        {editorTabs.map((tab) => (
          <Tooltip key={tab.id} title={tab.label} placement="bottom" arrow>
            <Tab
              icon={<Box sx={{ mb: '0 !important' }}>{tab.icon}</Box>}
              iconPosition="start"
              label={tab.label}
              disableRipple={false}
              sx={{
                minHeight: 46,
                gap: 0.75,
                py: 1,
                px: 1.5,
                fontSize: '0.78rem',
              }}
            />
          </Tooltip>
        ))}
      </Tabs>
    </Box>
  );
};
