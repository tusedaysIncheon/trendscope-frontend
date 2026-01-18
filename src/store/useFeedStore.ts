import { create } from "zustand";

type TabType = "rec" | "following";

interface FeedState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  activeTab: "rec", 
  setActiveTab: (tab) => set({ activeTab: tab }),
}));