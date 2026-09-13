'use client';

import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
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
import type { WeddingBankAccount } from '@/types/wedding';

export const GiftsEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);

  if (!config) return null;

  const handleAddGift = () => {
    const newGift: WeddingBankAccount = {
      id: `bank_${Date.now()}`,
      bank: 'BCA',
      number: '1234567890',
      owner: 'Nama Pemilik Rekening',
    };
    setConfig((prev) =>
      prev ? { ...prev, gifts: [...(prev.gifts || []), newGift] } : null,
    );
  };

  const handleRemoveGift = (index: number) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            gifts: prev.gifts.filter((_, i) => i !== index),
          }
        : null,
    );
  };

  const handleUpdateField = (
    index: number,
    field: keyof WeddingBankAccount,
    val: string,
  ) => {
    const updated = [...config.gifts];
    updated[index] = { ...updated[index], [field]: val };
    setConfig((prev) => (prev ? { ...prev, gifts: updated } : null));
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
              <CardGiftcardRoundedIcon color="primary" />
              Rekening Bank & Amplop Digital
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Nomor rekening bank atau e-wallet untuk kemudahan tanda kasih /
              kado digital dari para tamu undangan.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddGift}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              flexShrink: 0,
            }}
          >
            Tambah Rekening
          </Button>
        </Box>

        <Grid container spacing={2.5}>
          {config.gifts?.map((bank, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={bank.id || index}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
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
                      <AccountBalanceRoundedIcon
                        fontSize="small"
                        color="action"
                      />
                      <Chip
                        label={`Rekening #${index + 1}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                      />
                    </Box>
                    <Tooltip title="Hapus Rekening">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveGift(index)}
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

                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <TextField
                      label="Nama Bank / E-Wallet"
                      placeholder="Contoh: BCA, Mandiri, GoPay, OVO"
                      fullWidth
                      size="small"
                      value={bank.bank}
                      onChange={(e) =>
                        handleUpdateField(index, 'bank', e.target.value)
                      }
                    />
                    <TextField
                      label="Nomor Rekening / No. HP"
                      placeholder="Contoh: 1234567890"
                      fullWidth
                      size="small"
                      value={bank.number}
                      onChange={(e) =>
                        handleUpdateField(index, 'number', e.target.value)
                      }
                    />
                    <TextField
                      label="Atas Nama Pemilik Rekening"
                      placeholder="Contoh: Fulan bin Fulan"
                      fullWidth
                      size="small"
                      value={bank.owner}
                      onChange={(e) =>
                        handleUpdateField(index, 'owner', e.target.value)
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
