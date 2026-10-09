'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import type { OnboardingResponseData } from '@/types/onboarding';

interface GuestItem {
  id: string;
  name: string;
  phone?: string;
  category: 'Keluarga' | 'Teman' | 'VIP' | 'Kantor' | 'Umum';
  sent: boolean;
  notes?: string;
}

interface WhatsAppDistributionTabProps {
  initialData: OnboardingResponseData;
}

const TEMPLATES = {
  formal: {
    id: 'formal',
    title: 'Formal / VIP / Keluarga',
    text: `Kepada Yth.
{nama}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan merayakan hari bahagia pernikahan kami:

{link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.

Terima kasih yang sebesar-besarnya.
Salam hormat kami,
{pengantin}`,
  },
  santai: {
    id: 'santai',
    title: 'Santai / Sahabat / Teman',
    text: `Hai {nama}! 👋

Alhamdulillah, kami mau berbagi kabar bahagia. Insya Allah kami akan melangsungkan pernikahan. Info lengkap dan undangan resminya bisa kamu lihat di link berikut ya:

{link}

Kehadiran dan doa restumu bakal sangat berarti banget buat kami. Sampai jumpa di hari bahagia kami! ❤️

Salam hangat,
{pengantin}`,
  },
  grup: {
    id: 'grup',
    title: 'Grup WhatsApp / Komunitas',
    text: `Assalamualaikum Wr. Wb. / Salam Sejahtera untuk semua keluarga & sahabat,

Dengan penuh rasa syukur dan kebahagiaan, kami mengundang bapak/ibu/teman-teman semua untuk merayakan momen bahagia pernikahan kami:

{link}

Mohon doa restu agar seluruh rangkaian acara kami senantiasa diberikan kelancaran dan keberkahan. Terima kasih banyak! 🙏

Salam hangat,
{pengantin}`,
  },
};

export const WhatsAppDistributionTab: React.FC<
  WhatsAppDistributionTabProps
> = ({ initialData }) => {
  const invitation = initialData.invitation;
  const formData = initialData.formData;
  const coupleName = `${formData.couple.groom.callName || 'Groom'} & ${
    formData.couple.bride.callName || 'Bride'
  }`;

  const storageKey = `wedflow_guestlist_${invitation.slug}`;

  // State
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<
    'formal' | 'santai' | 'grup' | 'custom'
  >('formal');
  const [customTemplateText, setCustomTemplateText] = useState(
    TEMPLATES.formal.text,
  );

  // Single Quick Send Input
  const [quickGuestName, setQuickGuestName] = useState('');
  const [quickGuestPhone, setQuickGuestPhone] = useState('');

  // Guest List State
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mass Add Modal
  const [showMassModal, setShowMassModal] = useState(false);
  const [massNamesInput, setMassNamesInput] = useState('');
  const [massCategory, setMassCategory] =
    useState<GuestItem['category']>('Teman');

  // Load guests from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setGuests(JSON.parse(saved));
      } else {
        // Initial dummy data as guidance
        const defaultList: GuestItem[] = [
          {
            id: 'g-1',
            name: 'Bapak Ahmad & Keluarga',
            phone: '081234567890',
            category: 'Keluarga',
            sent: false,
          },
          {
            id: 'g-2',
            name: 'Rian Pratama & Partner',
            category: 'Teman',
            sent: false,
          },
        ];
        setGuests(defaultList);
      }
    } catch {
      // Ignore
    }
  }, [storageKey]);

  // Save guests to LocalStorage on update
  const saveGuests = (newList: GuestItem[]) => {
    setGuests(newList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newList));
    } catch {
      // Ignore
    }
  };

  // Generate Personalized Invitation Link
  const getPersonalizedLink = (guestName: string) => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://wedding.destia-rakafansa.com';
    const cleanName = guestName.trim();
    if (!cleanName) {
      return `${origin}/undangan/${invitation.slug}`;
    }
    return `${origin}/undangan/${invitation.slug}?to=${encodeURIComponent(
      cleanName,
    )}`;
  };

  // Normalize phone number to WhatsApp international format (62...)
  const formatToWhatsAppNumber = (phone = ''): string => {
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (!cleaned) return '';
    if (cleaned.startsWith('0')) {
      cleaned = `62${cleaned.slice(1)}`;
    } else if (cleaned.startsWith('8')) {
      cleaned = `62${cleaned}`;
    }
    return cleaned;
  };

  // Generate Formatted WhatsApp Message
  const getFormattedMessage = (guestName: string) => {
    const link = getPersonalizedLink(guestName);
    const templateString =
      selectedTemplateKey === 'custom'
        ? customTemplateText
        : TEMPLATES[selectedTemplateKey]?.text || TEMPLATES.formal.text;

    return templateString
      .replace(/{nama}/g, guestName.trim() || 'Bapak/Ibu/Saudara/i')
      .replace(/{link}/g, link)
      .replace(/{pengantin}/g, coupleName);
  };

  // Send WhatsApp Action
  const triggerSendWhatsApp = (
    guestName: string,
    phone = '',
    guestId?: string,
  ) => {
    const message = getFormattedMessage(guestName);
    const waNumber = formatToWhatsAppNumber(phone);
    let waUrl = '';

    if (waNumber) {
      // Direct to recipient chatroom
      waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    } else {
      // Fallback: Pick recipient from contact list
      waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    }

    // Open WhatsApp
    window.open(waUrl, '_blank');

    // If sent from guest list, mark as sent
    if (guestId) {
      const updated = guests.map((g) =>
        g.id === guestId ? { ...g, sent: true } : g,
      );
      saveGuests(updated);
    }
  };

  // Native Mobile Share
  const handleNativeShare = async (guestName: string) => {
    const message = getFormattedMessage(guestName);
    const link = getPersonalizedLink(guestName);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Undangan Pernikahan ${coupleName}`,
          text: message,
          url: link,
        });
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(message);
      alert('Pesan undangan disalin ke clipboard!');
    }
  };

  // Handle Mass Add with smart phone detection (supports Excel Tab, comma, dash, semicolon)
  const handleProcessMassAdd = () => {
    const lines = massNamesInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) return;

    const newEntries: GuestItem[] = lines.map((line, i) => {
      let name = line;
      let phone: string | undefined;

      // Delimiters: Tab (Excel paste), Semicolon, Comma, Dash, Pipe
      const delimiters = ['\t', ';', ',', ' - ', ' | '];
      for (const delim of delimiters) {
        if (line.includes(delim)) {
          const parts = line.split(delim);
          const lastPart = parts[parts.length - 1].trim();
          const digitsOnly = lastPart.replace(/[^0-9+]/g, '');
          if (digitsOnly.length >= 8) {
            phone = digitsOnly;
            name = parts
              .slice(0, parts.length - 1)
              .join(delim)
              .trim();
            break;
          }
        }
      }

      return {
        id: `g_${Date.now()}_${i}`,
        name: name || line,
        phone,
        category: massCategory,
        sent: false,
      };
    });

    saveGuests([...guests, ...newEntries]);
    setMassNamesInput('');
    setShowMassModal(false);
  };

  // Calculations for Progress
  const totalGuests = guests.length;
  const sentCount = guests.filter((g) => g.sent).length;
  const progressPercent =
    totalGuests > 0 ? Math.round((sentCount / totalGuests) * 100) : 0;

  // Filtered List
  const filteredGuests = guests.filter((g) => {
    const matchCategory =
      filterCategory === 'all' ||
      (filterCategory === 'sent' && g.sent) ||
      (filterCategory === 'unsent' && !g.sent) ||
      g.category === filterCategory;

    const matchSearch = g.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div>
      {/* Overview Info Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 className="onboard-section-title" style={{ margin: 0 }}>
            <span>📲</span> Sebar Undangan WhatsApp
          </h2>
          <p className="onboard-section-desc" style={{ margin: '4px 0 0' }}>
            Kirimkan tautan personal dengan nama tamu ke WhatsApp secara cepat
            dan pantau siapa yang sudah dikirimi.
          </p>
        </div>

        <a
          href={`/undangan/${invitation.slug}`}
          target="_blank"
          rel="noreferrer"
          className="onboard-btn onboard-btn-secondary"
          style={{ fontSize: '0.82rem', padding: '8px 16px' }}
        >
          👁️ Buka Undangan Publik
        </a>
      </div>

      {/* Progress Box */}
      <div className="guest-progress-box">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.88rem',
            fontWeight: 700,
          }}
        >
          <span>
            📊 Progres Pengiriman: {sentCount} dari {totalGuests} Tamu Terkirim
          </span>
          <span style={{ color: '#25d366' }}>{progressPercent}%</span>
        </div>
        <div className="guest-progress-bar-bg">
          <div
            className="guest-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grid: Left (Generator & Preview) + Right (Guest List & Checklist) */}
      <div className="onboard-grid">
        {/* Left Column: Quick Send & Template Customizer */}
        <div>
          {/* Quick Single Send Card */}
          <div className="onboard-subcard" style={{ marginBottom: '20px' }}>
            <div className="onboard-subcard-header">
              <span className="onboard-subcard-title">
                ⚡ Kirim Cepat ke 1 Tamu
              </span>
            </div>

            <div className="onboard-form-group">
              <label className="onboard-label">
                Nama Tamu Yang Dituju
                <span className="required">*</span>
              </label>
              <input
                type="text"
                className="onboard-input"
                placeholder="Contoh: Budi Santoso & Partner"
                value={quickGuestName}
                onChange={(e) => setQuickGuestName(e.target.value)}
              />
              <span className="onboard-hint">
                Nama ini akan muncul di amplop depan dan cover undangan.
              </span>
            </div>

            <div className="onboard-form-group">
              <label className="onboard-label">
                Nomor WhatsApp Tamu (Opsional)
              </label>
              <input
                type="tel"
                className="onboard-input"
                placeholder="Contoh: 081234567890 (kosongkan jika nomor ada di kontak HP)"
                value={quickGuestPhone}
                onChange={(e) => setQuickGuestPhone(e.target.value)}
              />
            </div>

            {/* Template Selector Pills */}
            <div style={{ marginBottom: '16px' }}>
              <label className="onboard-label">Pilih Gaya Template Pesan</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(['formal', 'santai', 'grup', 'custom'] as const).map(
                  (key) => (
                    <button
                      type="button"
                      key={key}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border:
                          selectedTemplateKey === key
                            ? '1px solid #25d366'
                            : '1px solid rgba(255,255,255,0.12)',
                        background:
                          selectedTemplateKey === key
                            ? 'rgba(37,211,102,0.15)'
                            : 'rgba(255,255,255,0.04)',
                        color:
                          selectedTemplateKey === key ? '#25d366' : '#cbd5e1',
                      }}
                      onClick={() => setSelectedTemplateKey(key)}
                    >
                      {key === 'formal' && '👔 Formal'}
                      {key === 'santai' && '🎉 Santai'}
                      {key === 'grup' && '👨‍👩‍👧 Grup'}
                      {key === 'custom' && '✍️ Kustom'}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Custom Textarea if selected */}
            {selectedTemplateKey === 'custom' && (
              <div className="onboard-form-group">
                <label className="onboard-label">Kustomisasi Isi Pesan</label>
                <textarea
                  className="onboard-textarea"
                  rows={6}
                  value={customTemplateText}
                  onChange={(e) => setCustomTemplateText(e.target.value)}
                />
                <span className="onboard-hint">
                  Gunakan variabel: {'{nama}'}, {'{link}'}, {'{pengantin}'}
                </span>
              </div>
            )}

            {/* Live WhatsApp Bubble Preview */}
            <div className="wa-chat-container">
              <div className="wa-chat-header">
                <div className="wa-avatar">💬</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Pratinjau Chat WhatsApp
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#25d366' }}>
                    Kepada: {quickGuestName.trim() || 'Nama Tamu'}
                  </div>
                </div>
              </div>

              <div className="wa-bubble">
                {getFormattedMessage(quickGuestName)}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="onboard-btn wa-btn-send"
                style={{ flex: 1 }}
                onClick={() =>
                  triggerSendWhatsApp(quickGuestName, quickGuestPhone)
                }
              >
                🟢 Buka WhatsApp &amp; Kirim
              </button>

              <button
                type="button"
                className="onboard-btn onboard-btn-secondary"
                title="Salin pesan ke clipboard"
                onClick={() => {
                  navigator.clipboard.writeText(
                    getFormattedMessage(quickGuestName),
                  );
                  alert('Pesan undangan disalin ke clipboard!');
                }}
              >
                📋 Salin
              </button>

              <button
                type="button"
                className="onboard-btn onboard-btn-secondary"
                title="Bagikan via menu share HP"
                onClick={() => handleNativeShare(quickGuestName)}
              >
                📲 Share
              </button>
            </div>

            {/* Quick Add to Guest List */}
            {quickGuestName.trim() && (
              <button
                type="button"
                style={{
                  width: '100%',
                  marginTop: '12px',
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  color: '#a5b4fc',
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  const newGuest: GuestItem = {
                    id: `g_${Date.now()}`,
                    name: quickGuestName.trim(),
                    phone: quickGuestPhone.trim(),
                    category: 'Teman',
                    sent: false,
                  };
                  saveGuests([...guests, newGuest]);
                  setQuickGuestName('');
                  setQuickGuestPhone('');
                }}
              >
                + Simpan ke Daftar Buku Tamu
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Guest List & Checklist Tracker */}
        <div>
          <div className="onboard-subcard">
            <div className="onboard-subcard-header">
              <span className="onboard-subcard-title">
                📋 Daftar Tamu ({totalGuests})
              </span>
              <button
                type="button"
                style={{
                  background: 'rgba(37,211,102,0.15)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  color: '#25d366',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={() => setShowMassModal(true)}
              >
                + Tambah Massal (Paste)
              </button>
            </div>

            {/* Search and Filters */}
            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                className="onboard-input"
                placeholder="🔍 Cari nama tamu..."
                style={{ marginBottom: '10px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                }}
              >
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'unsent', label: 'Belum Dikirim' },
                  { id: 'sent', label: 'Sudah Dikirim' },
                  { id: 'Keluarga', label: 'Keluarga' },
                  { id: 'Teman', label: 'Teman' },
                  { id: 'VIP', label: 'VIP' },
                ].map((f) => (
                  <button
                    type="button"
                    key={f.id}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border:
                        filterCategory === f.id
                          ? '1px solid #e50914'
                          : '1px solid rgba(255,255,255,0.08)',
                      background:
                        filterCategory === f.id
                          ? 'rgba(229,9,20,0.15)'
                          : 'rgba(255,255,255,0.03)',
                      color: filterCategory === f.id ? '#ff6b6b' : '#94a3b8',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => setFilterCategory(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest List Items */}
            <div
              style={{
                maxHeight: '480px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {filteredGuests.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '36px 12px',
                    color: '#64748b',
                    fontSize: '0.86rem',
                  }}
                >
                  Belum ada tamu di kategori ini. Klik tombol "+ Tambah Massal"
                  untuk menambahkan nama tamu.
                </div>
              ) : (
                filteredGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className={`guest-card-item ${guest.sent ? 'sent' : ''}`}
                  >
                    <div style={{ minWidth: 0, flexGrow: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '3px',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            color: guest.sent ? '#10b981' : '#ffffff',
                          }}
                        >
                          {guest.name}
                        </span>
                        <span className="guest-tag">{guest.category}</span>
                      </div>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span>
                          {guest.sent ? '✅ Terkirim' : '⚪ Belum dikirim'}
                        </span>
                        {guest.phone ? (
                          <button
                            type="button"
                            title="Klik untuk ubah nomor WhatsApp"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#25d366',
                              fontWeight: 600,
                              cursor: 'pointer',
                              padding: 0,
                              fontSize: '0.74rem',
                            }}
                            onClick={() => {
                              const newPhone = window.prompt(
                                `Ubah nomor WA untuk ${guest.name}:`,
                                guest.phone || '',
                              );
                              if (newPhone !== null) {
                                const updated = guests.map((g) =>
                                  g.id === guest.id
                                    ? { ...g, phone: newPhone.trim() }
                                    : g,
                                );
                                saveGuests(updated);
                              }
                            }}
                          >
                            📱 {guest.phone} ✏️
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Tambahkan nomor WhatsApp spesifik"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#94a3b8',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                              padding: 0,
                              fontSize: '0.74rem',
                            }}
                            onClick={() => {
                              const newPhone = window.prompt(
                                `Masukkan nomor WA untuk ${guest.name} (contoh: 081234567890):`,
                                '',
                              );
                              if (newPhone?.trim()) {
                                const updated = guests.map((g) =>
                                  g.id === guest.id
                                    ? { ...g, phone: newPhone.trim() }
                                    : g,
                                );
                                saveGuests(updated);
                              }
                            }}
                          >
                            + No. WA
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexShrink: 0,
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          background: guest.sent
                            ? 'rgba(16,185,129,0.15)'
                            : '#25d366',
                          color: guest.sent ? '#10b981' : '#000000',
                          border: guest.sent
                            ? '1px solid rgba(16,185,129,0.3)'
                            : 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                        onClick={() =>
                          triggerSendWhatsApp(guest.name, guest.phone, guest.id)
                        }
                      >
                        {guest.sent ? 'Kirim Ulang' : 'Kirim WA'}
                      </button>

                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '4px',
                          fontSize: '0.9rem',
                        }}
                        title="Tandai Status"
                        onClick={() => {
                          const updated = guests.map((g) =>
                            g.id === guest.id ? { ...g, sent: !g.sent } : g,
                          );
                          saveGuests(updated);
                        }}
                      >
                        {guest.sent ? '↩' : '✓'}
                      </button>

                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px',
                          fontSize: '0.9rem',
                        }}
                        title="Hapus"
                        onClick={() => {
                          const updated = guests.filter(
                            (g) => g.id !== guest.id,
                          );
                          saveGuests(updated);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Mass Add Names */}
      {showMassModal && (
        <div className="portal-modal-backdrop">
          <div className="portal-modal-card">
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 8px',
              }}
            >
              📋 Tambah Banyak Tamu Sekaligus
            </h3>
            <p
              style={{
                fontSize: '0.84rem',
                color: '#94a3b8',
                margin: '0 0 16px',
                lineHeight: 1.5,
              }}
            >
              Salin daftar nama dari Excel, Google Sheet, atau Catatan HP, lalu
              tempelkan di bawah ini (1 baris untuk 1 tamu).
              <br />
              <span
                style={{
                  color: '#25d366',
                  display: 'inline-block',
                  marginTop: '4px',
                }}
              >
                💡 Mendukung format nama saja atau nama + nomor HP (contoh:{' '}
                <code>Budi Santoso, 081234567890</code> atau copy 2 kolom dari
                Excel).
              </span>
            </p>

            <div className="onboard-form-group">
              <label className="onboard-label">Pilih Kategori Tamu</label>
              <select
                className="onboard-select"
                value={massCategory}
                onChange={(e) =>
                  setMassCategory(e.target.value as GuestItem['category'])
                }
              >
                <option value="Teman">Teman / Sahabat</option>
                <option value="Keluarga">Keluarga Besar</option>
                <option value="VIP">VIP / Tokoh</option>
                <option value="Kantor">Rekan Kantor</option>
                <option value="Umum">Umum</option>
              </select>
            </div>

            <div className="onboard-form-group">
              <label className="onboard-label">
                Daftar Tamu (1 Baris = 1 Tamu)
              </label>
              <textarea
                className="onboard-textarea"
                rows={8}
                placeholder={`Budi Santoso\nBpk. Ahmad, 081234567890\nRina Wulandari\t081987654321\nDimas - 085712345678`}
                value={massNamesInput}
                onChange={(e) => setMassNamesInput(e.target.value)}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end',
                marginTop: '16px',
              }}
            >
              <button
                type="button"
                className="onboard-btn onboard-btn-secondary"
                onClick={() => setShowMassModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="onboard-btn onboard-btn-primary"
                onClick={handleProcessMassAdd}
              >
                Tambahkan ke Daftar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
