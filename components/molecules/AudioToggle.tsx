'use client';

import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import type React from 'react';

export interface AudioToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export const AudioToggle: React.FC<AudioToggleProps> = ({
  isPlaying,
  onToggle,
}) => {
  return (
    <button
      type="button"
      className={`audio-player__btn ${isPlaying ? 'is-playing' : ''}`}
      onClick={onToggle}
      aria-label={isPlaying ? 'Jeda Musik Latar' : 'Putar Musik Latar'}
      title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
    >
      {isPlaying ? (
        <MusicNoteIcon
          className="audio-player__icon-spin"
          sx={{ fontSize: 24 }}
          aria-hidden="true"
        />
      ) : (
        <VolumeOffIcon sx={{ fontSize: 22 }} aria-hidden="true" />
      )}
    </button>
  );
};
