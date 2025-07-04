'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useAuthSlider } from '@/context/AuthSliderContext'

export default function AuthSlider() {
  const { isOpen, closeSlider } = useAuthSlider()

  useEffect(() => {
    if (!isOpen) return

    // Bloquear scroll y cerrar con ESC
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSlider()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeSlider])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Fondo oscuro desenfocado */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeSlider}
      />

      {/* Panel lateral derecho */}
      <div className="relative z-10 w-full max-w-md h-full bg-white shadow-xl animate-slide-in-right p-6 overflow-y-auto">
        {/* Botón cerrar */}
        <button
          onClick={closeSlider}
          className="absolute top-4 right-4 text-gray-700 hover:text-black"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Contenido de inicio de sesión */}
        <div className="pt-10 space-y-6">
          <img src="/tu-logo-o-icono.svg" alt="Logo" className="w-20 mx-auto" />
          <h2 className="text-center text-xl font-semibold text-gray-800">Hola 👋</h2>
          <p className="text-center text-gray-600 text-sm">¡Te extrañamos! Accede o regístrate</p>

          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Correo electrónico*</label>
              <input type="email" className="input w-full" placeholder="ejemplo@correo.com" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Contraseña*</label>
              <input type="password" className="input w-full" placeholder="••••••••" required />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 rounded-md transition"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            <a href="#" className="underline">¿Olvidaste tu contraseña?</a>
            <br />
            ¿Aún no tienes cuenta? <a href="#" className="font-semibold underline">Regístrate</a>
          </div>
        </div>
      </div>
    </div>
  )
}
