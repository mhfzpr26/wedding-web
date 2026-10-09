'use client';

import { motion } from 'motion/react';
import type React from 'react';
import { useState } from 'react';
import { FaCheck, FaCopy, FaCreditCard } from 'react-icons/fa6';
import type { WeddingBankAccount } from '@/types/wedding';

export interface SpotifyTipJarProps {
  gifts?: WeddingBankAccount[];
}

export const SpotifyTipJar: React.FC<SpotifyTipJarProps> = ({ gifts }) => {
  const bankAccounts = gifts && gifts.length > 0 ? gifts : [];
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const handleCopy = (num: string, bank: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(num);
      setCopiedBank(bank);
      setTimeout(() => setCopiedBank(null), 2500);
    }
  };

  return (
    <section
      id="gifts"
      className="spotify-section"
      aria-label="Spotify Artist Tip Jar Section"
    >
      <div className="spotify-container">
        <div
          className="spotify-section__header"
          style={{ textAlign: 'center' }}
        >
          <span className="spotify-section__tag">
            SUPPORT THE ARTISTS • TANDA KASIH
          </span>
          <h2 className="spotify-section__title">
            ARTIST TIP JAR &amp; WEDDING GIFT
          </h2>
          <p
            className="spotify-section__subtitle"
            style={{ maxWidth: '640px', margin: '0 auto' }}
          >
            Doa restu Anda adalah karunia terindah bagi kami. Bagi yang berkenan
            memberikan tanda kasih digital untuk mendukung awal perjalanan baru
            kami, dapat disalurkan melalui rekening resmi berikut:
          </p>
        </div>

        <div className="spotify-tip-jar-grid">
          {bankAccounts.map((account) => {
            const isCopied = copiedBank === account.bank;
            return (
              <motion.div
                key={account.id || account.bank}
                className="spotify-bank-card"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="spotify-bank-header">
                  <div className="spotify-bank-badge">
                    <FaCreditCard
                      style={{ marginRight: '0.4rem', color: '#1db954' }}
                    />
                    BANK {account.bank}
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--sp-text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Verified Account
                  </span>
                </div>

                <div className="spotify-bank-number-row">
                  <span className="spotify-bank-number">{account.number}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(account.number, account.bank)}
                    className="spotify-pill-action"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    title="Salin Nomor Rekening"
                  >
                    {isCopied ? (
                      <>
                        <FaCheck style={{ color: '#1db954' }} />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <FaCopy />
                        <span>SALIN</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="spotify-bank-owner">
                  Atas Nama:{' '}
                  <strong style={{ color: '#fff' }}>{account.owner}</strong>
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
