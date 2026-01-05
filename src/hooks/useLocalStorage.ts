import { useState, useEffect, useCallback } from "react";

const STORAGE_CHANGE_EVENT = "localStorageChange";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prevValue => {
      const newValue = typeof value === "function" ? (value as (prev: T) => T)(prevValue) : value;
      window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT, { detail: { key, value: newValue } }));
      return newValue;
    });
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Handle localStorage errors silently
    }
  }, [key, storedValue]);

  useEffect(() => {
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener(STORAGE_CHANGE_EVENT, handleCustomStorageChange as EventListener);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT, handleCustomStorageChange as EventListener);
  }, [key]);

  return [storedValue, setValue];
}
