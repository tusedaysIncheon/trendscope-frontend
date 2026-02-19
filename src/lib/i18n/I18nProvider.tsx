import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  type Language,
} from "./translations";

type InterpolationValues = Record<string, string | number>;

type I18nContextValue = {
  language: Language;
  setLanguage: (next: Language) => void;
  t: (key: string, values?: InterpolationValues) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function isSupportedLanguage(value: string | null): value is Language {
  return !!value && SUPPORTED_LANGUAGES.includes(value as Language);
}

function resolveLanguage(value: string | null): Language {
  if (isSupportedLanguage(value)) {
    return value;
  }
  return DEFAULT_LANGUAGE;
}

function getValueByPath(source: unknown, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);

  return typeof value === "string" ? value : undefined;
}

function interpolate(template: string, values?: InterpolationValues): string {
  if (!values) {
    return template;
  }
  return Object.entries(values).reduce((result, [key, value]) => {
    return result.split(`{{${key}}}`).join(String(value));
  }, template);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_LANGUAGE;
    }
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return resolveLanguage(saved);
  });

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  const t = useCallback(
    (key: string, values?: InterpolationValues) => {
      const exact = getValueByPath(TRANSLATIONS[language], key);
      if (exact) {
        return interpolate(exact, values);
      }

      const fallback = getValueByPath(TRANSLATIONS[DEFAULT_LANGUAGE], key);
      if (fallback) {
        return interpolate(fallback, values);
      }

      return key;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
