import { useState, type ReactNode } from "react"
import AdminSidebar, { Icon } from "../AdminSidebar"

type AdminLayoutProps = {
  eyebrow: string
  title: ReactNode
  toolbar?: ReactNode
  children: ReactNode
}

function AdminLayout({ eyebrow, title, toolbar, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return <div className="min-h-screen bg-[#f5f6f2] text-[#202720] antialiased">
    <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <div className="min-h-screen lg:pl-[264px]">
      <header className="sticky top-0 z-20 border-b border-[#e7e9e2] bg-[#f5f6f2]/95 backdrop-blur">
        <div className="flex h-[76px] items-center gap-3 px-4 sm:px-7 xl:px-10">
          <button aria-label="Open navigation" onClick={() => setSidebarOpen(true)} className="rounded-lg border border-[#e2e5dd] bg-white p-2 text-[#485248] lg:hidden"><Icon name="menu" /></button>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-[#788077]">{eyebrow}</p>
            <h1 className="mt-0.5 truncate text-lg font-semibold tracking-tight sm:text-xl">{title}</h1>
          </div>
          {toolbar}
          <button aria-label="Notifications" className="relative grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#e2e5dd] bg-white text-[#536054]"><Icon name="bell" className="h-[18px] w-[18px]" /><span className="absolute right-[9px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#e4835b] ring-2 ring-white" /></button>
          <div className="hidden h-9 w-9 place-items-center rounded-full bg-[#e9b58a] text-xs font-bold text-[#39271e] sm:grid">AM</div>
        </div>
      </header>
      <main className="mx-auto max-w-[1500px] px-4 pb-10 pt-7 sm:px-7 xl:px-10">{children}</main>
    </div>
  </div>
}

export default AdminLayout
