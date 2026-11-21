import { useSyncExternalStore } from "react";
import vie from "./vie.json";
import en from "./en.json";

const STORAGE_KEY = "app_lang";

const resources = {
  vie,
  vi: vie,
  en,
};

const normalizeLang = (lang) => {
  if (!lang) return "vie";
  const lower = String(lang).toLowerCase();
  if (lower === "en" || lower.startsWith("en-")) return "en";
  return "vie";
};

let currentLanguage = normalizeLang(
  typeof window !== "undefined" && window.localStorage
    ? window.localStorage.getItem(STORAGE_KEY)
    : "vie",
);

const listeners = new Set();

const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;
  return String(path)
    .split(".")
    .reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

const interpolate = (str, params) => {
  if (typeof str !== "string" || !params) return str;
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) =>
    params[key] !== undefined ? String(params[key]) : `{{${key}}}`,
  );
};

const i18n = {
  get language() {
    return currentLanguage;
  },

  exists(key, lang = currentLanguage) {
    const dict = resources[normalizeLang(lang)] || resources.vie;
    return getNestedValue(dict, key) !== undefined;
  },

  t(key, paramsOrFallback) {
    const dict = resources[currentLanguage] || resources.vie;
    let value = getNestedValue(dict, key);

    if (value === undefined) {
      // Fallback to vie if key is missing
      value = getNestedValue(resources.vie, key);
    }

    if (value === undefined) {
      return typeof paramsOrFallback === "string" ? paramsOrFallback : key;
    }

    if (paramsOrFallback && typeof paramsOrFallback === "object") {
      return interpolate(value, paramsOrFallback);
    }

    return value;
  },

  changeLanguage(nextLang) {
    const normalized = normalizeLang(nextLang);
    if (normalized === currentLanguage) return;
    currentLanguage = normalized;
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, normalized);
    }
    listeners.forEach((listener) => listener());
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot() {
    return currentLanguage;
  },
};

/**
 * Localize success messages from Backend RestResponse (used in axios interceptor)
 */
export const translateApiSuccess = (resData) => {
  if (!resData || typeof resData !== "object") return resData;

  const code = resData.code;
  if (code && i18n.exists(`apiSuccess.${code}`)) {
    resData.message = i18n.t(`apiSuccess.${code}`);
    return resData;
  }

  // Handle cases where message directly contains code SUC_...
  if (typeof resData.message === "string" && i18n.exists(`apiSuccess.${resData.message}`)) {
    resData.message = i18n.t(`apiSuccess.${resData.message}`);
  }

  return resData;
};

/**
 * Localize error messages from Backend RestResponse (used in axios interceptor)
 */
export const translateApiError = (errorData) => {
  if (!errorData || typeof errorData !== "object") return errorData;

  const errorCode = errorData.error;
  if (typeof errorCode === "string" && i18n.exists(`apiError.${errorCode}`)) {
    errorData.message = i18n.t(`apiError.${errorCode}`);
    return errorData;
  }

  // Handle cases where message directly contains code ERR_...
  if (typeof errorData.message === "string" && i18n.exists(`apiError.${errorData.message}`)) {
    errorData.message = i18n.t(`apiError.${errorData.message}`);
  }

  return errorData;
};

/**
 * Standard React Hook for i18n translation
 */
export const useTranslation = () => {
  const language = useSyncExternalStore(i18n.subscribe, i18n.getSnapshot);
  return {
    t: (key, params) => i18n.t(key, params),
    i18n,
    language,
  };
};

export default i18n;
