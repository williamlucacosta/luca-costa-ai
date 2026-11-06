"use client"

import { createContext, useContext } from "react"
import { getContent, type Locale } from "@/content/profile"

const LocaleContext = createContext<Locale>("en")

/** Set once per root layout (/ is English, /it is Italian); client components read the copy from it. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

export function useContent() {
  return getContent(useContext(LocaleContext))
}
