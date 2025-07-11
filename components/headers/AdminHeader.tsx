'use client'

import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Sun, Moon, ChevronRight, Menu } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'

const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Productos',
  orders: 'Órdenes',
  employee: 'Empleados',
  financial: 'Finanzas',
  inicio: 'Inicio',
  costManagement: 'Gestión de Costos ',
  all: 'Todos',
}

export default function AdminHeader() {
  const pathname = usePathname()
  const { setIsOpen } = useSidebar()

  const pathSegments = pathname
    .split('/')
    .filter((seg) => seg !== '' && seg !== 'admin')

  return (
    <header className="flex items-center justify-between px-6 py-6 border-b sm:ml-14 transition-colors duration-300 bg-primary-50 dark:bg-primary-950">
      <div className="flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-200">
        <span className="hover:underline cursor-pointer">Dashboard</span>
        {pathSegments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            <span
              className={
                index === pathSegments.length - 1
                  ? 'text-black dark:text-white'
                  : 'hover:underline cursor-pointer'
              }
            >
              {breadcrumbLabels[segment] ||
                segment.charAt(0).toUpperCase() + segment.slice(1)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">


        {/* Botón menú hamburguesa en móviles */}
        <button
          onClick={() => setIsOpen(true)}
          className="sm:hidden p-2 text-primary-800 dark:text-primary-100"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  )
}
