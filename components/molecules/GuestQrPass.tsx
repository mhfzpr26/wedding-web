'use client';

import { QRCodeSVG } from 'qrcode.react';
import type React from 'react';
import { useState } from 'react';
import { FaCheckCircle, FaTicketAlt } from 'react-icons/fa';
import {
  NetflixAvatar,
  type NetflixAvatarVariant,
} from '@/components/atoms/NetflixAvatar';

const BARCODE_BARS = [
  2, 4, 1, 3, 5, 2, 1, 4, 2, 6, 1, 3, 2, 5, 1, 4, 2, 3, 1, 5, 2, 4, 1, 3, 6, 2,
  1, 4, 2, 3, 5, 1, 2, 4, 1, 3, 5, 2, 1,
].map((w, i) => ({ id: `bar-${i}`, w }));

export interface GuestQrPassProps {
  guestName: string;
  invitationSlug?: string;
  invitationTitle?: string;
  attendance?: string;
  guestCount?: number;
  avatarVariant?: NetflixAvatarVariant;
}

export const GuestQrPass: React.FC<GuestQrPassProps> = ({
  guestName,
  invitationSlug = 'wedding',
  invitationTitle = 'DESTIA & RAKAFANSA',
  attendance = 'Hadir',
  guestCount = 1,
  avatarVariant = 'red',
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

  const serialCode = `NFLX-2026-DR-${Math.abs(
    guestName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 42,
  )
    .toString()
    .padStart(5, '0')}`;

  return (
    <div
      className="netflix-ticket-pass"
      role="region"
      aria-label="Netflix VIP Premiere Ticket Pass"
    >
      {/* Perforated ticket circular notches */}
      <div className="netflix-ticket-pass__notch-left" aria-hidden="true" />
      <div className="netflix-ticket-pass__notch-right" aria-hidden="true" />
      <div className="netflix-ticket-pass__divider" aria-hidden="true" />

      {/* Ticket Header Banner */}
      <div className="netflix-ticket-pass__header">
        <div className="netflix-ticket-pass__brand-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/netflix-logo.svg"
            alt="Netflix"
            className="netflix-ticket-pass__brand-logo"
          />
          <span className="netflix-ticket-pass__badge">
            VIP ALL-ACCESS PASS
          </span>
        </div>

        <h3 className="netflix-ticket-pass__event-title">{invitationTitle}</h3>
        <p className="netflix-ticket-pass__event-sub">
          Season 1 Premiere • Red Carpet Admission
        </p>
      </div>

      {/* Ticket Body */}
      <div className="netflix-ticket-pass__body">
        {/* Guest Profile Row */}
        <div className="netflix-ticket-pass__guest-row">
          <NetflixAvatar variant={avatarVariant} size="md" active={false} />
          <div className="netflix-ticket-pass__guest-info">
            <span className="netflix-ticket-pass__guest-label">
              VIP GUEST ACCOUNT
            </span>
            <p className="netflix-ticket-pass__guest-name">{guestName}</p>
            <span className="netflix-ticket-pass__guest-seat">
              {guestCount} VIP {guestCount > 1 ? 'PASSES' : 'PASS'} • (
              {attendance.toUpperCase()})
            </span>
          </div>
          <FaCheckCircle style={{ color: '#10b981', fontSize: '1.25rem' }} />
        </div>

        {/* High-Contrast QR Code Container */}
        <div className="netflix-ticket-pass__qr-frame">
          <QRCodeSVG
            value={qrValue}
            size={170}
            level="H"
            marginSize={2}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>

        <p className="netflix-ticket-pass__instructions">
          Tunjukkan QR Pass ini kepada Usher / Meja Penerima Tamu untuk
          pemindaian VIP Check-in di lokasi acara.
        </p>

        {/* Simulated Barcode & Serial */}
        <div className="netflix-ticket-pass__barcode-wrap">
          <div className="netflix-ticket-pass__barcode" aria-hidden="true">
            {BARCODE_BARS.map((bar) => (
              <span
                key={bar.id}
                className="netflix-ticket-pass__barcode-bar"
                style={{ width: `${bar.w}px` }}
              />
            ))}
          </div>
          <span className="netflix-ticket-pass__barcode-code">
            {serialCode}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="netflix-ticket-pass__actions">
          <button
            type="button"
            onClick={handleCopyPass}
            className={`netflix-ticket-pass__btn-copy ${
              copied ? 'netflix-ticket-pass__btn-copy--copied' : ''
            }`}
            aria-label="Salin tautan pass digital"
          >
            <FaTicketAlt />
            <span>{copied ? 'Tautan Pass Disalin!' : 'Salin Tautan Pass'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
