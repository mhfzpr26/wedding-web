'use client';

import type React from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAdminStore } from '@/stores/useAdminStore';
import type { WeddingEventItem } from '@/types/wedding';

export const EventsEditorTab: React.FC = () => {
  const config = useAdminStore((s) => s.config);
  const setConfig = useAdminStore((s) => s.setConfig);

  if (!config) return null;

  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__title-group">
          <h3 className="admin-card__title">
            Daftar Rangkaian Acara Pernikahan
          </h3>
          <span className="admin-card__desc">
            Atur seluruh sesi acara seperti Akad Nikah, Resepsi, atau Ngunduh Mantu dengan lokasi, link Google Maps, dan integrasi Google Calendar.
          </span>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--secondary"
          onClick={() => {
            const newEvent: WeddingEventItem = {
              id: `event_${Date.now()}`,
              type: 'RESEPSI PERNIKAHAN',
              episodeNumber: (config.events?.length || 0) + 1,
              title: 'The Celebration Party',
              duration: '120 Menit',
              synopsis: 'Pesta syukuran dan ramah tamah pernikahan.',
              date: 'Sabtu, 14 November 2026',
              time: '11:00 - 13:00 WIB',
              venue: 'Grand Ballroom',
              address: 'Alamat lengkap tempat resepsi',
              mapUrl: 'https://maps.google.com',
              calendarUrl: 'https://calendar.google.com',
            };
            setConfig((prev) =>
              prev
                ? {
                    ...prev,
                    events: [...(prev.events || []), newEvent],
                  }
                : null,
            );
          }}
        >
          <AddIcon fontSize="small" /> Tambah Rangkaian Acara
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {config.events.map((ev, index) => (
          <div
            key={ev.id || index}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--admin-border)',
              borderRadius: 'var(--admin-radius-md)',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  color: 'var(--admin-primary)',
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                }}
              >
                SESI ACARA #{ev.episodeNumber || index + 1}: {ev.type}
              </span>
              <button
                type="button"
                className="admin-btn admin-btn--danger admin-btn--sm"
                onClick={() => {
                  setConfig((prev) =>
                    prev
                      ? {
                          ...prev,
                          events: prev.events.filter((_, i) => i !== index),
                        }
                      : null,
                  );
                }}
              >
                <DeleteIcon fontSize="inherit" /> Hapus
              </button>
            </div>

            <div className="admin-grid-3">
              <div className="admin-form-group">
                <label className="admin-label">Tipe Acara</label>
                <input
                  type="text"
                  className="admin-input"
                  value={ev.type}
                  onChange={(e) => {
                    const updated = [...config.events];
                    updated[index].type = e.target.value;
                    setConfig((prev) =>
                      prev ? { ...prev, events: updated } : null,
                    );
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Judul Sesi Acara</label>
                <input
                  type="text"
                  className="admin-input"
                  value={ev.title}
                  onChange={(e) => {
                    const updated = [...config.events];
                    updated[index].title = e.target.value;
                    setConfig((prev) =>
                      prev ? { ...prev, events: updated } : null,
                    );
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Estimasi Durasi Acara</label>
                <input
                  type="text"
                  className="admin-input"
                  value={ev.duration}
                  onChange={(e) => {
                    const updated = [...config.events];
                    updated[index].duration = e.target.value;
                    setConfig((prev) =>
                      prev ? { ...prev, events: updated } : null,
                    );
                  }}
                />
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Hari & Tanggal</label>
                <input
                  type="text"
                  className="admin-input"
                  value={ev.date}
                  onChange={(e) => {
                    const updated = [...config.events];
                    updated[index].date = e.target.value;
                    setConfig((prev) =>
                      prev ? { ...prev, events: updated } : null,
                    );
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Waktu / Jam Pelaksanaan</label>
                <input
                  type="text"
                  className="admin-input"
                  value={ev.time}
                  onChange={(e) => {
                    const updated = [...config.events];
                    updated[index].time = e.target.value;
                    setConfig((prev) =>
                      prev ? { ...prev, events: updated } : null,
                    );
                  }}
                />
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Nama Tempat / Gedung</label>
                <input
                  type="text"
                  className="admin-input"
                  value={ev.venue}
                  onChange={(e) => {
                    const updated = [...config.events];
                    updated[index].venue = e.target.value;
                    setConfig((prev) =>
                      prev ? { ...prev, events: updated } : null,
                    );
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Alamat Lengkap</label>
                <input
                  type="text"
                  className="admin-input"
                  value={ev.address}
                  onChange={(e) => {
                    const updated = [...config.events];
                    updated[index].address = e.target.value;
                    setConfig((prev) =>
                      prev ? { ...prev, events: updated } : null,
                    );
                  }}
                />
              </div>
            </div>

            <div className="admin-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Link Google Maps</label>
                <input
                  type="text"
                  className="admin-input"
                  value={ev.mapUrl}
                  onChange={(e) => {
                    const updated = [...config.events];
                    updated[index].mapUrl = e.target.value;
                    setConfig((prev) =>
                      prev ? { ...prev, events: updated } : null,
                    );
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">
                  Link Simpan ke Google Calendar
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={ev.calendarUrl}
                  onChange={(e) => {
                    const updated = [...config.events];
                    updated[index].calendarUrl = e.target.value;
                    setConfig((prev) =>
                      prev ? { ...prev, events: updated } : null,
                    );
                  }}
                />
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label">Deskripsi & Catatan Acara</label>
              <textarea
                className="admin-textarea"
                rows={2}
                value={ev.synopsis}
                onChange={(e) => {
                  const updated = [...config.events];
                  updated[index].synopsis = e.target.value;
                  setConfig((prev) =>
                    prev ? { ...prev, events: updated } : null,
                  );
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
