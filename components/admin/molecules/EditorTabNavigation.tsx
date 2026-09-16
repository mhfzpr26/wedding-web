'use client';

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CollectionsIcon from '@mui/icons-material/Collections';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import EventIcon from '@mui/icons-material/Event';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PaletteIcon from '@mui/icons-material/Palette';
import PeopleIcon from '@mui/icons-material/People';
import TheatersRoundedIcon from '@mui/icons-material/TheatersRounded';
import TimerIcon from '@mui/icons-material/Timer';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useMemo } from 'react';
import { computeCompletenessItems } from '@/components/admin/molecules/EditorCompletenessBar';
import type { EditorTab } from '@/stores/useAdminStore';
import { useAdminStore } from '@/stores/useAdminStore';

type MainCategory = 'appearance' | 'schedule' | 'media' | 'interaction';

interface SubTabConfig {
  id: EditorTab;
  label: string;
  icon: React.ReactNode;
  hint: string;
}

interface MainCategoryConfig {
  id: MainCategory;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  subTabs: SubTabConfig[];
}

const CATEGORIES_CONFIG: MainCategoryConfig[] = [
  {
    id: 'appearance',
    label: '1. Tampilan & Pembuka',
    shortLabel: 'Tampilan',
    icon: <PaletteIcon fontSize="small" />,
    subTabs: [
      {
        id: 'template',
        label: 'Pilihan Desain',
        icon: <PaletteIcon sx={{ fontSize: 16 }} />,
        hint: 'Katalog tema & template',
      },
      {
        id: 'cover',
        label: 'Cover & Salam Pembuka',
        icon: <ImageIcon sx={{ fontSize: 16 }} />,
        hint: 'Poster depan, salam, & quotes',
      },
    ],
  },
  {
    id: 'schedule',
    label: '2. Mempelai & Acara',
    shortLabel: 'Mempelai & Acara',
    icon: <PeopleIcon fontSize="small" />,
    subTabs: [
      {
        id: 'couple',
        label: 'Profil Pasangan',
        icon: <PeopleIcon sx={{ fontSize: 16 }} />,
        hint: 'Mempelai & orang tua',
      },
      {
        id: 'events',
        label: 'Rangkaian Acara & Venue',
        icon: <EventIcon sx={{ fontSize: 16 }} />,
        hint: 'Akad, resepsi, foto venue & peta',
      },
      {
        id: 'countdown',
        label: 'Hitung Mundur',
        icon: <TimerIcon sx={{ fontSize: 16 }} />,
        hint: 'Waktu target momen akad',
      },
      {
        id: 'story',
        label: 'Kisah Cinta (Love Story)',
        icon: <AutoStoriesIcon sx={{ fontSize: 16 }} />,
        hint: 'Linimasa milestone',
      },
    ],
  },
  {
    id: 'media',
    label: '3. Media & Dokumentasi',
    shortLabel: 'Media',
    icon: <TheatersRoundedIcon fontSize="small" />,
    subTabs: [
      {
        id: 'gallery',
        label: 'Galeri Foto Sinematik',
        icon: <CollectionsIcon sx={{ fontSize: 16 }} />,
        hint: 'Album foto & showcase',
      },
      {
        id: 'media',
        label: 'Musik, Trailer & Privasi',
        icon: <MusicNoteIcon sx={{ fontSize: 16 }} />,
        hint: 'Audio latar, video & mode syar’i',
      },
    ],
  },
  {
    id: 'interaction',
    label: '4. Interaksi & Tamu',
    shortLabel: 'Interaksi',
    icon: <VolunteerActivismRoundedIcon fontSize="small" />,
    subTabs: [
      {
        id: 'gifts',
        label: 'Rekening Hadiah',
        icon: <CardGiftcardIcon sx={{ fontSize: 16 }} />,
        hint: 'Amplop digital & transfer',
      },
      {
        id: 'closing',
        label: 'Pesan Penutup',
        icon: <ChecklistIcon sx={{ fontSize: 16 }} />,
        hint: 'Ucapan terima kasih & salam',
      },
      {
        id: 'rsvps',
        label: 'Monitor RSVP',
        icon: <AssignmentTurnedInIcon sx={{ fontSize: 16 }} />,
        hint: 'Buku tamu & kehadiran',
      },
    ],
  },
];

export const EditorTabNavigation: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const editorTab = useAdminStore((s) => s.editorTab);
  const setEditorTab = useAdminStore((s) => s.setEditorTab);

  // Compute checklist items for badge status
  const items = useMemo(() => computeCompletenessItems(config), [config]);

  // Determine which main category the active editorTab belongs to
  const activeCategory = useMemo(() => {
    for (const cat of CATEGORIES_CONFIG) {
      if (cat.subTabs.some((sub) => sub.id === editorTab)) {
        return cat.id;
      }
    }
    return 'appearance';
  }, [editorTab]);

  const activeCategoryConfig = useMemo(() => {
    return (
      CATEGORIES_CONFIG.find((c) => c.id === activeCategory) ||
      CATEGORIES_CONFIG[0]
    );
  }, [activeCategory]);

  const handleSelectCategory = (cat: MainCategoryConfig) => {
    // If the active editorTab is already in this category, do nothing
    if (cat.subTabs.some((sub) => sub.id === editorTab)) return;
    // Otherwise, select the first sub-tab of the chosen category
    setEditorTab(cat.subTabs[0].id);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* TIER 1: 4 Kategori Utama Berdesain Rapi */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {CATEGORIES_CONFIG.map((cat) => {
          const isActive = cat.id === activeCategory;

          // Check completeness for this category
          const categoryItems = items.filter((i) => i.category === cat.id);
          const isCategoryComplete =
            categoryItems.length > 0 &&
            categoryItems.every((i) => i.isComplete);
          const missingCount = categoryItems.filter(
            (i) => !i.isComplete,
          ).length;

          return (
            <Paper
              key={cat.id}
              onClick={() => handleSelectCategory(cat)}
              elevation={0}
              sx={{
                p: { xs: 1.5, md: 1.75 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                bgcolor: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                borderBottom: isActive ? '3px solid' : '3px solid transparent',
                borderColor: isActive ? 'primary.main' : 'transparent',
                borderRadius: 0,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isActive
                    ? 'rgba(99,102,241,0.1)'
                    : 'rgba(255,255,255,0.03)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isActive
                      ? 'primary.main'
                      : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#fff' : 'text.secondary',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{
                      fontWeight: isActive ? 700 : 600,
                      fontSize: { xs: '0.8rem', md: '0.85rem' },
                      color: isActive ? 'text.primary' : 'text.secondary',
                    }}
                  >
                    {cat.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{
                      fontSize: '0.68rem',
                      color: 'text.disabled',
                      display: { xs: 'none', lg: 'block' },
                    }}
                  >
                    {cat.subTabs.length} Sub-bagian
                  </Typography>
                </Box>
              </Box>

              {/* Status Badge */}
              <Box sx={{ ml: 1, flexShrink: 0 }}>
                {isCategoryComplete ? (
                  <Chip
                    icon={
                      <CheckCircleRoundedIcon
                        sx={{ fontSize: '13px !important' }}
                      />
                    }
                    label="Lengkap"
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      '& .MuiChip-label': { px: 0.5 },
                    }}
                  />
                ) : missingCount > 0 ? (
                  <Chip
                    icon={
                      <ErrorOutlineRoundedIcon
                        sx={{ fontSize: '13px !important' }}
                      />
                    }
                    label={`${missingCount}`}
                    size="small"
                    color="warning"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      '& .MuiChip-label': { px: 0.5 },
                    }}
                  />
                ) : null}
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* TIER 2: Sub-Navigation Pills untuk Kategori yang Aktif */}
      <Box
        sx={{
          px: { xs: 1.5, md: 3 },
          py: 1.25,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          overflowX: 'auto',
          bgcolor: 'rgba(255,255,255,0.01)',
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
          },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
            fontSize: '0.68rem',
            color: 'text.disabled',
            whiteSpace: 'nowrap',
            mr: 0.5,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          SUB-BAGIAN:
        </Typography>

        {activeCategoryConfig.subTabs.map((sub) => {
          const isSubActive = sub.id === editorTab;

          return (
            <Box
              key={sub.id}
              onClick={() => setEditorTab(sub.id)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.75,
                borderRadius: 2,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                bgcolor: isSubActive
                  ? 'primary.main'
                  : 'rgba(255,255,255,0.04)',
                color: isSubActive ? '#fff' : 'text.secondary',
                border: '1px solid',
                borderColor: isSubActive
                  ? 'primary.main'
                  : 'rgba(255,255,255,0.08)',
                boxShadow: isSubActive
                  ? '0 2px 8px rgba(99,102,241,0.35)'
                  : 'none',
                '&:hover': {
                  bgcolor: isSubActive
                    ? 'primary.main'
                    : 'rgba(255,255,255,0.08)',
                  color: isSubActive ? '#fff' : 'text.primary',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {sub.icon}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isSubActive ? 700 : 500,
                  fontSize: '0.78rem',
                  lineHeight: 1.2,
                }}
              >
                {sub.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
