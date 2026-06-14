import { create } from "zustand";

export const useLayout = create((set) => ({
  artist: "lildarkie",
  setArtist: (current) => set(() => ({ current })),
  mobileMenuOpen: false,
  setMobileMenuOpen: (mobileMenuOpen) => set(() => ({ mobileMenuOpen })),
  toggleMobileMenuOpen: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
}));

export const useCart = create((set) => ({
  cart: null,
  setCart: (cart) => set(() => ({ cart })),
  open: false,
  setOpen: (open) => set(() => ({ open })),
  toggleOpen: () => set((state) => ({ open: !state.open })),
  show: true,
  setShow: (show) => set(() => ({ show })),
}));
