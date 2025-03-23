import { create } from "zustand"

type SearchStore = {
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearch: () => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: "" }),
}))

