'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useAdminStore } from '@/stores/useAdminStore';
import type { WeddingTimelineItem } from '@/types/wedding';

export const StoryEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);

  if (!config) return null;

  const handleAddStory = () => {
    const newItem: WeddingTimelineItem = {
      year: new Date().getFullYear().toString(),
      event: 'Momen Istimewa Baru',
      desc: 'Cerita momen perjalanan cinta kami...',
    };
    setConfig((prev) =>
      prev
        ? { ...prev, loveStory: [...(prev.loveStory || []), newItem] }
        : null,
    );
  };

  const handleRemoveStory = (index: number) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            loveStory: prev.loveStory.filter((_, i) => i !== index),
          }
        : null,
    );
  };

  const handleUpdateField = (
    index: number,
    field: keyof WeddingTimelineItem,
    val: string,
  ) => {
    const updated = [...config.loveStory];
    updated[index] = { ...updated[index], [field]: val };
    setConfig((prev) => (prev ? { ...prev, loveStory: updated } : null));
  };

  return (
    <Card
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3,
            pb: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <AutoStoriesRoundedIcon color="primary" />
              Linimasa Kisah Cinta (Love Story)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Milestone perjalanan cinta dari pertama kali bertemu hingga menuju
              hari bahagia pernikahan.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddStory}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              flexShrink: 0,
            }}
          >
            Tambah Momen
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {config.loveStory?.map((item, index) => (
            <Card
              key={item.id || `${item.year}-${item.event}-${index}`}
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                    pb: 1.5,
                    borderBottom: '1px dashed',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimelineRoundedIcon fontSize="small" color="action" />
                    <Chip
                      label={`Milestone #${index + 1}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                    />
                  </Box>
                  <Tooltip title="Hapus Momen Ini">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveStory(index)}
                      sx={{
                        border: '1px solid',
                        borderColor: 'error.light',
                        borderRadius: 1.5,
                      }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <TextField
                      label="Tahun / Waktu"
                      placeholder="2022"
                      fullWidth
                      size="small"
                      value={item.year}
                      onChange={(e) =>
                        handleUpdateField(index, 'year', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 9 }}>
                    <TextField
                      label="Judul Momen"
                      placeholder="Contoh: Pertama Kali Berjumpa di Kampus"
                      fullWidth
                      size="small"
                      value={item.event}
                      onChange={(e) =>
                        handleUpdateField(index, 'event', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Kisah / Cerita Singkat"
                      placeholder="Ceritakan momen indah tersebut..."
                      fullWidth
                      multiline
                      rows={2.5}
                      size="small"
                      value={item.desc}
                      onChange={(e) =>
                        handleUpdateField(index, 'desc', e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
