import { createContext, type Dispatch, type SetStateAction } from 'react'

export const DesktopSidebarContext = createContext<
  [collapsed: boolean, setCollapsed: Dispatch<SetStateAction<boolean>>] | null
>(null)
