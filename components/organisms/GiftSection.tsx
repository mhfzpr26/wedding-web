'use client';

import type React from 'react';
import { useState } from 'react';
import { BankCard } from '@/components/molecules/BankCard';
import { useInView } from '@/hooks/useInView';
import type { BankAccountData } from '@/types/invitation';
import type { WeddingBankAccount } from '@/types/wedding';

export interface GiftSectionProps {
  gifts?: WeddingBankAccount[];
}

const DEFAULT_GIFTS: BankAccountData[] = [
  {
    bank: 'BCA',
    number: '8820491823',
    owner: 'Destia Dwi Ramadhani',
  },
  {
    bank: 'MANDIRI',
    number: '1560018928192',
    owner: 'Rakafansa Saputra',
  },
];

export const GiftSection: React.FC<GiftSectionProps> = ({ gifts }) => {
  const { ref, inView } = useInView<HTMLElement>();
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const bankAccounts = gifts && gifts.length > 0 ? gifts : DEFAULT_GIFTS;

  const handleCopy = (num: string, bank: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(num);
      setCopiedBank(bank);
      setTimeout(() => {
        setCopiedBank(null);
      }, 2500);
    }
  };

  return (
    <section
      id="gift"
      ref={ref}
      className="section gift"
      aria-labelledby="gift-title"
    >
      <div className="container">
        <div
          className="gift__container"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="netflix-section-header">
            <div className="netflix-badge-pill" style={{ margin: '0 auto var(--spacing-xs)' }}>
              EXECUTIVE PRODUCERS • BACK THE PRODUCTION
            </div>
            <h2 className="gift__title" id="gift-title">WEDDING GIFT &amp; SUPPORT</h2>
          </div>

          <p className="gift__desc">
            Kehadiran dan doa restu Anda adalah karunia yang paling berharga bagi kami. Namun bagi Bapak/Ibu/Saudara/i yang berkenan memberikan tanda kasih secara digital untuk mendukung babak baru (Season 2) perjalanan kami, dapat disalurkan melalui rekening resmi berikut:
          </p>

          <div className="gift__cards">
            {bankAccounts.map((account) => (
              <BankCard
                key={account.bank}
                account={account}
                isCopied={copiedBank === account.bank}
                onCopy={handleCopy}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
