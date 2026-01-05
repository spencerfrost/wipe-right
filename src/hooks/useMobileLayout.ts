import { useLocalStorage } from "./useLocalStorage";

export type MobileLayout = "table" | "accordion" | "swipeable";

export function useMobileLayout(): [MobileLayout, (value: MobileLayout | ((prev: MobileLayout) => MobileLayout)) => void] {
  return useLocalStorage<MobileLayout>("wipe-right-mobile-layout", "table");
}
