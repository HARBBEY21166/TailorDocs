
// Local storage keys
export const API_KEY_STORAGE_KEY = 'jobmatch-gemini-api-key';

// Save API key to local storage
export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

// Get API key from local storage
export const getApiKey = (): string => {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
};

// Check if API key exists
export const hasApiKey = (): boolean => {
  const key = getApiKey();
  return key !== null && key !== '';
};

// Remove API key from local storage
export const clearApiKey = (): void => {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
};

// Save form data
export const saveFormData = (key: string, data: any): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Get form data
export const getFormData = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};
