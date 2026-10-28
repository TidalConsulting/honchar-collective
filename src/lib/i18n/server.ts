import "server-only";

import { cookies } from "next/headers";

import { DEFAULT_LANG, DICTIONARIES, LANG_COOKIE, isLang, type Lang } from "@/lib/i18n/dictionaries";

/** The visitor's chosen language, from the cookie the header toggle sets. Spanish by default. */
export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}

/** The dictionary for the visitor's language, plus the language itself. */
export async function getT() {
  const lang = await getLang();
  return { lang, t: DICTIONARIES[lang] };
}
