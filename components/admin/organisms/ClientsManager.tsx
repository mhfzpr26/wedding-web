'use client';

import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type React from 'react';
import { useState } from 'react';
import { type ClientWithInvs, useAdminStore } from '@/stores/useAdminStore';

export const ClientsManager: React.FC = () => {
  const [search, setSearch] = useState('');
  const clients = useAdminStore((s) => s.clients);
  const setClientForm = useAdminStore((s) => s.setClientForm);
  const setShowClientModal = useAdminStore((s) => s.setShowClientModal);
  const setCreateInvForm = useAdminStore((s) => s.setCreateInvForm);
  const setShowCreateInvModal = useAdminStore((s) => s.setShowCreateInvModal);
  const setDeleteConfirm = useAdminStore((s) => s.setDeleteConfirm);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenAdd = () => {
    setClientForm({
      id: '',
      name: '',
      phone: '',
      email: '',
      package: 'Standard',
      notes: '',
      status: 'active',
    });
    setShowClientModal(true);
  };

  const handleOpenEdit = (client: ClientWithInvs) => {
    setClientForm({
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email || '',
      package: client.package || 'Standard',
      notes: client.notes || '',
      status: client.status,
    });
    setShowClientModal(true);
  };

  const handleCreateInvForClient = (clientId: string, clientName: string) => {
    const slug = clientName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    setCreateInvForm({
      clientId,
      title: `${clientName} | The Wedding`,
      slug,
      templateId: 'netflix',
      status: 'draft',
      eventDate: new Date().toISOString().split('T')[0],
    });
    setShowCreateInvModal(true);
  };

  const initials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ color: 'primary.light', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
              CRM Pengelolaan Client
            </Typography>
          </Box>
        }
        subheader="Data pemesan undangan, paket, dan kontak WhatsApp untuk koordinasi cepat"
        action={
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <TextField
              size="small"
              placeholder="Cari client…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ fontSize: 16, color: 'text.disabled' }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ width: { xs: '100%', sm: 200 } }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Tambah Client
            </Button>
          </Box>
        }
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1.5,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          gap: { xs: 1.5, sm: 0 },
          '& .MuiCardHeader-action': {
            marginTop: { xs: 1, sm: 0 },
            marginRight: 0,
            alignSelf: { xs: 'stretch', sm: 'flex-start' },
          },
          '& .MuiCardHeader-subheader': {
            fontSize: '0.78rem',
            color: 'text.secondary',
            mt: 0.3,
          },
        }}
      />

      {filtered.length === 0 ? (
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
          <PeopleIcon
            sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {search
              ? `Tidak ada client cocok dengan "${search}"`
              : 'Belum ada data client.'}
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ bgcolor: 'transparent' }}
        >
          <Table size="small" sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Client / PIC</TableCell>
                <TableCell>Kontak</TableCell>
                <TableCell>Paket</TableCell>
                <TableCell align="center">Undangan</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((client) => {
                const cleanPhone = client.phone.replace(/[^0-9]/g, '');
                const waPhone = cleanPhone.startsWith('0')
                  ? `62${cleanPhone.slice(1)}`
                  : cleanPhone;

                return (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            bgcolor: 'rgba(99,102,241,0.2)',
                            color: 'primary.light',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                          }}
                        >
                          {initials(client.name)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: 'text.primary' }}
                          >
                            {client.name}
                          </Typography>
                          {client.notes && (
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.disabled' }}
                            >
                              {client.notes}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.3,
                        }}
                      >
                        <Tooltip title={`Chat WhatsApp: ${client.phone}`}>
                          <Button
                            component="a"
                            href={`https://wa.me/${waPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            startIcon={<WhatsAppIcon fontSize="small" />}
                            sx={{
                              color: '#25d366',
                              bgcolor: 'rgba(37,211,102,0.08)',
                              border: '1px solid rgba(37,211,102,0.2)',
                              fontSize: '0.75rem',
                              py: 0.3,
                              px: 1,
                              justifyContent: 'flex-start',
                              width: 'fit-content',
                              '&:hover': { bgcolor: 'rgba(37,211,102,0.15)' },
                            }}
                          >
                            {client.phone}
                          </Button>
                        </Tooltip>
                        {client.email && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.4,
                            }}
                          >
                            <EmailIcon
                              sx={{ fontSize: 11, color: 'text.disabled' }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary' }}
                            >
                              {client.email}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.package || 'Standard'}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.06)',
                          color: 'text.secondary',
                          fontWeight: 600,
                          fontSize: '0.72rem',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {client.invitationsCount ?? 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          client.status === 'active' ? 'Aktif' : 'Nonaktif'
                        }
                        size="small"
                        color={
                          client.status === 'active' ? 'success' : 'default'
                        }
                        sx={{ fontWeight: 700, fontSize: '0.7rem', height: 20 }}
                      />
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
                        <Tooltip title="Buat undangan untuk client ini">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AddCircleIcon fontSize="small" />}
                            onClick={() =>
                              handleCreateInvForClient(client.id, client.name)
                            }
                            sx={{ fontSize: '0.72rem', py: 0.3, px: 1 }}
                          >
                            Undangan
                          </Button>
                        </Tooltip>
                        <Tooltip title="Edit data client">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(client)}
                            sx={{ color: 'text.secondary' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hapus client">
                          <IconButton
                            size="small"
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'client',
                                id: client.id,
                                title: client.name,
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
  );
};
