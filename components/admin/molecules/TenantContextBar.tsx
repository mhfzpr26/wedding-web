'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import { useAdminStore } from '@/stores/useAdminStore';
import type { InvitationStatus } from '@/types/wedding';

const statusConfig: Record<
  InvitationStatus,
  { label: string; color: 'warning' | 'success' | 'default' }
> = {
  draft: { label: 'Draft', color: 'warning' },
  published: { label: 'Published', color: 'success' },
  inactive: { label: 'Nonaktif', color: 'default' },
};

export const TenantContextBar: React.FC = () => {
  const invitations = useAdminStore((s) => s.invitations);
  const selectedInvitationId = useAdminStore((s) => s.selectedInvitationId);
  const setSelectedInvitationId = useAdminStore(
    (s) => s.setSelectedInvitationId,
  );
  const setPrimaryTab = useAdminStore((s) => s.setPrimaryTab);
  const editorSlug = useAdminStore((s) => s.editorSlug);
  const setEditorSlug = useAdminStore((s) => s.setEditorSlug);
  const editorStatus = useAdminStore((s) => s.editorStatus);
  const setEditorStatus = useAdminStore((s) => s.setEditorStatus);
  const saving = useAdminStore((s) => s.saving);
  const setSaving = useAdminStore((s) => s.setSaving);
  const showToast = useAdminStore((s) => s.showToast);
  const config = useAdminStore((s) => s.config);
  const setInvitations = useAdminStore((s) => s.setInvitations);

  const currentInvitation = invitations.find(
    (i) => i.id === selectedInvitationId,
  );
  const statusInfo = editorStatus ? statusConfig[editorStatus] : null;

  const [formMenuAnchor, setFormMenuAnchor] = useState<null | HTMLElement>(
    null,
  );

  const getPortalUrl = () => {
    const slug = editorSlug || currentInvitation?.slug || '';
    return `${window.location.origin}/portal/${slug}`;
  };

  const handleCopyPortalLink = () => {
    navigator.clipboard.writeText(getPortalUrl());
    showToast('success', 'Link portal klien berhasil disalin!');
    setFormMenuAnchor(null);
  };

  const handleSendViaWhatsApp = () => {
    const phone =
      currentInvitation?.client?.phone?.replace(/[^0-9]/g, '') || '';
    const waPhone = phone.startsWith('0') ? `62${phone.slice(1)}` : phone;
    const clientName = currentInvitation?.client?.name || 'Kak';
    const link = getPortalUrl();
    const msg = `Halo ${clientName}, berikut tautan portal pernikahan Anda untuk melengkapi data, menyebarkan undangan ke tamu via WhatsApp, dan memantau kehadiran:\n\n${link}\n\nTerima kasih! 🙏`;
    window.open(
      `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`,
      '_blank',
    );
    setFormMenuAnchor(null);
  };

  const handleUpdateStatus = async (newStatus: InvitationStatus) => {
    if (!selectedInvitationId) return;
    try {
      const res = await fetch(
        `/api/admin/saas/invitations/${selectedInvitationId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (res.ok) {
        setEditorStatus(newStatus);
        setInvitations((prev) =>
          prev.map((i) =>
            i.id === selectedInvitationId ? { ...i, status: newStatus } : i,
          ),
        );
        showToast('success', `Status diubah ke ${newStatus}`);
      }
    } catch {
      showToast('error', 'Gagal memperbarui status');
    }
  };

  const handleUpdateSlug = async (newSlug: string) => {
    if (!selectedInvitationId || !newSlug) return;
    try {
      const res = await fetch(
        `/api/admin/saas/invitations/${selectedInvitationId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: newSlug }),
        },
      );
      if (res.ok) {
        const updated = await res.json();
        setEditorSlug(updated.slug);
        setInvitations((prev) =>
          prev.map((i) =>
            i.id === selectedInvitationId ? { ...i, slug: updated.slug } : i,
          ),
        );
        showToast('success', `Slug diperbarui: /undangan/${updated.slug}`);
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Slug sudah digunakan');
      }
    } catch {
      showToast('error', 'Gagal memperbarui slug');
    }
  };

  const handleSaveConfig = async () => {
    if (!selectedInvitationId || !config) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/saas/invitations/${selectedInvitationId}/config`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        },
      );
      if (res.ok) {
        showToast('success', 'Konfigurasi berhasil disimpan!');
      } else {
        showToast('error', 'Gagal menyimpan perubahan');
      }
    } catch {
      showToast('error', 'Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper
      square
      elevation={0}
      sx={{
        px: { xs: 1.5, sm: 2, md: 3 },
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        flexWrap: 'wrap',
        bgcolor: 'background.paper',
      }}
    >
      {/* Left: Back + Title */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexGrow: 1,
          minWidth: { xs: '100%', sm: 200 },
        }}
      >
        <Tooltip title="Kembali ke Dashboard">
          <IconButton
            size="small"
            onClick={() => setPrimaryTab('dashboard')}
            sx={{
              color: 'text.secondary',
              bgcolor: 'action.hover',
              borderRadius: 1.5,
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.light',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              display: 'block',
              lineHeight: 1,
              mb: 0.3,
            }}
          >
            <EditIcon sx={{ fontSize: 10, mr: 0.4 }} /> Sedang Menyunting
          </Typography>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}
          >
            {currentInvitation?.title || 'Pilih Undangan'}
          </Typography>
        </Box>
        {statusInfo && (
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.68rem',
              height: 20,
              flexShrink: 0,
            }}
          />
        )}
      </Box>

      {/* Right: Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          flexWrap: 'wrap',
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        {/* Invitation Switcher */}
        <Select
          size="small"
          value={selectedInvitationId ?? ''}
          onChange={(e) => setSelectedInvitationId(e.target.value)}
          displayEmpty
          sx={{
            width: { xs: '100%', sm: 180 },
            fontSize: '0.8125rem',
            bgcolor: 'background.default',
          }}
        >
          {invitations.map((i) => (
            <MenuItem key={i.id} value={i.id} sx={{ fontSize: '0.8125rem' }}>
              {i.title}
            </MenuItem>
          ))}
        </Select>

        {/* Slug Field */}
        <TextField
          size="small"
          value={editorSlug}
          onChange={(e) => setEditorSlug(e.target.value)}
          onBlur={(e) => handleUpdateSlug(e.target.value)}
          placeholder="slug-undangan"
          label="Slug URL"
          sx={{ width: { xs: 'calc(50% - 6px)', sm: 160 } }}
          slotProps={{
            input: {
              startAdornment: (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.disabled', mr: 0.3, whiteSpace: 'nowrap' }}
                >
                  /u/
                </Typography>
              ),
            },
          }}
        />

        {/* Status Select */}
        <Select
          size="small"
          value={editorStatus ?? 'draft'}
          onChange={(e) =>
            handleUpdateStatus(e.target.value as InvitationStatus)
          }
          sx={{
            width: { xs: 'calc(50% - 6px)', sm: 130 },
            fontSize: '0.8125rem',
            bgcolor: 'background.default',
          }}
        >
          <MenuItem value="draft" sx={{ fontSize: '0.8125rem' }}>
            🟡 Draft
          </MenuItem>
          <MenuItem value="published" sx={{ fontSize: '0.8125rem' }}>
            🟢 Published
          </MenuItem>
          <MenuItem value="inactive" sx={{ fontSize: '0.8125rem' }}>
            🔴 Nonaktif
          </MenuItem>
        </Select>

        <Box
          sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}
        >
          {/* Form Klien Button & Menu */}
          {currentInvitation && (
            <>
              <Tooltip title="Bagikan portal mandiri pengantin ke klien (isi data, sebar WA, rekap tamu)">
                <Button
                  variant="outlined"
                  size="small"
                  color="warning"
                  startIcon={<AssignmentIcon />}
                  onClick={(e) => setFormMenuAnchor(e.currentTarget)}
                  sx={{ flex: { xs: 1, sm: 'initial' }, borderRadius: 1.5 }}
                >
                  Portal Klien
                </Button>
              </Tooltip>
              <Menu
                anchorEl={formMenuAnchor}
                open={Boolean(formMenuAnchor)}
                onClose={() => setFormMenuAnchor(null)}
                slotProps={{
                  paper: {
                    sx: {
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 10px 15px -3px rgba(15,23,42,0.08)',
                      minWidth: 220,
                    },
                  },
                }}
              >
                <MenuItem onClick={handleCopyPortalLink}>
                  <ListItemIcon>
                    <ContentCopyIcon
                      fontSize="small"
                      sx={{ color: 'primary.main' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Salin Link Portal"
                    secondary="Untuk dikirim ke pengantin"
                  />
                </MenuItem>
                <MenuItem onClick={handleSendViaWhatsApp}>
                  <ListItemIcon>
                    <WhatsAppIcon fontSize="small" sx={{ color: '#25d366' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Kirim Portal via WhatsApp"
                    secondary="Template pesan otomatis"
                  />
                </MenuItem>
                <MenuItem
                  component={Link}
                  href={`/portal/${editorSlug || currentInvitation.slug}`}
                  target="_blank"
                  onClick={() => setFormMenuAnchor(null)}
                >
                  <ListItemIcon>
                    <OpenInNewIcon
                      fontSize="small"
                      sx={{ color: 'text.secondary' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Buka Portal Pengantin"
                    secondary="Tampilan layar pengantin"
                  />
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Preview Live */}
          {currentInvitation && (
            <Tooltip
              title={`Preview: /undangan/${editorSlug || currentInvitation.slug}`}
            >
              <Button
                component={Link}
                href={`/undangan/${editorSlug || currentInvitation.slug}`}
                target="_blank"
                variant="outlined"
                size="small"
                startIcon={<VisibilityIcon />}
                sx={{ flex: { xs: 1, sm: 'initial' }, borderRadius: 1.5 }}
              >
                Preview
              </Button>
            </Tooltip>
          )}

          {/* Save */}
          <Button
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
            onClick={handleSaveConfig}
            disabled={saving || !config}
            sx={{
              flex: { xs: 1, sm: 'initial' },
              borderRadius: 1.5,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
              boxShadow: '0 3px 12px rgba(124, 58, 237, 0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #6d28d9 0%, #0891b2 100%)',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.35)',
              },
            }}
          >
            {saving ? 'Menyimpan…' : 'Simpan'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
