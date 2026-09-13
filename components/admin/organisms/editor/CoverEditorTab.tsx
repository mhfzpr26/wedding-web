'use client';

import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import MovieFilterRoundedIcon from '@mui/icons-material/MovieFilterRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';

export const CoverEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);
  const showToast = useAdminStore((s) => s.showToast);

  if (!config) return null;

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onSuccess(data.url);
        showToast('success', `Foto cover ${file.name} berhasil diunggah!`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Gagal mengunggah foto cover');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat upload foto cover');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2.5,
                pb: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <MovieFilterRoundedIcon color="primary" />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Cover Hero (Layar Depan)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tampilan awal poster sinematik undangan saat pertama kali
                  dibuka.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Judul Utama Undangan"
                placeholder="Contoh: The Wedding of Romeo & Juliet"
                fullWidth
                size="small"
                value={config.cover?.title || ''}
                onChange={(e) =>
                  setConfig((prev) =>
                    prev
                      ? {
                          ...prev,
                          cover: {
                            ...prev.cover,
                            title: e.target.value,
                          },
                        }
                      : null,
                  )
                }
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <TextField
                    label="Badge / Label Acara"
                    placeholder="Contoh: The Wedding / WEDDING SPECIAL"
                    fullWidth
                    size="small"
                    value={config.cover?.seriesBadge || ''}
                    onChange={(e) =>
                      setConfig((prev) =>
                        prev
                          ? {
                              ...prev,
                              cover: {
                                ...prev.cover,
                                seriesBadge: e.target.value,
                              },
                            }
                          : null,
                      )
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    label="Tahun Acara"
                    placeholder="2026"
                    fullWidth
                    size="small"
                    value={config.cover?.year || ''}
                    onChange={(e) =>
                      setConfig((prev) =>
                        prev
                          ? {
                              ...prev,
                              cover: {
                                ...prev.cover,
                                year: e.target.value,
                              },
                            }
                          : null,
                      )
                    }
                  />
                </Grid>
              </Grid>

              <TextField
                label="Sinopsis Cover"
                placeholder="Deskripsi singkat atau ringkasan cerita pernikahan..."
                fullWidth
                multiline
                rows={3}
                size="small"
                value={config.cover?.synopsis || ''}
                onChange={(e) =>
                  setConfig((prev) =>
                    prev
                      ? {
                          ...prev,
                          cover: {
                            ...prev.cover,
                            synopsis: e.target.value,
                          },
                        }
                      : null,
                  )
                }
              />

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Background Poster Cover
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadRoundedIcon />}
                    sx={{
                      flexShrink: 0,
                      textTransform: 'none',
                      borderRadius: 2,
                    }}
                  >
                    Upload Cover
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        handleFileUpload(e, (url) =>
                          setConfig((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  cover: {
                                    ...prev.cover,
                                    bgImage: url,
                                  },
                                }
                              : null,
                          ),
                        )
                      }
                    />
                  </Button>
                  <TextField
                    placeholder="URL gambar poster cover..."
                    fullWidth
                    size="small"
                    value={config.cover?.bgImage || ''}
                    onChange={(e) =>
                      setConfig((prev) =>
                        prev
                          ? {
                              ...prev,
                              cover: {
                                ...prev.cover,
                                bgImage: e.target.value,
                              },
                            }
                          : null,
                      )
                    }
                  />
                </Box>
                {config.cover?.bgImage && (
                  <Box
                    sx={{
                      mt: 1.5,
                      height: 120,
                      borderRadius: 2,
                      overflow: 'hidden',
                      backgroundImage: `url(${config.cover.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, lg: 6 }}>
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            height: '100%',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2.5,
                pb: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <FormatQuoteRoundedIcon color="primary" sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Opening & Kutipan / Quote
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Salam pembuka, doa restu, ayat suci, atau kata mutiara
                  pernikahan.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Headline Opening / Salam Pembuka"
                placeholder="Contoh: Assalamu’alaikum / Destia & Rakafansa: / Dear Family & Friends"
                fullWidth
                size="small"
                value={config.opening?.title || ''}
                onChange={(e) =>
                  setConfig((prev) =>
                    prev
                      ? {
                          ...prev,
                          opening: {
                            ...prev.opening,
                            title: e.target.value,
                          },
                        }
                      : null,
                  )
                }
              />

              <TextField
                label="Subheadline Opening / Pesan Pengantar"
                placeholder="Contoh: Our Forever Chapter / Dengan memohon rahmat-Nya / You are cordially invited"
                fullWidth
                size="small"
                value={config.opening?.subtitle || ''}
                onChange={(e) =>
                  setConfig((prev) =>
                    prev
                      ? {
                          ...prev,
                          opening: {
                            ...prev.opening,
                            subtitle: e.target.value,
                          },
                        }
                      : null,
                  )
                }
              />

              {/* 1 Single Unified Field for Quote & Source */}
              <TextField
                label="Kutipan / Ayat Suci / Quotes"
                placeholder="Tuliskan kutipan ayat suci, kata mutiara, doa pernikahan, atau pesan romantis beserta sumbernya di sini..."
                fullWidth
                multiline
                rows={5}
                size="small"
                helperText="1 Kolom Fleksibel: dapat diisi ayat suci (Al-Qur'an, Alkitab, dll), doa, atau puisi cinta beserta sumber/penulisnya langsung."
                value={
                  config.opening?.quoteSource &&
                  config.opening?.quote &&
                  !config.opening.quote.includes(config.opening.quoteSource)
                    ? `${config.opening.quote}\n\n— ${config.opening.quoteSource}`
                    : config.opening?.quote || ''
                }
                onChange={(e) => {
                  const val = e.target.value;
                  setConfig((prev) =>
                    prev
                      ? {
                          ...prev,
                          opening: {
                            ...prev.opening,
                            quote: val,
                            quoteSource: '',
                          },
                        }
                      : null,
                  );
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
