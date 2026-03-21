import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FavoriteItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  addedAt: number;
};

type FavoritesState = {
  items: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, "addedAt">) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (item: Omit<FavoriteItem, "addedAt">) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      addFavorite: (item) =>
        set((state) => ({
          items: state.items.some((i) => i.id === item.id)
            ? state.items
            : [...state.items, { ...item, addedAt: Date.now() }]
        })),
      removeFavorite: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id)
        })),
      toggleFavorite: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        if (exists) {
          get().removeFavorite(item.id);
        } else {
          get().addFavorite(item);
        }
      },
      isFavorite: (id) => get().items.some((i) => i.id === id),
      clearFavorites: () => set({ items: [] })
    }),
    {
      name: "jay-malhar-favorites",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
