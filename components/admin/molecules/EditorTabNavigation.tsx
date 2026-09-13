'use client';

import type React from 'react';
import PaletteIcon from '@mui/icons-material/Palette';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import TimerIcon from '@mui/icons-material/Timer';
import CollectionsIcon from '@mui/icons-material/Collections';
import TimelineIcon from '@mui/icons-material/Timeline';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useAdminStore } from '@/stores/useAdminStore';

export const EditorTabNavigation: React.FC = () => {
  const editorTab = useAdminStore((s) => s.editorTab);
  const setEditorTab = useAdminStore((s) => s.setEditorTab);
  const rsvps = useAdminStore((s) => s.rsvps);

  return (
    <nav className="admin-nav">
      <button
        type="button"
        className={`admin-nav__item ${
          editorTab === 'template' ? 'admin-nav__item--active' : ''
        }`}
        onClick={() => setEditorTab('template')}
      >
        <PaletteIcon fontSize="small" /> 1. Template
      </button>
      <button
        type="button"
        className={`admin-nav__item ${
          editorTab === 'couple' ? 'admin-nav__item--active' : ''
        }`}
        onClick={() => setEditorTab('couple')}
      >
        <PeopleIcon fontSize="small" /> 2. Mempelai
      </button>
      <button
        type="button"
        className={`admin-nav__item ${
          editorTab === 'events' ? 'admin-nav__item--active' : ''
        }`}
        onClick={() => setEditorTab('events')}
      >
        <EventIcon fontSize="small" /> 3. Acara & Rangkaian
      </button>
      <button
        type="button"
        className={`admin-nav__item ${
          editorTab === 'media' ? 'admin-nav__item--active' : ''
        }`}
        onClick={() => setEditorTab('media')}
      >
        <MusicNoteIcon fontSize="small" /> 4. Musik & Video
      </button>
      <button
        type="button"
        className={`admin-nav__item ${
          editorTab === 'cover' ? 'admin-nav__item--active' : ''
        }`}
        onClick={() => setEditorTab('cover')}
      >
        <MovieIcon fontSize="small" /> 5. Cover & Opening
      </button>
      <button
        type="button"
        className={`admin-nav__item ${
          editorTab === 'countdown' ? 'admin-nav__item--active' : ''
        }`}
        onClick={() => setEditorTab('countdown')}
      >
        <TimerIcon fontSize="small" /> 6. Countdown
      </button>
      <button
        type="button"
        className={`admin-nav__item ${
          editorTab === 'gallery' ? 'admin-nav__item--active' : ''
        }`}
        onClick={() => setEditorTab('gallery')}
      >
        <CollectionsIcon fontSize="small" /> 7. Galeri Foto
      </button>
      <button
        type="button"
        className={`admin-nav__item ${
          editorTab === 'story' ? 'admin-nav__item--active' : ''
        }`}
        onClick={() => setEditorTab('story')}
      >
        <TimelineIcon fontSize="small" /> 8. Love Story
      </button>
      <button
        type="button"
        className={`admin-nav__item ${
          editorTab === 'gifts' ? 'admin-nav__item--active' : ''
        }`}
        onClick={() => setEditorTab('gifts')}
      >
        <CardGiftcardIcon fontSize="small" /> 9. Hadiah Digital
      </button>
      <button
        type="button"
        className={`admin-nav__item ${
          editorTab === 'closing' ? 'admin-nav__item--active' : ''
        }`}
        onClick={() => setEditorTab('closing')}
      >
        <MovieIcon fontSize="small" /> 10. Closing & Credits
      </button>
      <button
        type="button"
        className={`admin-nav__item ${
          editorTab === 'rsvps' ? 'admin-nav__item--active' : ''
        }`}
        onClick={() => setEditorTab('rsvps')}
      >
        <AssignmentTurnedInIcon fontSize="small" /> 11. RSVP ({rsvps.length})
      </button>
    </nav>
  );
};
