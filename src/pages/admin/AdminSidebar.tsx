import { NavLink, useLocation } from "react-router-dom"
import type { ReactNode } from "react"

type IconName = "grid" | "car" | "chart" | "users" | "wrench" | "map" | "wallet" | "search" | "bell" | "menu" | "close" | "download" | "arrow" | "pin" | "clock" | "plus"

export function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
    car: <><path d="m5 11 1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" /><path d="M3 11h18v7H3z" /><path d="M6 18v2m12-2v2M3 14h2m14 0h2" /><circle cx="7" cy="15" r="1" /><circle cx="17" cy="15" r="1" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m7 14 4-4 4 3 6-7" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    wrench: <><path d="M14.7 6.3a5 5 0 0 0-6.6 6.6L3 18l3 3 5.1-5.1a5 5 0 0 0 6.6-6.6L14 12l-2-2 2.7-3.7Z" /><path d="m16 8 3-3" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15m6-12v15" /></>,
    wallet: <><rect x="3" y="5" width="18" height="15" rx="2" /><path d="M3 9h18M16 14h2" /><path d="M6 5V3h12v2" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
  }

  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

const navigation = [
  { label: "Overview", to: "/admin", icon: "grid" as const, end: true },
  { label: "Cars", to: "/admin/cars", icon: "car" as const },
  { label: "Rentals", to: "/admin/rentals", icon: "clock" as const },
  { label: "Pricing", to: "/admin/pricing", icon: "chart" as const },
  { label: "Pricing areas", to: "/admin/pricing-areas", icon: "map" as const },
  { label: "Vehicle types", to: "/admin/vehicle-types", icon: "car" as const },
  { label: "Customers", to: "/admin/customers", icon: "users" as const },
  { label: "Users", to: "/admin/users", icon: "users" as const },
  { label: "Maintenance", to: "/admin/maintenance", icon: "wrench" as const },
  { label: "Locations", to: "/admin/locations", icon: "map" as const },
  { label: "Payments", to: "/admin/payments", icon: "wallet" as const },
]

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()

  return <>
    {open && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-[#192820] px-5 py-6 text-white transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between px-1">
        <NavLink to="/admin" onClick={onClose} className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c8ef73] text-[#192820]"><Icon name="car" /></span>
          <span><span className="block text-[15px] font-semibold tracking-wide">MOTION</span><span className="mt-0.5 block text-[10px] uppercase tracking-[0.2em] text-white/50">Fleet operations</span></span>
        </NavLink>
        <button aria-label="Close navigation" onClick={onClose} className="rounded-lg p-2 text-white/65 hover:bg-white/10 lg:hidden"><Icon name="close" /></button>
      </div>

      <div className="mt-11 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Workspace</div>
      <nav aria-label="Main navigation" className="mt-3 space-y-1">
        {navigation.map((item) => {
          const active = item.end ? pathname === item.to : pathname === item.to || pathname.startsWith(`${item.to}/`)
          return <NavLink key={item.label} to={item.to} end={item.end} onClick={onClose} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${active ? "bg-[#c8ef73] font-semibold text-[#192820]" : "text-white/65 hover:bg-white/[0.07] hover:text-white"}`}>
            <Icon name={item.icon} className="h-[18px] w-[18px]" /><span>{item.label}</span>
          </NavLink>
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center gap-2 text-xs font-medium"><span className="h-2 w-2 rounded-full bg-[#c8ef73]" /> Fleet systems operational</div>
        <p className="mt-2 text-[11px] leading-5 text-white/45">All branches are reporting normally.</p>
        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#e9b58a] text-xs font-bold text-[#39271e]">AM</div>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Alex Morgan</p><p className="mt-0.5 text-[10px] text-white/45">Administrator</p></div>
          <span className="text-white/45">···</span>
        </div>
      </div>
    </aside>
  </>
}

export default AdminSidebar