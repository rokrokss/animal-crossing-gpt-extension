import { errorLog } from '@/logs';

type StorageArea = 'local' | 'sync' | 'session';

export const chromeStorageBackend = <T>(area: StorageArea = 'local') => {
  return {
    async getItem(key: string, initialValue: T): Promise<T> {
      const stored = await chrome.storage[area].get(key);
      return key in stored ? stored[key] : initialValue;
    },
    async setItem(key: string, value: T): Promise<void> {
      await chrome.storage[area].set({ [key]: value });
    },
    async removeItem(key: string): Promise<void> {
      await chrome.storage[area].remove(key);
    },
    subscribe(key: string, callback: (val: T) => void, initialValue: T) {
      const handler = (
        changes: { [key: string]: chrome.storage.StorageChange },
        namespace: chrome.storage.AreaName
      ) => {
        if (namespace === area && changes[key]) {
          callback(changes[key].newValue ?? initialValue);
        }
      };

      chrome.storage.onChanged.addListener(handler);
      return () => chrome.storage.onChanged.removeListener(handler);
    },
  };
};

export async function readStorage<T>(
  key: string,
  area: StorageArea = 'local'
): Promise<T | undefined> {
  try {
    const result = await chrome.storage[area].get(key);
    return result?.[key];
  } catch (error) {
    errorLog(`Error reading ${area} storage key "${key}":`, error);
    return undefined;
  }
}

export async function setStorage<T>(
  key: string,
  value: T,
  area: StorageArea = 'local'
): Promise<boolean> {
  try {
    await chrome.storage[area].set({ [key]: value });
    return true;
  } catch (error) {
    errorLog(`Error setting ${area} storage key "${key}":`, error);
    return false;
  }
}
