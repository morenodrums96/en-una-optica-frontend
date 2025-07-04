// app/admin/layout.tsx
'use client'

import Sidebar from '@/components/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">{children}</main>

    </div>
  )
}
