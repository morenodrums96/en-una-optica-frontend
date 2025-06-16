'use client'

import Sidebar from '@/components/Sidebar'
import AdminHeader from '@/components/AdminHeader'
import { SidebarProvider } from '@/context/SidebarContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 transition-colors duration-300 bg-background text-foreground">
          <AdminHeader />
          <main className="transition-colors duration-300 ml-14 flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
