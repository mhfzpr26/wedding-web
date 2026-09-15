'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import type React from 'react';
import { useRef, useState } from 'react';
import { BankCard } from '@/components/molecules/BankCard';
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  const headerOpacity = useTransform(smoothProgress, [0.1, 0.45], [0, 1]);
  const headerY = useTransform(smoothProgress, [0.1, 0.45], [30, 0]);

  const descOpacity = useTransform(smoothProgress, [0.2, 0.55], [0, 1]);
  const descY = useTransform(smoothProgress, [0.2, 0.55], [20, 0]);

  const card0X = useTransform(smoothProgress, [0.3, 0.8], [-60, 0]);
  const card0Opacity = useTransform(smoothProgress, [0.3, 0.8], [0, 1]);

  const card1X = useTransform(smoothProgress, [0.3, 0.8], [60, 0]);
  const card1Opacity = useTransform(smoothProgress, [0.3, 0.8], [0, 1]);

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
      ref={sectionRef}
      id="gift"
      className="section gift"
      aria-labelledby="gift-title"
    >
      <div className="container">
        <div className="gift__container">
          <motion.div
            className="netflix-section-header"
            style={{
              opacity: headerOpacity,
              y: headerY,
            }}
          >
            <h2 className="gift__title" id="gift-title">
              WEDDING GIFT &amp; SUPPORT
            </h2>
          </motion.div>

          <motion.p
            className="gift__desc"
            style={{
              opacity: descOpacity,
              y: descY,
            }}
          >
            Kehadiran dan doa restu Anda adalah karunia yang paling berharga
            bagi kami. Namun bagi Bapak/Ibu/Saudara/i yang berkenan memberikan
            tanda kasih secara digital untuk mendukung babak baru (Season 2)
            perjalanan kami, dapat disalurkan melalui rekening resmi berikut:
          </motion.p>

          <div className="gift__cards">
            {bankAccounts.map((account, idx) => {
              const cardX = idx % 2 === 0 ? card0X : card1X;
              const cardOpacity = idx % 2 === 0 ? card0Opacity : card1Opacity;

              return (
                <motion.div
                  key={account.bank}
                  style={{
                    width: '100%',
                    x: cardX,
                    opacity: cardOpacity,
                  }}
                >
                  <BankCard
                    account={account}
                    isCopied={copiedBank === account.bank}
                    onCopy={handleCopy}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
