'use client';

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PeopleIcon from '@mui/icons-material/People';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { KpiCard } from '@/components/admin/molecules/KpiCard';
import { useAdminStore } from '@/stores/useAdminStore';

export const RsvpMonitorTab: React.FC = () => {
  const invitations = useAdminStore((s) => s.invitations);
  const selectedInvitationId = useAdminStore((s) => s.selectedInvitationId);
  const rsvps = useAdminStore((s) => s.rsvps);
  const rsvpStats = useAdminStore((s) => s.rsvpStats);

  const currentInvitation = invitations.find(
    (i) => i.id === selectedInvitationId,
  );

  return (
    <Box>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          💌 Monitor Kehadiran Tamu
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Data RSVP khusus undangan &quot;{currentInvitation?.title ?? '—'}
          &quot;
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard
            label="Total Respons"
            value={rsvpStats.totalResponses}
            Icon={AssignmentTurnedInIcon}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard
            label="Konfirmasi Hadir"
            value={rsvpStats.attendingCount}
            Icon={CheckCircleIcon}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard
            label="Tidak Hadir"
            value={rsvpStats.notAttendingCount}
            Icon={CancelIcon}
            color="error"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard
            label="Estimasi Tamu"
            value={rsvpStats.totalGuests}
            sub="total orang"
            Icon={PeopleIcon}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Table */}
      <Card>
        {rsvps.length === 0 ? (
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
            <HowToRegIcon
              sx={{ fontSize: 44, color: 'primary.main', opacity: 0.3 }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Belum ada konfirmasi kehadiran tamu untuk undangan ini.
            </Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ bgcolor: 'transparent' }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nama Tamu</TableCell>
                  <TableCell>Kehadiran</TableCell>
                  <TableCell align="center">Jumlah</TableCell>
                  <TableCell>Pesan / Doa</TableCell>
                  <TableCell>Waktu Submit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rsvps.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {r.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.attendance}
                        size="small"
                        color={r.attendance === 'Hadir' ? 'success' : 'error'}
                        sx={{ fontWeight: 700, fontSize: '0.7rem', height: 20 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {r.guestCount || 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary' }}
                      >
                        {r.notes || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.disabled' }}
                      >
                        {new Date(r.submittedAt).toLocaleString('id-ID')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
};
