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
        <div className="gift__qr-box">
          <QRCodeSVG value={qrTransferPayload} size={140} level="M" />
          <span className="gift__qr-label">
            Scan via Mobile Banking / QRIS
          </span>
        </div>
      )}

      <div className="gift__actions">
        <button
          type="button"
          className={`gift__btn gift__btn--copy ${isCopied ? 'gift__btn--copied' : ''}`}
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
          className={`gift__btn gift__btn--qr ${showQr ? 'gift__btn--qr-active' : ''}`}
          aria-label={showQr ? 'Tutup QR Code Rekening' : 'Tampilkan QR Code Rekening'}
          title="Tampilkan QR Code"
        >
          <QrCode2Icon sx={{ fontSize: 18 }} />
          <span className="gift__qr-text-full">{showQr ? 'TUTUP QR' : 'TAMPILKAN QR'}</span>
          <span className="gift__qr-text-short">{showQr ? 'TUTUP QR' : 'QR CODE'}</span>
        </button>
      </div>
    </div>
  );
};
