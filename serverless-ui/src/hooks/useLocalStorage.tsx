import { useState, useEffect } from "react";

// Type for the value stored in localStorage
type StoredValue<T> = T | (() => T);

// Custom hook to handle localStorage
export default function useLocalStorage<T>(
  key: string,
  defaultValue: StoredValue<T>
): [T, (newValue: StoredValue<T>) => void] {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);

    return storedValue === null
      ? typeof defaultValue === "function"
        ? (defaultValue as () => T)()
        : defaultValue
      : JSON.parse(storedValue);
  });

  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === key) {
        setValue(JSON.parse(e.newValue || "null"));
      }
    };
    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [key]);

  const setValueInLocalStorage = (newValue: StoredValue<T>) => {
    setValue((currentValue) => {
      const result = typeof newValue === "function" ? (newValue as () => T)() : newValue;

      localStorage.setItem(key, JSON.stringify(result));

      return result;
    });
  };

  return [value, setValueInLocalStorage];
}
