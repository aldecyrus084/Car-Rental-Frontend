import { useState } from "react"
import { Icon } from "./AdminSidebar"
import AdminLayout from "./layout/AdminLayout"

const vehicles = [
  { model: "Toyota Corolla", plate: "KDA 284R", category: "Compact · 2023", location: "Westlands", status: "Available" },
  { model: "Honda CR-V", plate: "KDB 619M", category: "SUV · 2024", location: "Airport branch", status: "On rent" },
  { model: "Hyundai Tucson", plate: "KDC 407P", category: "SUV · 2022", location: "CBD branch", status: "Maintenance" },
  { model: "Mazda CX-5", plate: "KDD 852A", category: "SUV · 2023", location: "Westlands", status: "Available" },
]

const reports = [
  { name: "Fleet utilization", detail: "Vehicle performance", date: "Today, 09:42 AM", status: "Ready" },
  { name: "Revenue summary", detail: "Financial overview", date: "Yesterday, 04:18 PM", status: "Ready" },
  { name: "Maintenance log", detail: "Service and repairs", date: "Oct 10, 11:06 AM", status: "Ready" },
]

const chartData = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 51 },
  { day: "Thu", value: 78 },
  { day: "Fri", value: 59 },
  { day: "Sat", value: 88 },
  { day: "Sun", value: 71 },
]

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function AdminDashboard() {
  const [search, setSearch] = useState("")
  const [period, setPeriod] = useState("Last 7 days")
  const filteredVehicles = vehicles.filter((vehicle) => `${vehicle.model} ${vehicle.plate} ${vehicle.location} ${vehicle.status}`.toLowerCase().includes(search.toLowerCase()))

  const exportFleet = () => downloadCsv("fleet-overview.csv", [
    ["Vehicle", "Registration", "Category", "Location", "Status"],
    ...vehicles.map(({ model, plate, category, location, status }) => [model, plate, category, location, status]),
  ])

  const exportReport = (name: string) => downloadCsv(`${name.toLowerCase().replaceAll(" ", "-")}.csv`, [
    ["Report", "Vehicle", "Registration", "Status", "Location"],
    ...vehicles.map(({ model, plate, status, location }) => [name, model, plate, status, location]),
  ])

  return (
    <AdminLayout
      eyebrow="Monday, October 12, 2026"
      title={<>Good morning, Alex <span aria-hidden="true">✳</span></>}
      toolbar={<label className="hidden h-10 w-52 items-center gap-2 rounded-lg border border-[#e2e5dd] bg-white px-3 text-[#828a80] md:flex xl:w-64">
        <Icon name="search" className="h-4 w-4 shrink-0" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vehicles..." className="min-w-0 flex-1 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197]" />
        <kbd className="rounded border border-[#e7e9e2] px-1 text-[10px]">⌘ K</kbd>
      </label>}
    >
          <section className="flex flex-wrap items-end justify-between gap-4" aria-labelledby="overview-heading">
            <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Monday, October 12</p><h2 id="overview-heading" className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Operations overview</h2><p className="mt-1.5 text-sm text-[#798177]">Here’s what’s happening across your fleet today.</p></div>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="period">Report period</label>
              <select id="period" value={period} onChange={(event) => setPeriod(event.target.value)} className="h-10 rounded-lg border border-[#e1e5dc] bg-white px-3 text-xs font-medium text-[#475247] outline-none focus:border-[#81945e]">
                <option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option>
              </select>
              <button onClick={exportFleet} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#293b30] sm:px-4"><Icon name="download" className="h-4 w-4" /><span className="hidden sm:inline">Export</span></button>
            </div>
          </section>

          <section aria-label="Fleet statistics" className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-[#e7e9e2] bg-white p-5">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#788077]">Total fleet</span><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f0f3eb] text-[#52654e]"><Icon name="car" className="h-[18px] w-[18px]" /></span></div>
              <div className="mt-4 flex items-end justify-between"><p className="text-[30px] font-semibold leading-none tracking-tight">76</p><span className="text-[11px] font-medium text-[#75816d]">Across 3 branches</span></div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#eef0e9]"><div className="h-full w-full rounded-full bg-[#91a77a]" /></div>
            </article>
            <article className="rounded-xl border border-[#e7e9e2] bg-white p-5">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#788077]">Available units</span><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#edf5df] text-[#637f3e]"><span className="h-2.5 w-2.5 rounded-full bg-[#8aa94f]" /></span></div>
              <div className="mt-4 flex items-end justify-between"><p className="text-[30px] font-semibold leading-none tracking-tight">42</p><span className="text-[11px] font-medium text-[#71884d]">55% of fleet</span></div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#eef0e9]"><div className="h-full w-[55%] rounded-full bg-[#9bb767]" /></div>
            </article>
            <article className="rounded-xl border border-[#e7e9e2] bg-white p-5">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#788077]">Currently rented</span><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f9eee5] text-[#a76f45]"><Icon name="arrow" className="h-[17px] w-[17px]" /></span></div>
              <div className="mt-4 flex items-end justify-between"><p className="text-[30px] font-semibold leading-none tracking-tight">28</p><span className="text-[11px] font-medium text-[#a76f45]">+4 from last week</span></div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#eef0e9]"><div className="h-full w-[37%] rounded-full bg-[#d9a577]" /></div>
            </article>
            <article className="rounded-xl border border-[#e7e9e2] bg-white p-5">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-[#788077]">In maintenance</span><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#faece9] text-[#b86b55]"><Icon name="clock" className="h-[17px] w-[17px]" /></span></div>
              <div className="mt-4 flex items-end justify-between"><p className="text-[30px] font-semibold leading-none tracking-tight">6</p><span className="text-[11px] font-medium text-[#b86b55]">2 due back today</span></div>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#eef0e9]"><div className="h-full w-[8%] rounded-full bg-[#dc8b72]" /></div>
            </article>
          </section>

          <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.65fr_1fr]">
            <article className="rounded-xl border border-[#e7e9e2] bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-sm font-semibold">Revenue overview</h3><p className="mt-1 text-xs text-[#858d82]">Rental revenue · {period.toLowerCase()}</p></div><div className="text-right"><p className="text-2xl font-semibold tracking-tight">$48,290</p><p className="mt-1 text-[11px] font-medium text-[#648044]">↑ 12.8% <span className="font-normal text-[#92998f]">vs previous period</span></p></div></div>
              <div className="relative mt-7 h-[190px]">
                <div className="absolute inset-0 flex flex-col justify-between pb-7"><div className="border-t border-dashed border-[#e9ece5]" /><div className="border-t border-dashed border-[#e9ece5]" /><div className="border-t border-dashed border-[#e9ece5]" /><div className="border-t border-dashed border-[#e9ece5]" /></div>
                <div className="relative flex h-full items-end justify-around gap-2 px-2 pb-7">
                  {chartData.map((point, index) => <div key={point.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div title={`${point.day}: $${Math.round(point.value * 54)}`} className={`w-full max-w-9 rounded-t-[5px] transition-colors ${index === 5 ? "bg-[#293f31]" : "bg-[#c9d5bd] hover:bg-[#9caf87]"}`} style={{ height: `${point.value}%` }} /><span className="absolute bottom-0 text-[10px] text-[#969d93]" style={{ left: `${7 + index * 14.3}%` }}>{point.day}</span></div>)}
                </div>
              </div>
            </article>

            <article id="reservations" className="scroll-mt-24 rounded-xl border border-[#e7e9e2] bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between"><div><h3 className="text-sm font-semibold">Upcoming returns</h3><p className="mt-1 text-xs text-[#858d82]">Next vehicles due back</p></div><a href="#fleet" className="text-xs font-semibold text-[#637e49] hover:text-[#34452b]">View fleet <span aria-hidden="true">→</span></a></div>
              <div className="mt-5 space-y-4">
                {[
                  { name: "Honda CR-V", customer: "Maya Johnson", time: "10:30 AM", color: "bg-[#f3e5d8] text-[#976444]" },
                  { name: "Volkswagen Golf", customer: "Noah Williams", time: "12:15 PM", color: "bg-[#e4ebdc] text-[#60774c]" },
                  { name: "Nissan Qashqai", customer: "Olivia Brown", time: "02:00 PM", color: "bg-[#e8e8ef] text-[#666783]" },
                ].map((booking) => <div key={booking.name} className="flex items-center gap-3"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${booking.color}`}><Icon name="car" className="h-[18px] w-[18px]" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{booking.name}</p><p className="mt-1 truncate text-[11px] text-[#8b9289]">{booking.customer}</p></div><span className="shrink-0 text-[11px] font-medium text-[#596257]">{booking.time}</span></div>)}
              </div>
              <a href="#reservations" className="mt-5 flex w-full items-center justify-center rounded-lg border border-[#e6e9e1] py-2.5 text-xs font-semibold text-[#586355] hover:bg-[#f8f9f6]">All bookings <span className="ml-2 text-[#8f988a]">12</span></a>
            </article>
          </section>

          <section id="fleet" className="mt-4 scroll-mt-24 rounded-xl border border-[#e7e9e2] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6">
              <div><h3 className="text-sm font-semibold">Fleet status</h3><p className="mt-1 text-xs text-[#858d82]">A live view of your vehicles</p></div>
              <div className="flex items-center gap-2">
                <label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187] md:hidden"><Icon name="search" className="h-4 w-4" /><input aria-label="Search vehicles" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search fleet" className="w-28 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197]" /></label>
                <button onClick={exportFleet} className="rounded-lg border border-[#e6e9e1] px-3 py-2 text-xs font-semibold text-[#596257] hover:bg-[#f8f9f6]">Export list</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead><tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]"><th className="px-6 py-3">Vehicle</th><th className="px-4 py-3">Registration</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Status</th><th className="px-6 py-3 text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-[#f0f1ed]">
                  {filteredVehicles.map((vehicle) => <tr key={vehicle.plate} className="text-xs hover:bg-[#fbfcf9]"><td className="px-6 py-3.5"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#f1f3ee] text-[#596b54]"><Icon name="car" className="h-[17px] w-[17px]" /></span><span><span className="block font-semibold text-[#343d34]">{vehicle.model}</span><span className="mt-1 block text-[10px] text-[#939a90]">{vehicle.category}</span></span></div></td><td className="px-4 py-3.5 font-medium text-[#586157]">{vehicle.plate}</td><td className="px-4 py-3.5 text-[#747d72]"><span className="inline-flex items-center gap-1.5"><Icon name="pin" className="h-3.5 w-3.5 text-[#9da498]" />{vehicle.location}</span></td><td className="px-4 py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${vehicle.status === "Available" ? "bg-[#edf5e5] text-[#638046]" : vehicle.status === "On rent" ? "bg-[#fbf0e5] text-[#a46e42]" : "bg-[#f8ece8] text-[#a35e4b]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{vehicle.status}</span></td><td className="px-6 py-3.5 text-right"><button aria-label={`More actions for ${vehicle.model}`} className="rounded-md px-2 py-1 text-base text-[#858d82] hover:bg-[#f0f2ec]">···</button></td></tr>)}
                  {filteredVehicles.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-xs text-[#858d82]">No vehicles match “{search}”.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredVehicles.length} of 76 vehicles</span><a href="#fleet" className="font-semibold text-[#687b54]">View all vehicles →</a></div>
          </section>

          <section id="reports" className="mt-4 scroll-mt-24 rounded-xl border border-[#e7e9e2] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6"><div><h3 className="text-sm font-semibold">Report history</h3><p className="mt-1 text-xs text-[#858d82]">Recently generated fleet reports</p></div><button onClick={() => exportReport("fleet-report")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#637e49] hover:text-[#34452b]">Generate report <Icon name="arrow" className="h-3.5 w-3.5" /></button></div>
            <div className="divide-y divide-[#f0f1ed]">
              {reports.map((report) => <div key={report.name} className="flex flex-wrap items-center gap-3 px-5 py-3.5 sm:px-6"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#f0f3eb] text-[#687b54]"><Icon name="chart" className="h-[17px] w-[17px]" /></div><div className="min-w-[140px] flex-1"><p className="text-xs font-semibold">{report.name}</p><p className="mt-1 text-[10px] text-[#939a90]">{report.detail}</p></div><span className="hidden text-[11px] text-[#858d82] sm:block">{report.date}</span><span className="rounded-full bg-[#edf5e5] px-2.5 py-1 text-[10px] font-medium text-[#638046]">{report.status}</span><button onClick={() => exportReport(report.name)} aria-label={`Download ${report.name} report`} className="grid h-8 w-8 place-items-center rounded-lg text-[#737d70] hover:bg-[#f2f4ef]"><Icon name="download" className="h-4 w-4" /></button></div>)}
            </div>
          </section>
          <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-[#9ba197]"><span>Fleet operations · All figures update in real time</span><span className="inline-flex items-center gap-1.5"><Icon name="clock" className="h-3.5 w-3.5" />Last synced 2 minutes ago</span></footer>
    </AdminLayout>
  )
}

export default AdminDashboard