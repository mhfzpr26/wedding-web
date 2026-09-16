'use client';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useMemo, useState } from 'react';
import type { EditorTab } from '@/stores/useAdminStore';
import { useAdminStore } from '@/stores/useAdminStore';
import type { WeddingConfig } from '@/types/wedding';

export interface CompletenessItem {
  id: string;
  category: 'appearance' | 'schedule' | 'media' | 'interaction';
  categoryLabel: string;
  tabId: EditorTab;
  title: string;
  description: string;
  isComplete: boolean;
}

export function computeCompletenessItems(
  config: WeddingConfig | null,
): CompletenessItem[] {
  if (!config) return [];

  const isPrivacy = !!config.privacyMode?.noMedia;

  return [
    // 1. Appearance & Opening
    {
      id: 'cover_title',
      category: 'appearance',
      categoryLabel: 'Tampilan & Pembuka',
      tabId: 'cover',
      title: 'Judul Utama Cover',
      description: 'Judul poster film undangan di layar pertama',
      isComplete: Boolean(config.cover?.title?.trim()),
    },
    {
      id: 'cover_bg',
      category: 'appearance',
      categoryLabel: 'Tampilan & Pembuka',
      tabId: 'cover',
      title: 'Foto / Background Cover',
      description: 'Latar gambar poster cover depan',
      isComplete: Boolean(config.cover?.bgImage?.trim()),
    },
    {
      id: 'opening_quote',
      category: 'appearance',
      categoryLabel: 'Tampilan & Pembuka',
      tabId: 'cover',
      title: 'Salam & Kutipan / Ayat Suci',
      description: 'Pesan pengantar dan kutipan doa restu',
      isComplete: Boolean(config.opening?.quote?.trim()),
    },

    // 2. Schedule & Couple
    {
      id: 'couple_groom',
      category: 'schedule',
      categoryLabel: 'Mempelai & Acara',
      tabId: 'couple',
      title: 'Data Mempelai Pria',
      description: 'Nama lengkap & nama orang tua pengantin pria',
      isComplete: Boolean(
        config.couple?.groom?.name?.trim() &&
          config.couple?.groom?.parents?.father?.trim(),
      ),
    },
    {
      id: 'couple_bride',
      category: 'schedule',
      categoryLabel: 'Mempelai & Acara',
      tabId: 'couple',
      title: 'Data Mempelai Wanita',
      description: 'Nama lengkap & nama orang tua pengantin wanita',
      isComplete: Boolean(
        config.couple?.bride?.name?.trim() &&
          config.couple?.bride?.parents?.father?.trim(),
      ),
    },
    {
      id: 'couple_photos',
      category: 'schedule',
      categoryLabel: 'Mempelai & Acara',
      tabId: 'couple',
      title: 'Foto Profil Mempelai / Monogram',
      description: 'Foto potret kedua mempelai atau monogram inisial aktif',
      isComplete:
        isPrivacy ||
        Boolean(
          config.couple?.groom?.photo?.trim() &&
            config.couple?.bride?.photo?.trim(),
        ),
    },
    {
      id: 'events_data',
      category: 'schedule',
      categoryLabel: 'Mempelai & Acara',
      tabId: 'events',
      title: 'Jadwal & Lokasi Acara (Akad / Resepsi)',
      description:
        'Minimal 1 sesi acara dengan tanggal, waktu, dan nama tempat',
      isComplete: Boolean(
        config.events?.length > 0 &&
          config.events.every(
            (ev) => ev.venue?.trim() && ev.date?.trim() && ev.time?.trim(),
          ),
      ),
    },
    {
      id: 'countdown_date',
      category: 'schedule',
      categoryLabel: 'Mempelai & Acara',
      tabId: 'countdown',
      title: 'Target Waktu Hitung Mundur',
      description: 'Waktu tanggal dan jam mulai acara utama',
      isComplete: Boolean(config.countdown?.targetDate?.trim()),
    },
    {
      id: 'love_story',
      category: 'schedule',
      categoryLabel: 'Mempelai & Acara',
      tabId: 'story',
      title: 'Linimasa Kisah Cinta (Love Story)',
      description: 'Minimal 1 momen perjalanan cinta',
      isComplete: Boolean(config.loveStory?.length > 0),
    },

    // 3. Media & Showcase
    {
      id: 'media_music',
      category: 'media',
      categoryLabel: 'Media & Dokumentasi',
      tabId: 'media',
      title: 'Musik Latar Undangan',
      description: 'File audio / lagu latar undangan',
      isComplete: Boolean(config.music?.audioUrl?.trim()),
    },
    {
      id: 'media_gallery',
      category: 'media',
      categoryLabel: 'Media & Dokumentasi',
      tabId: 'gallery',
      title: 'Album Galeri Foto Sinematik',
      description: 'Koleksi foto album (atau mode syar’i aktif)',
      isComplete: isPrivacy || Boolean(config.gallery?.length > 0),
    },

    // 4. Interaction & Guests
    {
      id: 'gifts_account',
      category: 'interaction',
      categoryLabel: 'Interaksi & Tamu',
      tabId: 'gifts',
      title: 'Rekening Hadiah / Angpao Digital',
      description: 'Minimal 1 nomor rekening atau dompet digital',
      isComplete: Boolean(
        config.gifts?.length > 0 &&
          config.gifts.some((g) => g.number?.trim() && g.bank?.trim()),
      ),
    },
    {
      id: 'closing_message',
      category: 'interaction',
      categoryLabel: 'Interaksi & Tamu',
      tabId: 'closing',
      title: 'Salam & Pesan Penutup',
      description: 'Kalimat terima kasih dan permohonan doa restu',
      isComplete: Boolean(config.closing?.message?.trim()),
    },
  ];
}

export const EditorCompletenessBar: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setEditorTab = useAdminStore((s) => s.setEditorTab);

  const [dialogOpen, setDialogOpen] = useState(false);

  const items = useMemo(() => computeCompletenessItems(config), [config]);

  const total = items.length;
  const completed = items.filter((i) => i.isComplete).length;
  const missingItems = items.filter((i) => !i.isComplete);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const isAllComplete = percentage === 100;
  const isGoodProgress = percentage >= 75;

  const handleJumpToTab = (tab: EditorTab) => {
    setEditorTab(tab);
    setDialogOpen(false);
  };

  if (!config) return null;

  return (
    <>
      {/* Top Banner Bar */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'rgba(255,255,255,0.015)',
          px: { xs: 2, md: 3 },
          py: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {/* Left: Progress info */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.75,
              flex: 1,
              minWidth: 260,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isAllComplete
                  ? 'rgba(46,125,50,0.15)'
                  : isGoodProgress
                    ? 'rgba(99,102,241,0.15)'
                    : 'rgba(237,108,2,0.15)',
                color: isAllComplete
                  ? 'success.main'
                  : isGoodProgress
                    ? 'primary.main'
                    : 'warning.main',
              }}
            >
              {isAllComplete ? (
                <CheckCircleRoundedIcon fontSize="small" />
              ) : isGoodProgress ? (
                <TaskAltRoundedIcon fontSize="small" />
              ) : (
                <WarningAmberRoundedIcon fontSize="small" />
              )}
            </Box>

            <Box sx={{ flex: 1, maxWidth: 450 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: '0.78rem',
                  }}
                >
                  {isAllComplete
                    ? '🎉 Semua Data Lengkap (Siap Publikasi)'
                    : `Kelengkapan Konten: ${percentage}% Terisi`}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                  {completed}/{total} Bagian
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage}
                color={
                  isAllComplete
                    ? 'success'
                    : isGoodProgress
                      ? 'primary'
                      : 'warning'
                }
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.08)',
                }}
              />
            </Box>
          </Box>

          {/* Right: Quick actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isAllComplete && (
              <Chip
                label={`${missingItems.length} Perlu Dilengkapi`}
                size="small"
                color="warning"
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
              />
            )}
            <Button
              variant="outlined"
              size="small"
              startIcon={<TaskAltRoundedIcon fontSize="small" />}
              onClick={() => setDialogOpen(true)}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.78rem',
              }}
            >
              Checklist Data
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Modal / Dialog Checklist Kelengkapan */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <TaskAltRoundedIcon color="primary" />
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, fontSize: '1.05rem' }}
              >
                Checklist Kelengkapan Undangan
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {completed} dari {total} data telah terisi ({percentage}%)
              </Typography>
            </Box>
          </Box>
          <Chip
            label={
              isAllComplete ? 'LENGKAP' : `${missingItems.length} BELUM LENGKAP`
            }
            color={isAllComplete ? 'success' : 'warning'}
            size="small"
            sx={{ fontWeight: 800, fontSize: '0.7rem' }}
          />
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          {/* Missing items first if any */}
          {missingItems.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: 'warning.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 1.5,
                }}
              >
                <ErrorOutlineRoundedIcon sx={{ fontSize: 16 }} /> Bagian Yang
                Perlu Dilengkapi:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {missingItems.map((item) => (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      borderColor: 'warning.dark',
                      bgcolor: 'rgba(237,108,2,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 0.25,
                        }}
                      >
                        <Chip
                          label={item.categoryLabel}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 20,
                            bgcolor: 'rgba(255,255,255,0.06)',
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, fontSize: '0.85rem' }}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      endIcon={<LaunchRoundedIcon sx={{ fontSize: 14 }} />}
                      onClick={() => handleJumpToTab(item.tabId)}
                      sx={{
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: 1.5,
                        flexShrink: 0,
                      }}
                    >
                      Lengkapi
                    </Button>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          {/* Completed items */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                color: 'success.main',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 1.5,
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 16 }} /> Bagian Yang Sudah
              Lengkap ({completed}):
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {items
                .filter((i) => i.isComplete)
                .map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: 1.25,
                      borderRadius: 1.5,
                      bgcolor: 'rgba(255,255,255,0.02)',
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleRoundedIcon
                        sx={{
                          fontSize: 18,
                          color: 'success.main',
                          flexShrink: 0,
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, fontSize: '0.82rem' }}
                        >
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.categoryLabel}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleJumpToTab(item.tabId)}
                      sx={{ color: 'text.secondary' }}
                    >
                      <LaunchRoundedIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Box>
                ))}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
