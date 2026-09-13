'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import PeopleIcon from '@mui/icons-material/People';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import TimelineIcon from '@mui/icons-material/Timeline';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import TimerIcon from '@mui/icons-material/Timer';

export interface NetflixNavbarProps {
  guestName?: string;
  visible: boolean;
}

export const NetflixNavbar: React.FC<NetflixNavbarProps> = ({
  guestName,
  visible,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('opening');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = [
        'opening',
        'couple',
        'story',
        'countdown',
        'event',
        'rsvp',
        'wishes',
        'gift',
      ];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const guestInitial = guestName ? guestName.trim().charAt(0).toUpperCase() : 'U';

  return (
    <header
      className={`netflix-nav ${scrolled ? 'netflix-nav--scrolled' : ''} ${
        visible ? 'netflix-nav--visible' : ''
      }`}
      aria-label="Navigasi Utama"
    >
      <div className="netflix-nav__container">
        {/* Logo */}
        <a href="#opening" onClick={scrollTo('opening')} className="netflix-nav__logo-link">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/netflix-logo.svg"
            alt="Netflix Wedding"
            className="netflix-nav__logo-img"
          />
        </a>

        {/* Links */}
        <nav className="netflix-nav__menu">
          <a
            href="#opening"
            onClick={scrollTo('opening')}
            className={`netflix-nav__link ${activeSection === 'opening' ? 'active' : ''}`}
          >
            Home
          </a>
          <a
            href="#trailer"
            onClick={scrollTo('trailer')}
            className={`netflix-nav__link ${activeSection === 'trailer' ? 'active' : ''}`}
          >
            <OndemandVideoIcon sx={{ fontSize: 16 }} className="netflix-nav__link-icon" />
            Trailer
          </a>
          <a
            href="#couple"
            onClick={scrollTo('couple')}
            className={`netflix-nav__link ${activeSection === 'couple' ? 'active' : ''}`}
          >
            <PeopleIcon sx={{ fontSize: 16 }} className="netflix-nav__link-icon" />
            Cast
          </a>
          <a
            href="#gallery"
            onClick={scrollTo('gallery')}
            className={`netflix-nav__link ${activeSection === 'gallery' ? 'active' : ''}`}
          >
            Gallery
          </a>
          <a
            href="#story"
            onClick={scrollTo('story')}
            className={`netflix-nav__link ${activeSection === 'story' ? 'active' : ''}`}
          >
            <TimelineIcon sx={{ fontSize: 16 }} className="netflix-nav__link-icon" />
            Story
          </a>
          <a
            href="#countdown"
            onClick={scrollTo('countdown')}
            className={`netflix-nav__link ${activeSection === 'countdown' ? 'active' : ''}`}
          >
            <TimerIcon sx={{ fontSize: 16 }} className="netflix-nav__link-icon" />
            Premiere
          </a>
          <a
            href="#event"
            onClick={scrollTo('event')}
            className={`netflix-nav__link ${activeSection === 'event' ? 'active' : ''}`}
          >
            <OndemandVideoIcon sx={{ fontSize: 16 }} className="netflix-nav__link-icon" />
            Episodes
          </a>
          <a
            href="#rsvp"
            onClick={scrollTo('rsvp')}
            className={`netflix-nav__link ${activeSection === 'rsvp' ? 'active' : ''}`}
          >
            <ConfirmationNumberIcon sx={{ fontSize: 16 }} className="netflix-nav__link-icon" />
            RSVP
          </a>
          <a
            href="#wishes"
            onClick={scrollTo('wishes')}
            className={`netflix-nav__link ${activeSection === 'wishes' ? 'active' : ''}`}
          >
            <RateReviewIcon sx={{ fontSize: 16 }} className="netflix-nav__link-icon" />
            Reviews
          </a>
          <a
            href="#gift"
            onClick={scrollTo('gift')}
            className={`netflix-nav__link ${activeSection === 'gift' ? 'active' : ''}`}
          >
            <CardGiftcardIcon sx={{ fontSize: 16 }} className="netflix-nav__link-icon" />
            Gift
          </a>
        </nav>

        {/* User Profile Badge */}
        <div className="netflix-nav__user">
          <div className="netflix-nav__badge-live">
            <span className="netflix-nav__dot-live" />
            <span className="netflix-nav__live-text">SPECIAL EVENT</span>
          </div>
          <div className="netflix-nav__profile" title={`Login sebagai: ${guestName || 'Tamu Undangan'}`}>
            <span className="netflix-nav__avatar">{guestInitial}</span>
            <span className="netflix-nav__username">{guestName ? guestName.split(' ')[0] : 'Guest'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
