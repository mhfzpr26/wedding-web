import type React from 'react';

export interface GuestGreetingProps {
  guestName?: string;
  style?: React.CSSProperties;
}

export const GuestGreeting: React.FC<GuestGreetingProps> = ({
  guestName,
  style,
}) => {
  return (
    <div className="cover__guest" style={style}>
      <div className="cover__guest-label">Kepada Yth. Bapak/Ibu/Saudara/i:</div>
      <div className="cover__guest-name">{guestName || 'Tamu Undangan'}</div>
    </div>
  );
};
