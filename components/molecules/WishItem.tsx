import type React from 'react';
import { Badge } from '@/components/atoms/Badge';
import type { WishRecord } from '@/types/wishes';

export interface WishItemProps {
  wish: WishRecord;
}

export const WishItem: React.FC<WishItemProps> = ({ wish }) => {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <article className="wishes__item netflix-review-item">
      <div className="netflix-review-item__user-bar">
        <div className="netflix-review-item__avatar">
          {wish.name.charAt(0).toUpperCase()}
        </div>
        <div className="netflix-review-item__user-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="wishes__sender">{wish.name}</span>
            <span className="netflix-spec-tag netflix-spec-tag--red">VERIFIED VIEWER</span>
            <Badge>{wish.status}</Badge>
          </div>
          <span className="wishes__date">{formatDate(wish.createdAt)}</span>
        </div>
      </div>
      <p className="wishes__text">{wish.message}</p>
    </article>
  );
};
