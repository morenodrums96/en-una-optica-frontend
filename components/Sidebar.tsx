// components/Sidebar.tsx
'use client'

import Link from 'next/link'

const navItems = [
  { label: 'Inicio', href: '/admin/dashboard', emoji: '🏠' },
  { label: 'Órdenes', href: '/admin/orders', emoji: '📦' },
  { label: 'Agregar productos', href: '/admin/products/new', emoji: '➕' },
  { label: 'Alta de empleados', href: '/admin/employees/new', emoji: '👤' },
  { label: 'Utilerías', href: '/admin/tools', emoji: '🛠️' },
  { label: 'Finanzas', href: '/admin/finances', emoji: '💰' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-primary-100 min-h-screen p-6 shadow-md">
      <h2 className="text-2xl font-bold text-primary-900 mb-6">Admin</h2>
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 text-primary-900 hover:text-primary-700 font-medium transition"
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
