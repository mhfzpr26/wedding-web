'use client';

import { QRCodeSVG } from 'qrcode.react';
import type React from 'react';
import { useState } from 'react';
import { FaCheckCircle, FaTicketAlt } from 'react-icons/fa';

export interface GuestQrPassProps {
  guestName: string;
  invitationSlug?: string;
  invitationTitle?: string;
  attendance?: string;
  guestCount?: number;
}

export const GuestQrPass: React.FC<GuestQrPassProps> = ({
  guestName,
  invitationSlug = 'wedding',
  invitationTitle = 'The Wedding Celebration',
  attendance = 'Hadir',
  guestCount = 1,
}) => {
  const [copied, setCopied] = useState(false);

  // Generate payload URL or string for scanner
  const qrValue =
    typeof window !== 'undefined'
      ? `${window.location.origin}/undangan/${invitationSlug}?verify=${encodeURIComponent(guestName)}`
      : `https://wedflow.id/checkin?slug=${invitationSlug}&guest=${encodeURIComponent(guestName)}`;

  const handleCopyPass = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#111827',
        border: '1px solid #374151',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '420px',
        margin: '24px auto 0',
        color: '#f9fafb',
        textAlign: 'center',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#064e3b',
          color: '#34d399',
          border: '1px solid #059669',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}
      >
        <FaCheckCircle />
        <span>VIP Digital Guest Pass</span>
      </div>

      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          margin: '0 0 6px',
          color: '#ffffff',
        }}
      >
        {guestName}
      </h3>
      <p
        style={{
          fontSize: '0.82rem',
          color: '#9ca3af',
          margin: '0 0 20px',
        }}
      >
        {invitationTitle} • {guestCount} Tamu ({attendance})
      </p>

      {/* QR Code Container with High-Contrast White Frame for reliable optical scanning */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '10px',
          display: 'inline-block',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          marginBottom: '18px',
        }}
      >
        <QRCodeSVG
          value={qrValue}
          size={180}
          level="H"
          marginSize={2}
          fgColor="#000000"
          bgColor="#ffffff"
        />
      </div>

      <p
        style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          margin: '0 0 16px',
          lineHeight: 1.5,
        }}
      >
        Tunjukkan QR Code ini kepada resepsionis / penerima tamu saat tiba di
        lokasi acara untuk check-in buku tamu digital.
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <button
          type="button"
          onClick={handleCopyPass}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: copied ? '#059669' : '#1f2937',
            color: '#ffffff',
            border: '1px solid #374151',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          <FaTicketAlt />
          <span>{copied ? 'Tautan Pass Disalin!' : 'Salin Tautan Pass'}</span>
        </button>
      </div>
    </div>
  );
};
