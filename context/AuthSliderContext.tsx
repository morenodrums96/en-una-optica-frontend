'use client'
import { createContext, useContext, useState } from 'react'

interface AuthSliderContextType {
  isOpen: boolean
  openSlider: () => void
  closeSlider: () => void
}

const AuthSliderContext = createContext<AuthSliderContextType | undefined>(undefined)

export const AuthSliderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openSlider = () => setIsOpen(true)
  const closeSlider = () => setIsOpen(false)

  return (
    <AuthSliderContext.Provider value={{ isOpen, openSlider, closeSlider }}>
      {children}
    </AuthSliderContext.Provider>
  )
}

export const useAuthSlider = () => {
  const context = useContext(AuthSliderContext)
  if (!context) throw new Error('useAuthSlider debe usarse dentro de AuthSliderProvider')
  return context
}
