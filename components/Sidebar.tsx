// components/Sidebar.tsx
'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()

  const [activeHref, setActiveHref] = useState<string | null>(null)
  const handleClick = (href: string) => {
    setActiveHref(href)
  }
  const getClass = (href: string) => {
    const isActive = activeHref === href
    return `group flex h-12 w-12 items-center justify-center transition 
      ${isActive ? 'bg-[#4ac2c6] text-white' : 'bg-primary text-primary-700 hover:text-primary-400 hover:bg-primary/80'}`
  }
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-2 px-2 sm:py-5">

        <div className="relative flex h-12 w-12 items-center justify-center">
          <a
            href="/admin/dashboard"
            className={getClass('/admin/dashboard')}
            onClick={() => handleClick('/admin/dashboard')}
          >
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="300.000000pt" height="201.000000pt" viewBox="0 0 300.000000 201.000000" preserveAspectRatio="xMidYMid meet" className="h-8 w-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <g transform="translate(0.000000,201.000000) scale(0.050000,-0.050000)" fill="currentColor" stroke="none">
                <path d="M1685 2990 c-348 -76 -652 -381 -727 -729 l-21 -101 -108 0 c-129 0 -185 -54 -151 -145 23 -60 58 -75 171 -75 l85 0 35 -130 c273 -1007 1736 -909 1871 126 24 188 126 258 300 206 95 -28 112 -55 140 -234 50 -309 244 -569 536 -713 l171 -85 231 0 c492 1 843 287 951 775 11 50 20 55 103 55 126 0 168 27 168 107 0 90 -31 113 -152 113 l-104 0 -24 105 c-170 727 -1082 992 -1607 467 -101 -101 -233 -316 -233 -380 0 -40 -16 -40 -107 -2 -91 38 -205 38 -314 0 -47 -17 -87 -28 -89 -25 -1 3 -19 48 -38 100 -152 410 -638 662 -1087 565z m314 -211 c915 -149 766 -1521 -158 -1454 -848 60 -914 1289 -77 1454 47 9 91 18 96 19 6 1 68 -8 139 -19z m2471 -33 c407 -140 604 -624 413 -1014 -277 -562 -1094 -537 -1335 40 -243 580 325 1180 922 974z" />
              </g>
            </svg>
            <span className="absolute left-14 -ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out border border-gray-200
    pointer-events-none">
              Inicio
            </span>
          </a>

        </div>
        <div className="relative flex h-12 w-12 items-center justify-center">
          <a href="/admin/dashboard" className="group flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-700 hover:text-primary-400 hover:bg-primary/80 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-house h-5 w-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8">
              </path>
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
              </path>
            </svg>
            <span className="absolute left-14 -ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out border border-gray-200
    pointer-events-none">Dashboard
            </span>
          </a>

        </div>
        <div className="relative flex h-12 w-12 items-center justify-center">
          <a href="/admin/order" className="group flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-700 hover:text-primary-400 hover:bg-primary/80 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shopping-cart h-5 w-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <circle cx="8" cy="21" r="1">
              </circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12">
              </path>

            </svg>
            <span className="absolute left-14 -ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out border border-gray-200
    pointer-events-none">Ordenes
            </span>
          </a>
        </div>
        <div className="relative flex h-12 w-12 items-center justify-center">
          <a href="/admin/products" className="group flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-700 hover:text-primary-400 hover:bg-primary/80 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-package h-5 w-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <path d="m7.5 4.27 9 5.15">
              </path>
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z">
              </path>
              <path d="m3.3 7 8.7 5 8.7-5">
              </path>
              <path d="M12 22V12">
              </path>
            </svg>
            <span className="absolute left-14 -ml-4 top-1/2 -translate-y-1/2  whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out border border-gray-200
    pointer-events-none">Productos
            </span>
          </a>
        </div>

        <div className="relative flex h-12 w-12 items-center justify-center">
          <a href="/admin/employee" className="group flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-700 hover:text-primary-400 hover:bg-primary/80 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-users-round h-5 w-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <path d="M18 21a8 8 0 0 0-16 0">
              </path>
              <circle cx="10" cy="8" r="5">
              </circle>
              <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3">
              </path>
            </svg>
            <span className="absolute left-14 -ml-4 top-1/2 -translate-y-1/2  whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out border border-gray-200
    pointer-events-none">Empleados
            </span>
          </a>
        </div>
        <div className="relative flex h-12 w-12 items-center justify-center">
          <a href="/admin/financial" className="group flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-700 hover:text-primary-400 hover:bg-primary/80 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-line-chart h-5 w-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <path d="M3 3v18h18">
              </path>
              <path d="m19 9-5 5-4-4-3 3">
              </path>
            </svg>
            <span className="absolute left-14 -ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out border border-gray-200
    pointer-events-none"> Finanzas
            </span>
          </a>
        </div>
      </nav>
    </aside>
  )
}
