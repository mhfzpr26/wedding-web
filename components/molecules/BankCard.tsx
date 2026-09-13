'use client';

import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { QRCodeSVG } from 'qrcode.react';
import type React from 'react';
import { useState } from 'react';
import type { BankAccountData } from '@/types/invitation';

export interface BankCardProps {
  account: BankAccountData;
  isCopied: boolean;
  onCopy: (number: string, bank: string) => void;
}

export const BankCard: React.FC<BankCardProps> = ({
  account,
  isCopied,
  onCopy,
}) => {
  const [showQr, setShowQr] = useState(false);

  // Transfer payload or format
  const qrTransferPayload = `${account.bank}:${account.number}:${account.owner}`;

  return (
    <div className="gift__card netflix-patron-card">
      <div className="netflix-patron-card__header">
        <span className="netflix-patron-card__badge">
          VIP EXECUTIVE PRODUCER
        </span>
        <span className="gift__bank-name">{account.bank}</span>
      </div>

      {/* Stylized EMV Chip */}
      <div className="netflix-patron-card__chip" aria-hidden="true">
        <div className="netflix-patron-card__chip-line" />
      </div>

      <div className="netflix-patron-card__body">
        <span className="netflix-patron-card__label">ACCOUNT NUMBER:</span>
        <div className="gift__number">{account.number}</div>
        <div className="gift__owner">A.N. {account.owner}</div>
      </div>

      {showQr && (
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '12px',
            borderRadius: '8px',
            margin: '12px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            width: 'fit-content',
          }}
        >
          <QRCodeSVG value={qrTransferPayload} size={130} level="M" />
          <span
            style={{ color: '#111827', fontSize: '0.72rem', fontWeight: 600 }}
          >
            Scan via Mobile Banking
          </span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          type="button"
          style={{ flex: 1 }}
          className={`gift__copy-btn ${isCopied ? 'gift__copy-btn--copied' : ''}`}
          onClick={() => onCopy(account.number, account.bank)}
          aria-label={`Salin nomor rekening ${account.bank}`}
        >
          {isCopied ? (
            <>
              <CheckIcon sx={{ fontSize: 16 }} aria-hidden="true" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <ContentCopyIcon sx={{ fontSize: 16 }} aria-hidden="true" />
              <span>COPY NUMBER</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowQr((prev) => !prev)}
          className="gift__copy-btn"
          style={{
            flex: '0 0 auto',
            padding: '0 12px',
            backgroundColor: showQr
              ? 'var(--color-netflix-red, #e50914)'
              : 'rgba(255,255,255,0.1)',
            borderColor: showQr
              ? 'var(--color-netflix-red, #e50914)'
              : 'rgba(255,255,255,0.2)',
          }}
          aria-label="Tampilkan QR Code Rekening"
          title="Tampilkan QR Code"
        >
          <QrCode2Icon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
};
