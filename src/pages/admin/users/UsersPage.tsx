import { useEffect, useState } from "react"
import { Icon } from "../AdminSidebar"
import AddUserForm from "../forms/AddUserForm"
import UpdateUserForm from "../forms/UpdateUserForm"
import AdminLayout from "../layout/AdminLayout"
import { createUser, getUsers, updateUser, type StaffUser } from "../../../features/users/users.api"
import type { UserRole } from "../../../features/users/user-roles.api"
import { getBranches } from "../../../features/branches/branches.store"

type UsersPageProps = {
  roles: UserRole[]
  rolesLoadError: string
}

function exportUsers(users: StaffUser[]) {
  const rows = [
    ["Name", "Email", "Phone number", "Role", "Status"],
    ...users.map(({ name, email, phoneNumber, role, status }) => [name, email, phoneNumber, role, status]),
  ]
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "users.csv"
  link.click()
  URL.revokeObjectURL(url)
}

function UsersPage({ roles, rolesLoadError }: UsersPageProps) {
  const [users, setUsers] = useState<StaffUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All roles")
  const [statusFilter, setStatusFilter] = useState("All statuses")
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null)
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null)
  const [branches, setBranches] = useState(() => getBranches().filter((branch) => branch.isActive).map((branch) => branch.name))

  useEffect(() => {
    const controller = new AbortController()
    getUsers(controller.signal)
      .then(setUsers)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load users.")
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email} ${user.phoneNumber} ${user.role}`.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "All roles" || user.role === roleFilter
    const matchesStatus = statusFilter === "All statuses" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })
  const activeCount = users.filter((user) => user.status === "Active").length
  const cashierCount = users.filter((user) => user.role === "Cashier").length

  const addUser = async (values: Parameters<typeof createUser>[0]) => {
    const user = await createUser(values)
    setUsers((current) => [user, ...current])
    setShowForm(false)
  }

  const saveUser = async (values: Parameters<typeof updateUser>[1]) => {
    if (!editingUser) return
    const updatedUser = await updateUser(editingUser.userId, values)
    setUsers((current) => current.map((user) => user.userId === editingUser.userId ? updatedUser : user))
    setEditingUser(null)
  }

  return <AdminLayout eyebrow="Administration / Users" title={<>MOTION <span className="font-normal text-[#899187]">· User management</span></>}>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Team administration</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Users</h2><p className="mt-1.5 text-sm text-[#798177]">Manage staff access, roles, and branch assignments.</p></div>
      <button onClick={() => { setBranches(getBranches().filter((branch) => branch.isActive).map((branch) => branch.name)); setShowForm(true) }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]"><Icon name="plus" className="h-4 w-4" />Add user</button>
    </div>

    <section aria-label="User summary" className="mt-7 grid gap-3 sm:grid-cols-3">
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Total users</p><p className="mt-3 text-2xl font-semibold tracking-tight">{users.length.toString().padStart(2, "0")}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Active accounts</p><p className="mt-3 text-2xl font-semibold tracking-tight">{activeCount}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Cashiers</p><p className="mt-3 text-2xl font-semibold tracking-tight">{cashierCount}</p></article>
    </section>

    <section className="mt-4 rounded-xl border border-[#e7e9e2] bg-white">
      {loadError && <p role="alert" className="border-b border-[#f0d9d2] bg-[#fff8f5] px-5 py-3 text-xs text-[#a35e4b]">{loadError}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6">
        <div><h3 className="text-sm font-semibold">Team directory</h3><p className="mt-1 text-xs text-[#858d82]">Manage account roles and access status</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187]"><Icon name="search" className="h-4 w-4" /><input aria-label="Search users" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users" className="w-32 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197] sm:w-40" /></label>
          <label><span className="sr-only">Filter by role</span><select aria-label="Filter by role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-9 rounded-lg border border-[#e6e9e1] bg-white px-2.5 text-xs text-[#596257] outline-none focus:border-[#81945e]"><option>All roles</option>{roles.map((role) => <option key={role.userRoleId}>{role.name}</option>)}</select></label>
          <label><span className="sr-only">Filter by status</span><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-lg border border-[#e6e9e1] bg-white px-2.5 text-xs text-[#596257] outline-none focus:border-[#81945e]"><option>All statuses</option><option>Active</option><option>Inactive</option></select></label>
          <button onClick={() => exportUsers(filteredUsers)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-3 text-xs font-semibold text-[#596257] hover:bg-[#f8f9f6]"><Icon name="download" className="h-4 w-4" /><span className="hidden sm:inline">Export</span></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead><tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]"><th className="px-5 py-3">Full name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Phone number</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-[#f0f1ed]">
            {isLoading && <tr><td colSpan={6} className="px-6 py-12 text-center text-xs text-[#858d82]">Loading users…</td></tr>}
            {filteredUsers.map((user) => <tr key={user.email} className="text-xs hover:bg-[#fbfcf9]">
              <td className="px-5 py-4 font-semibold text-[#343d34]">{user.name}</td>
              <td className="px-5 py-4 text-[#687166]">{user.email}</td>
              <td className="px-5 py-4 text-[#687166]">{user.phoneNumber}</td>
              <td className="px-5 py-4"><span className="inline-flex rounded-md bg-[#f1f3ee] px-2.5 py-1 text-[10px] font-medium text-[#596653]">{user.role}</span></td>
              <td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${user.status === "Active" ? "bg-[#edf5e5] text-[#638046]" : "bg-[#f8ece8] text-[#a35e4b]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{user.status}</span></td>
              <td className="px-5 py-4 text-right"><div className="inline-flex items-center gap-1"><button type="button" onClick={() => { setBranches(getBranches().filter((branch) => branch.isActive).map((branch) => branch.name)); setEditingUser(user) }} className="rounded-md border border-[#e6e9e1] px-2 py-1.5 text-[10px] font-medium text-[#596257] hover:bg-[#f8f9f6]">Update</button><button type="button" onClick={() => setSelectedUser(user)} className="rounded-md border border-[#e6e9e1] px-2 py-1.5 text-[10px] font-medium text-[#596257] hover:bg-[#f8f9f6]">View</button></div></td>
            </tr>)}
            {!isLoading && filteredUsers.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-xs text-[#858d82]">{loadError ? "Users could not be loaded." : "No users match these filters."}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredUsers.length} of {users.length} users</span><span>Live user directory</span></div>
    </section>
    {showForm && <AddUserForm roles={roles} rolesLoadError={rolesLoadError} branches={branches} onClose={() => setShowForm(false)} onSave={addUser} />}
    {editingUser && <UpdateUserForm user={editingUser} roles={roles} branches={branches} onClose={() => setEditingUser(null)} onSave={saveUser} />}
    {selectedUser && <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-[#101713]/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedUser(null) }}>
      <section role="dialog" aria-modal="true" aria-labelledby="user-details-title" className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/30 bg-white shadow-[0_24px_80px_-24px_rgba(15,25,19,0.55)]">
        <header className="bg-[#192820] px-6 py-6 text-white sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#c8ef73] text-sm font-bold text-[#192820]">{selectedUser.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
              <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">User profile</p><h2 id="user-details-title" className="mt-1 truncate text-xl font-semibold">{selectedUser.name}</h2><p className="mt-1 truncate text-xs text-white/65">{selectedUser.email}</p></div>
            </div>
            <button type="button" aria-label="Close user details" onClick={() => setSelectedUser(null)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/65 transition-colors hover:bg-white/10 hover:text-white"><Icon name="close" className="h-4 w-4" /></button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
            <span className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/90">{selectedUser.role}</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${selectedUser.status === "Active" ? "bg-[#e7f4d5] text-[#4f7134]" : "bg-[#f8e7e2] text-[#a35e4b]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{selectedUser.status}</span>
          </div>
        </header>
        <div className="px-6 py-5 sm:px-7 sm:py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#92998e]">Contact information</p>
          <dl className="mt-3 divide-y divide-[#edf0e9]">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3"><dt className="text-xs text-[#858d82]">Email address</dt><dd className="min-w-0 break-all text-right text-sm font-medium text-[#303a31]"><a className="hover:text-[#638046]" href={`mailto:${selectedUser.email}`}>{selectedUser.email}</a></dd></div>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3"><dt className="text-xs text-[#858d82]">Phone number</dt><dd className="text-right text-sm font-medium text-[#303a31]"><a className="hover:text-[#638046]" href={`tel:${selectedUser.phoneNumber}`}>{selectedUser.phoneNumber}</a></dd></div>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3"><dt className="text-xs text-[#858d82]">Account role</dt><dd className="text-right text-sm font-medium text-[#303a31]">{selectedUser.role}</dd></div>
          </dl>
        </div>
        <footer className="flex items-center justify-between border-t border-[#edf0e9] bg-[#fafbf8] px-6 py-4 sm:px-7">
          <span className="text-[11px] text-[#858d82]">Account status</span>
          <span className={`text-xs font-semibold ${selectedUser.status === "Active" ? "text-[#638046]" : "text-[#a35e4b]"}`}>{selectedUser.status}</span>
        </footer>
      </section>
    </div>}
  </AdminLayout>
}

export default UsersPage
