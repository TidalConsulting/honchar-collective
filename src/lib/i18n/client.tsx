"use client";

import { createContext, useContext } from "react";

import { DEFAULT_LANG, DICTIONARIES, type Lang } from "@/lib/i18n/dictionaries";

const LangContext = createContext<Lang>(DEFAULT_LANG);

/**
 * Hands the language the server read from the cookie down to client
 * components. Only the language code crosses the server/client boundary; the
 * dictionaries are imported here directly, since they contain functions.
 */
export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useT() {
  const lang = useContext(LangContext);
  return { lang, t: DICTIONARIES[lang] };
}
