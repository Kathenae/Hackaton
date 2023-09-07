import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
   children: React.ReactNode
   defaultTheme?: Theme
   storageKey?: string
}

type ThemeProviderState = {
   theme: Theme,
   systemIsDark: boolean
   setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
   theme: "system",
   systemIsDark: false,
   setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
   children,
   defaultTheme = "system",
   storageKey = "vite-ui-theme",
   ...props
}: ThemeProviderProps) {
   const [theme, setTheme] = useState<Theme>(
      () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
   )
   const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches

   useEffect(() => {
      const root = window.document.documentElement

      root.classList.remove("light", "dark")

      if (theme === "system") {
         const systemTheme = systemIsDark ? "dark" : "light"
         root.classList.add(systemTheme)
         return
      }

      root.classList.add(theme)
   }, [theme, systemIsDark])

   const value = {
      theme,
      systemIsDark,
      setTheme: (theme: Theme) => {
         localStorage.setItem(storageKey, theme)
         setTheme(theme)
      },
   }

   return (
      <ThemeProviderContext.Provider {...props} value={value}>
         {children}
      </ThemeProviderContext.Provider>
   )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
   const context = useContext(ThemeProviderContext)

   if (context === undefined)
      throw new Error("useTheme must be used within a ThemeProvider")

   return context
}
