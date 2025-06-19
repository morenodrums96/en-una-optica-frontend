'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ShoppingCart,
  Package,
  UsersRound,
  LineChart,
  LogOut,
  Sun,
  Moon,
  Folders,
  Image 
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import InicioIcon from '@/components/icons/InicioIcon'

const navItems = [
  { href: '/admin/inicio', icon: <InicioIcon className="h-5 w-5" />, label: 'Inicio' },
  { href: '/admin/dashboard', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
  { href: '/admin/orders', icon: <ShoppingCart className="h-5 w-5" />, label: 'Órdenes' },
  { href: '/admin/products', icon: <Package className="h-5 w-5" />, label: 'Productos' },
  { href: '/admin/employee', icon: <UsersRound className="h-5 w-5" />, label: 'Empleados' },
  { href: '/admin/financial', icon: <LineChart className="h-5 w-5" />, label: 'Finanzas' },
  { href: '/admin/catalogs', icon: <Folders   className="h-5 w-5" />, label: 'Catálogos' },
  { href: '/admin/gallery', icon: <Image className="h-5 w-5" />, label: 'Marketing Media' },

]

export default function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <aside className="group fixed inset-y-0 left-0 z-10 hidden w-14 hover:w-48 sm:flex flex-col border-r bg-primary-100 dark:bg-primary-950 transition-all duration-300 ease-in-out">
      <nav className="flex flex-col items-center sm:items-start gap-2 px-1 py-5 flex-grow">
        {navItems.map(({ href, icon, label }) => {
          const isActive = pathname === href
          return (
            <div key={href} className="relative flex h-12 w-full items-center">
              <Link
                href={href}
                className={`group flex h-12 w-full items-center gap-3 px-3.5 rounded-md transition
                  ${isActive
                    ? 'bg-[#84dbdc] dark:bg-[#2a8790] text-primary-950 dark:text-white'
                    : 'bg-primary text-primary-700 dark:text-primary-100 hover:text-primary-400 hover:bg-primary/80'
                  }`}
              >
                <div className="min-w-[1.25rem] flex items-center justify-center">
                  {icon}
                </div>
                <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300 text-sm font-medium text-primary-900 dark:text-primary-100">
                  {label}
                </span>
                <span
                  className={`absolute right-2 h-2 w-2 rounded-full 
                    ${isActive ? 'bg-white dark:bg-primary-100 group-hover:opacity-100 opacity-0' : 'opacity-0'}
                    transition-opacity duration-200`}
                />

              </Link>
            </div>
          )
        })}
      </nav>

      <div className="flex flex-col items-center sm:items-start gap-2 px-2 pb-4 mt-auto">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="group flex w-full h-12 items-center gap-3 px-4 rounded-md text-primary-700 dark:text-primary-100 hover:text-primary-400 hover:bg-primary/80 transition"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300 text-sm font-medium text-primary-900 dark:text-primary-100">
              Tema
            </span>
          </button>
        )}
        <button
          onClick={() => alert('Cerrar sesión')}
          className="group flex w-full h-12 items-center gap-3 px-4 rounded-md text-primary-700 dark:text-primary-100 hover:text-primary-400 hover:bg-primary/80 transition"
        >
          <LogOut className="h-5 w-5" />
          <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 group-hover:ml-1 transition-all duration-300 text-sm font-medium text-primary-900 dark:text-primary-100">
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  )
}
