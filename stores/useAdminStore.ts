import { create } from 'zustand';
import type { RsvpRecord } from '@/types/rsvp';
import type {
  ClientRecord,
  InvitationRecord,
  InvitationStatus,
  SaasStats,
  WeddingConfig,
} from '@/types/wedding';

export type PrimaryTab = 'dashboard' | 'clients' | 'editor' | 'templates';
export type EditorTab =
  | 'template'
  | 'couple'
  | 'events'
  | 'media'
  | 'cover'
  | 'countdown'
  | 'gallery'
  | 'story'
  | 'gifts'
  | 'closing'
  | 'rsvps';

export interface ClientWithInvs extends ClientRecord {
  invitationsCount?: number;
  invitations?: {
    id: string;
    title: string;
    slug: string;
    status: InvitationStatus;
    templateId: string;
  }[];
}

export interface InvitationWithDetails extends InvitationRecord {
  client?: {
    id: string;
    name: string;
    phone?: string;
    package?: string;
  } | null;
  rsvpsCount?: number;
  attendingCount?: number;
}

export interface AdminToast {
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface CreateInvFormData {
  clientId: string;
  title: string;
  slug: string;
  templateId: string;
  status: InvitationStatus;
  eventDate: string;
}

export interface ClientFormData {
  id: string;
  name: string;
  phone: string;
  email: string;
  package: string;
  notes: string;
  status: 'active' | 'inactive';
}

export interface DeleteConfirmData {
  type: 'invitation' | 'client';
  id: string;
  title: string;
}

export interface AdminState {
  // Navigation
  primaryTab: PrimaryTab;
  editorTab: EditorTab;
  setPrimaryTab: (tab: PrimaryTab) => void;
  setEditorTab: (tab: EditorTab) => void;

  // SaaS Core Data
  clients: ClientWithInvs[];
  invitations: InvitationWithDetails[];
  stats: SaasStats | null;
  selectedInvitationId: string;

  // Scoped Editor
  config: WeddingConfig | null;
  editorSlug: string;
  editorStatus: InvitationStatus;
  rsvps: RsvpRecord[];
  rsvpStats: {
    totalResponses: number;
    attendingCount: number;
    notAttendingCount: number;
    totalGuests: number;
  };

  // Status & UI
  loading: boolean;
  configLoading: boolean;
  saving: boolean;
  uploading: string | null;
  toast: AdminToast | null;

  // Modals
  showCreateInvModal: boolean;
  createInvForm: CreateInvFormData;
  showClientModal: boolean;
  clientForm: ClientFormData;
  deleteConfirm: DeleteConfirmData | null;

  // Actions
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
  setToast: (toast: AdminToast | null) => void;
  setLoading: (loading: boolean) => void;
  setConfigLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setUploading: (field: string | null) => void;
  setSelectedInvitationId: (id: string) => void;
  setEditorSlug: (slug: string) => void;
  setEditorStatus: (status: InvitationStatus) => void;
  setConfig: (
    updater:
      | WeddingConfig
      | null
      | ((prev: WeddingConfig | null) => WeddingConfig | null),
  ) => void;
  setClients: (
    updater: ClientWithInvs[] | ((prev: ClientWithInvs[]) => ClientWithInvs[]),
  ) => void;
  setInvitations: (
    updater:
      | InvitationWithDetails[]
      | ((prev: InvitationWithDetails[]) => InvitationWithDetails[]),
  ) => void;
  setStats: (stats: SaasStats | null) => void;
  setRsvps: (rsvps: RsvpRecord[]) => void;
  setRsvpStats: (stats: AdminState['rsvpStats']) => void;

  // Modals actions
  setShowCreateInvModal: (show: boolean) => void;
  setCreateInvForm: (
    updater:
      | Partial<CreateInvFormData>
      | ((prev: CreateInvFormData) => CreateInvFormData),
  ) => void;
  setShowClientModal: (show: boolean) => void;
  setClientForm: (
    updater:
      | Partial<ClientFormData>
      | ((prev: ClientFormData) => ClientFormData),
  ) => void;
  setDeleteConfirm: (confirm: DeleteConfirmData | null) => void;

  // Async API Actions
  refreshSaasData: () => Promise<void>;
  loadInvitationConfig: (invitationId: string) => Promise<void>;
  openEditorForInvitation: (invitationId: string) => void;
}

let toastTimer: NodeJS.Timeout | null = null;

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial navigation
  primaryTab: 'dashboard',
  editorTab: 'template',
  setPrimaryTab: (primaryTab) => set({ primaryTab }),
  setEditorTab: (editorTab) => set({ editorTab }),

  // Initial core data
  clients: [],
  invitations: [],
  stats: null,
  selectedInvitationId: '',

  // Initial scoped editor
  config: null,
  editorSlug: '',
  editorStatus: 'draft',
  rsvps: [],
  rsvpStats: {
    totalResponses: 0,
    attendingCount: 0,
    notAttendingCount: 0,
    totalGuests: 0,
  },

  // UI state
  loading: true,
  configLoading: false,
  saving: false,
  uploading: null,
  toast: null,

  // Modals
  showCreateInvModal: false,
  createInvForm: {
    clientId: '',
    title: '',
    slug: '',
    templateId: 'netflix',
    status: 'draft',
    eventDate: new Date().toISOString().split('T')[0],
  },
  showClientModal: false,
  clientForm: {
    id: '',
    name: '',
    phone: '',
    email: '',
    package: 'Cinematic VIP',
    notes: '',
    status: 'active',
  },
  deleteConfirm: null,

  // Actions
  showToast: (type, message) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { type, message } });
    toastTimer = setTimeout(() => {
      set({ toast: null });
      toastTimer = null;
    }, 3500);
  },
  setToast: (toast) => set({ toast }),
  setLoading: (loading) => set({ loading }),
  setConfigLoading: (configLoading) => set({ configLoading }),
  setSaving: (saving) => set({ saving }),
  setUploading: (uploading) => set({ uploading }),
  setSelectedInvitationId: (selectedInvitationId) =>
    set({ selectedInvitationId }),
  setEditorSlug: (editorSlug) => set({ editorSlug }),
  setEditorStatus: (editorStatus) => set({ editorStatus }),
  setConfig: (updater) =>
    set((state) => ({
      config: typeof updater === 'function' ? updater(state.config) : updater,
    })),
  setClients: (updater) =>
    set((state) => ({
      clients: typeof updater === 'function' ? updater(state.clients) : updater,
    })),
  setInvitations: (updater) =>
    set((state) => ({
      invitations:
        typeof updater === 'function' ? updater(state.invitations) : updater,
    })),
  setStats: (stats) => set({ stats }),
  setRsvps: (rsvps) => set({ rsvps }),
  setRsvpStats: (rsvpStats) => set({ rsvpStats }),

  // Modal actions
  setShowCreateInvModal: (showCreateInvModal) => set({ showCreateInvModal }),
  setCreateInvForm: (updater) =>
    set((state) => ({
      createInvForm:
        typeof updater === 'function'
          ? updater(state.createInvForm)
          : { ...state.createInvForm, ...updater },
    })),
  setShowClientModal: (showClientModal) => set({ showClientModal }),
  setClientForm: (updater) =>
    set((state) => ({
      clientForm:
        typeof updater === 'function'
          ? updater(state.clientForm)
          : { ...state.clientForm, ...updater },
    })),
  setDeleteConfirm: (deleteConfirm) => set({ deleteConfirm }),

  // Async API Actions
  refreshSaasData: async () => {
    try {
      const [statsRes, clientsRes, invsRes] = await Promise.all([
        fetch('/api/admin/saas/stats'),
        fetch('/api/admin/saas/clients'),
        fetch('/api/admin/saas/invitations'),
      ]);

      if (statsRes.ok) {
        set({ stats: await statsRes.json() });
      }
      if (clientsRes.ok) {
        set({ clients: await clientsRes.json() });
      }
      if (invsRes.ok) {
        const invsData: InvitationWithDetails[] = await invsRes.json();
        set({ invitations: invsData });
        const currentSelected = get().selectedInvitationId;
        if (invsData.length > 0 && !currentSelected) {
          get().setSelectedInvitationId(invsData[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading SaaS data:', err);
      get().showToast('error', 'Gagal memuat data dari server SaaS');
    } finally {
      set({ loading: false });
    }
  },

  loadInvitationConfig: async (invitationId: string) => {
    if (!invitationId) return;
    set({ configLoading: true });
    try {
      const [cfgRes, rsvpRes] = await Promise.all([
        fetch(`/api/admin/saas/invitations/${invitationId}/config`),
        fetch(`/api/admin/saas/invitations/${invitationId}/rsvps`),
      ]);

      if (cfgRes.ok) {
        const cfg = await cfgRes.json();
        set({ config: cfg });
      } else {
        get().showToast('error', 'Gagal memuat konfigurasi undangan');
      }

      if (rsvpRes.ok) {
        const rsvpData = await rsvpRes.json();
        set({
          rsvps: rsvpData.rsvps || [],
          rsvpStats: {
            totalResponses: rsvpData.totalResponses || 0,
            attendingCount: rsvpData.attendingCount || 0,
            notAttendingCount: rsvpData.notAttendingCount || 0,
            totalGuests: rsvpData.totalGuests || 0,
          },
        });
      }

      // Sync local slug & status from invitations list
      const currentInv = get().invitations.find((i) => i.id === invitationId);
      if (currentInv) {
        set({
          editorSlug: currentInv.slug,
          editorStatus: currentInv.status,
        });
      }
    } catch (err) {
      console.error('Error loading tenant config:', err);
      get().showToast('error', 'Gagal memuat data spesifik undangan');
    } finally {
      set({ configLoading: false });
    }
  },

  openEditorForInvitation: (invitationId: string) => {
    set({
      selectedInvitationId: invitationId,
      primaryTab: 'editor',
    });
  },
}));
