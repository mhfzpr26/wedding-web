import { create } from 'zustand';

export interface InvitationState {
  coverOpened: boolean;
  audioPlaying: boolean;
  audioMuted: boolean;
  trailerPlaying: boolean;
  hasInteracted: boolean;
  guestName: string;
  invitationSlug: string;

  // Actions
  openCover: () => void;
  setAudioPlaying: (playing: boolean) => void;
  toggleAudio: () => void;
  setTrailerPlaying: (playing: boolean) => void;
  setGuestName: (name: string) => void;
  setInvitationSlug: (slug: string) => void;
  reset: () => void;
}

export const useInvitationStore = create<InvitationState>((set) => ({
  coverOpened: false,
  audioPlaying: false,
  audioMuted: false,
  trailerPlaying: false,
  hasInteracted: false,
  guestName: '',
  invitationSlug: '',

  openCover: () => {
    set({ coverOpened: true, audioPlaying: true, hasInteracted: true });
  },

  setAudioPlaying: (playing: boolean) => {
    set({ audioPlaying: playing });
  },

  toggleAudio: () => {
    set((state) => ({ audioPlaying: !state.audioPlaying }));
  },

  setTrailerPlaying: (playing: boolean) => {
    set({ trailerPlaying: playing });
  },

  setGuestName: (name: string) => {
    set({ guestName: name });
  },

  setInvitationSlug: (slug: string) => {
    set({ invitationSlug: slug });
  },

  reset: () => {
    set({
      coverOpened: false,
      audioPlaying: false,
      audioMuted: false,
      trailerPlaying: false,
      hasInteracted: false,
    });
  },
}));
