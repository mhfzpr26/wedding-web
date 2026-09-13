'use client';

import type React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
  return (
    <div className="gift__card netflix-patron-card">
      <div className="netflix-patron-card__header">
        <span className="netflix-patron-card__badge">VIP EXECUTIVE PRODUCER</span>
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

      <button
        type="button"
        className={`gift__copy-btn ${isCopied ? 'gift__copy-btn--copied' : ''}`}
        onClick={() => onCopy(account.number, account.bank)}
        aria-label={`Salin nomor rekening ${account.bank}`}
      >
        {isCopied ? (
          <>
            <CheckIcon sx={{ fontSize: 16 }} aria-hidden="true" />
            <span>ACCOUNT NUMBER COPIED!</span>
          </>
        ) : (
          <>
            <ContentCopyIcon sx={{ fontSize: 16 }} aria-hidden="true" />
            <span>COPY ACCOUNT NUMBER</span>
          </>
        )}
      </button>
    </div>
  );
};
