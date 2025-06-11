// app/admin/dashboard/page.tsx
'use client'

import Sidebar from '@/components/Sidebar'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-primary-700">Bienvenido, Admin</h1>
      </main>
    </div>
  )
}
