import { useState } from "react"
import { Icon } from "../AdminSidebar"
import AdminLayout from "../layout/AdminLayout"
import BranchForm from "../forms/BranchForm"
import { getBranches, saveBranches, type Branch, type BranchValues } from "../../../features/branches/branches.store"

function exportBranches(branches: Branch[]) {
  const rows = [
    ["Branch", "Manager", "Address", "Status"],
    ...branches.map(({ name, manager, address, status }) => [name, manager, address, status]),
  ]
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "branches.csv"
  link.click()
  URL.revokeObjectURL(url)
}

function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>(getBranches)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All statuses")
  const [showForm, setShowForm] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [viewingBranch, setViewingBranch] = useState<Branch | null>(null)

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch = `${branch.name} ${branch.manager} ${branch.address}`.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "All statuses" || branch.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const saveBranch = (values: BranchValues) => {
    const nextBranches = editingBranch
      ? branches.map((branch) => branch.id === editingBranch.id ? { ...branch, ...values } : branch)
      : [{ ...values, id: crypto.randomUUID() }, ...branches]
    setBranches(nextBranches)
    saveBranches(nextBranches)
    setShowForm(false)
    setEditingBranch(null)
  }

  const removeBranch = (branch: Branch) => {
    if (!window.confirm(`Delete the ${branch.name} branch?`)) return
    const nextBranches = branches.filter((item) => item.id !== branch.id)
    setBranches(nextBranches)
    saveBranches(nextBranches)
  }

  return <AdminLayout eyebrow="Administration / Branches" title={<>MOTION <span className="font-normal text-[#899187]">· Branch management</span></>}>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Network operations</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Branches</h2><p className="mt-1.5 text-sm text-[#798177]">Manage branch locations, managers, and operating status.</p></div>
      <button onClick={() => { setEditingBranch(null); setShowForm(true) }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]"><Icon name="plus" className="h-4 w-4" />Add branch</button>
    </div>

    <section aria-label="Branch summary" className="mt-7 grid gap-3 sm:grid-cols-3">
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Total branches</p><p className="mt-3 text-2xl font-semibold tracking-tight">{branches.length.toString().padStart(2, "0")}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Open</p><p className="mt-3 text-2xl font-semibold tracking-tight">{branches.filter((branch) => branch.status === "Open").length}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Closed</p><p className="mt-3 text-2xl font-semibold tracking-tight">{branches.filter((branch) => branch.status === "Closed").length}</p></article>
    </section>

    <section className="mt-4 rounded-xl border border-[#e7e9e2] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6">
        <div><h3 className="text-sm font-semibold">Branch directory</h3><p className="mt-1 text-xs text-[#858d82]">Search, update, and maintain branch records</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187]"><Icon name="search" className="h-4 w-4" /><input aria-label="Search branches" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search branches" className="w-32 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197] sm:w-40" /></label>
          <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-lg border border-[#e6e9e1] bg-white px-2.5 text-xs text-[#596257] outline-none focus:border-[#81945e]"><option>All statuses</option><option>Open</option><option>Closed</option></select>
          <button onClick={() => exportBranches(filteredBranches)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-3 text-xs font-semibold text-[#596257] hover:bg-[#f8f9f6]"><Icon name="download" className="h-4 w-4" /><span className="hidden sm:inline">Export</span></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead><tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]"><th className="px-5 py-3">Branch</th><th className="px-5 py-3">Manager</th><th className="px-5 py-3">Address</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-[#f0f1ed]">
            {filteredBranches.map((branch) => <tr key={branch.id} className="text-xs hover:bg-[#fbfcf9]"><td className="px-5 py-4 font-semibold text-[#343d34]">{branch.name}</td><td className="px-5 py-4 text-[#687166]">{branch.manager}</td><td className="px-5 py-4 text-[#687166]">{branch.address}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${branch.status === "Open" ? "bg-[#edf5e5] text-[#638046]" : "bg-[#f8ece8] text-[#a35e4b]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{branch.status}</span></td><td className="px-5 py-4 text-right"><div className="inline-flex items-center gap-1"><button type="button" onClick={() => setViewingBranch(branch)} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#596257] hover:bg-[#f8f9f6]">View</button><button type="button" onClick={() => { setEditingBranch(branch); setShowForm(true) }} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#596257] hover:bg-[#f8f9f6]">Edit</button><button type="button" onClick={() => removeBranch(branch)} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#a35e4b] hover:bg-[#fff8f5]">Delete</button></div></td></tr>)}
            {filteredBranches.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-xs text-[#858d82]">No branches match this search.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredBranches.length} of {branches.length} branches</span><span>Saved in this browser</span></div>
    </section>

    {showForm && <BranchForm initialValues={editingBranch ? { name: editingBranch.name, manager: editingBranch.manager, address: editingBranch.address, status: editingBranch.status } : undefined} onClose={() => { setShowForm(false); setEditingBranch(null) }} onSave={saveBranch} />}
    {viewingBranch && <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-[#101713]/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewingBranch(null) }}><section role="dialog" aria-modal="true" aria-labelledby="branch-details-title" className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"><header className="flex items-start justify-between gap-4 bg-[#192820] px-6 py-5 text-white"><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55">Branch profile</p><h2 id="branch-details-title" className="mt-1 text-lg font-semibold">{viewingBranch.name}</h2></div><button type="button" aria-label="Close branch details" onClick={() => setViewingBranch(null)} className="grid h-9 w-9 place-items-center rounded-lg text-white/65 hover:bg-white/10"><Icon name="close" className="h-4 w-4" /></button></header><dl className="divide-y divide-[#edf0e9] px-6 py-2"><div className="py-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#899187]">Manager</dt><dd className="mt-1 text-sm font-medium text-[#303a31]">{viewingBranch.manager}</dd></div><div className="py-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#899187]">Address</dt><dd className="mt-1 text-sm font-medium text-[#303a31]">{viewingBranch.address}</dd></div><div className="py-3"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#899187]">Status</dt><dd className={`mt-1 text-sm font-semibold ${viewingBranch.status === "Open" ? "text-[#638046]" : "text-[#a35e4b]"}`}>{viewingBranch.status}</dd></div></dl></section></div>}
  </AdminLayout>
}

export default BranchesPage