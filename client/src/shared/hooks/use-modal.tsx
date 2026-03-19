import { create } from 'zustand';

interface ModalStore {
  modals: Record<string, boolean>;
  onOpen: (id: string) => void;
  onClose: (id: string) => void;
}

const useModalStore = create<ModalStore>((set) => ({
  modals: {},
  onOpen: (id) => set((state) => ({ modals: { ...state.modals, [id]: true } })),
  onClose: (id) => set((state) => ({ modals: { ...state.modals, [id]: false } })),
}));

export const useModal = (id: string) => {
  const { modals, onOpen, onClose } = useModalStore();
  return {
    isOpen: modals[id] ?? false,
    onOpen: () => onOpen(id),
    onClose: () => onClose(id),
  };
};
