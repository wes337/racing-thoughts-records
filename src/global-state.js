import { create } from "zustand";

const useGlobalState = create((set) => ({
  cartOpen: false,
  setCartOpen: (cartOpen) => set(() => ({ cartOpen })),
  toggleCartOpen: () => set((state) => ({ cartOpen: !state.cartOpen })),
  showCart: true,
  setShowCart: (showCart) => set(() => ({ showCart })),
  mobileMenuOpen: false,
  setMobileMenuOpen: (mobileMenuOpen) => set(() => ({ mobileMenuOpen })),
  toggleMobileMenuOpen: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
}));

export default useGlobalState;
