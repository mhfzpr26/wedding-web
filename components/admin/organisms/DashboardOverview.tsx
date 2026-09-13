'use client';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LayersIcon from '@mui/icons-material/Layers';
import PeopleIcon from '@mui/icons-material/People';
import TuneIcon from '@mui/icons-material/Tune';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type React from 'react';
import { KpiCard } from '@/components/admin/molecules/KpiCard';
import { useAdminStore } from '@/stores/useAdminStore';
import type { InvitationStatus } from '@/types/wedding';

export const DashboardOverview: React.FC = () => {
  const clients = useAdminStore((s) => s.clients);
  const invitations = useAdminStore((s) => s.invitations);
  const setInvitations = useAdminStore((s) => s.setInvitations);
  const stats = useAdminStore((s) => s.stats);
  const setShowCreateInvModal = useAdminStore((s) => s.setShowCreateInvModal);
  const setDeleteConfirm = useAdminStore((s) => s.setDeleteConfirm);
  const openEditorForInvitation = useAdminStore(
    (s) => s.openEditorForInvitation,
  );
  const showToast = useAdminStore((s) => s.showToast);

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/undangan/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    showToast('success', `Tautan disalin: ${fullUrl}`);
  };

  const handleUpdateStatus = async (
    invId: string,
    newStatus: InvitationStatus,
  ) => {
    try {
      const res = await fetch(`/api/admin/saas/invitations/${invId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInvitations((prev) =>
          prev.map((i) => (i.id === invId ? { ...i, status: newStatus } : i)),
        );
        showToast('success', `Status diubah ke ${newStatus}`);
      }
    } catch {
      showToast('error', 'Gagal memperbarui status');
    }
  };

  return (
    <Box>
      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Total Client"
            value={stats?.totalClients ?? clients.length}
            sub="Client terdaftar"
            Icon={PeopleIcon}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Undangan Aktif"
            value={
              stats?.publishedCount ??
              invitations.filter((i) => i.status === 'published').length
            }
            sub="Live & dapat diakses publik"
            Icon={CheckCircleIcon}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Undangan Draft"
            value={
              stats?.draftCount ??
              invitations.filter((i) => i.status === 'draft').length
            }
            sub="Sedang disunting"
            Icon={EditIcon}
            color="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard
            label="Total RSVP Tamu"
            value={stats?.totalRsvps ?? 0}
            sub="Seluruh undangan"
            Icon={HowToRegIcon}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Invitations Table */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentTurnedInIcon
                sx={{ color: 'primary.light', fontSize: 20 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontSize: '1rem' }}
              >
                Seluruh Undangan Client
              </Typography>
            </Box>
          }
          subheader="Kelola status, preview, dan konten setiap undangan dari satu panel terpusat"
          action={
            <Button
              variant="contained"
              size="small"
              startIcon={<AddCircleIcon />}
              onClick={() => setShowCreateInvModal(true)}
              sx={{ width: { xs: '100%', sm: 'auto' }, whiteSpace: 'nowrap' }}
            >
              Buat Undangan
            </Button>
          }
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 1.5,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1, sm: 0 },
            '& .MuiCardHeader-action': {
              marginTop: { xs: 1, sm: 0 },
              marginRight: 0,
              alignSelf: { xs: 'stretch', sm: 'auto' },
            },
            '& .MuiCardHeader-subheader': {
              fontSize: '0.78rem',
              color: 'text.secondary',
              mt: 0.3,
            },
          }}
        />

        {invitations.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <LayersIcon
              sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Belum ada undangan. Klik "Buat Undangan" untuk memulai.
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ bgcolor: 'transparent' }}
          >
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Judul Undangan</TableCell>
                  <TableCell>Template</TableCell>
                  <TableCell>Slug / URL</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">RSVP</TableCell>
                  <TableCell align="right">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invitations.map((inv) => {
                  return (
                    <TableRow key={inv.id}>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: 'text.primary' }}
                        >
                          {inv.client?.name || 'Client Umum'}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.disabled' }}
                        >
                          {inv.client?.package || 'Standard'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: 'text.primary' }}
                        >
                          {inv.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.disabled' }}
                        >
                          {inv.eventDate ?? '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={inv.templateId.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(99,102,241,0.12)',
                            color: 'primary.light',
                            fontWeight: 700,
                            fontSize: '0.66rem',
                            border: '1px solid rgba(99,102,241,0.25)',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Box
                            component="code"
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.05)',
                              px: 0.8,
                              py: 0.2,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              color: 'text.secondary',
                              fontFamily: 'monospace',
                            }}
                          >
                            /u/{inv.slug}
                          </Box>
                          <Tooltip title="Salin tautan">
                            <IconButton
                              size="small"
                              onClick={() => handleCopyLink(inv.slug)}
                              sx={{ p: 0.3 }}
                            >
                              <ContentCopyIcon
                                sx={{ fontSize: 13, color: 'text.disabled' }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={inv.status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              inv.id,
                              e.target.value as InvitationStatus,
                            )
                          }
                          sx={{
                            fontSize: '0.78rem',
                            minWidth: 120,
                            bgcolor: 'background.default',
                          }}
                        >
                          <MenuItem value="draft" sx={{ fontSize: '0.8rem' }}>
                            🟡 Draft
                          </MenuItem>
                          <MenuItem
                            value="published"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            🟢 Published
                          </MenuItem>
                          <MenuItem
                            value="inactive"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            🔴 Nonaktif
                          </MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {inv.rsvpsCount ?? 0}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'success.light' }}
                        >
                          {inv.attendingCount ?? 0} hadir
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                          }}
                        >
                          <Tooltip title="Studio Editor">
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<TuneIcon fontSize="small" />}
                              onClick={() => openEditorForInvitation(inv.id)}
                              sx={{ fontSize: '0.75rem', py: 0.4, px: 1.2 }}
                            >
                              Edit
                            </Button>
                          </Tooltip>
                          <Tooltip title="Preview live">
                            <IconButton
                              component={Link}
                              href={`/undangan/${inv.slug}`}
                              target="_blank"
                              size="small"
                              sx={{ color: 'text.secondary' }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus undangan">
                            <IconButton
                              size="small"
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'invitation',
                                  id: inv.id,
                                  title: inv.title,
                                })
                              }
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};
