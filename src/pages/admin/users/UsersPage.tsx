import { useEffect, useState } from "react"
import { Icon } from "../AdminSidebar"
import AddUserForm from "../forms/AddUserForm"
import AdminLayout from "../layout/AdminLayout"
import { createUser, getUsers, updateUserStatus, type StaffUser, type UserStatus } from "../../../features/users/users.api"

const roles = ["Super Admin", "Manager", "Staff", "Cashier"]
const branches = ["Head Office", "Airport branch", "Westlands", "CBD branch"]

function exportUsers(users: StaffUser[]) {
  const rows = [
    ["Name", "Email", "Role", "Branch", "Status"],
    ...users.map(({ name, email, role, branch, status }) => [name, email, role, branch, status]),
  ]
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "users.csv"
  link.click()
  URL.revokeObjectURL(url)
}

function UsersPage() {
  const [users, setUsers] = useState<StaffUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All roles")
  const [statusFilter, setStatusFilter] = useState("All statuses")
  const [showForm, setShowForm] = useState(false)

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
    const matchesSearch = `${user.name} ${user.email} ${user.role} ${user.branch}`.toLowerCase().includes(search.toLowerCase())
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

  const toggleStatus = async (email: string) => {
    const currentUser = users.find((user) => user.email === email)
    if (!currentUser) return

    const status: UserStatus = currentUser.status === "Active" ? "Suspended" : "Active"
    try {
      const updatedUser = await updateUserStatus(email, status)
      setUsers((current) => current.map((user) => user.email === email ? updatedUser : user))
      setLoadError("")
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to update user status.")
    }
  }

  return <AdminLayout eyebrow="Administration / Users" title={<>MOTION <span className="font-normal text-[#899187]">· User management</span></>}>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Team administration</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Users</h2><p className="mt-1.5 text-sm text-[#798177]">Manage staff access, roles, and branch assignments.</p></div>
      <button onClick={() => setShowForm(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]"><Icon name="plus" className="h-4 w-4" />Add user</button>
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
          <label><span className="sr-only">Filter by role</span><select aria-label="Filter by role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-9 rounded-lg border border-[#e6e9e1] bg-white px-2.5 text-xs text-[#596257] outline-none focus:border-[#81945e]"><option>All roles</option>{roles.map((role) => <option key={role}>{role}</option>)}</select></label>
          <label><span className="sr-only">Filter by status</span><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 rounded-lg border border-[#e6e9e1] bg-white px-2.5 text-xs text-[#596257] outline-none focus:border-[#81945e]"><option>All statuses</option><option>Active</option><option>Suspended</option></select></label>
          <button onClick={() => exportUsers(filteredUsers)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-3 text-xs font-semibold text-[#596257] hover:bg-[#f8f9f6]"><Icon name="download" className="h-4 w-4" /><span className="hidden sm:inline">Export</span></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead><tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]"><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Branch</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Account access</th></tr></thead>
          <tbody className="divide-y divide-[#f0f1ed]">
            {isLoading && <tr><td colSpan={5} className="px-6 py-12 text-center text-xs text-[#858d82]">Loading users…</td></tr>}
            {filteredUsers.map((user) => <tr key={user.email} className="text-xs hover:bg-[#fbfcf9]">
              <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e9ede4] text-[11px] font-semibold text-[#53634e]">{user.name.split(" ").map((part) => part[0]).join("")}</span><span className="min-w-0"><span className="block font-semibold text-[#343d34]">{user.name}</span><span className="mt-1 block text-[11px] text-[#858d82]">{user.email}</span></span></div></td>
              <td className="px-5 py-4"><span className="inline-flex rounded-md bg-[#f1f3ee] px-2.5 py-1 text-[10px] font-medium text-[#596653]">{user.role}</span></td>
              <td className="px-5 py-4 text-[#687166]">{user.branch}</td>
              <td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${user.status === "Active" ? "bg-[#edf5e5] text-[#638046]" : "bg-[#f8ece8] text-[#a35e4b]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{user.status}</span></td>
              <td className="px-5 py-4 text-right"><button onClick={() => toggleStatus(user.email)} className={`rounded-md border px-2.5 py-1.5 text-[10px] font-medium ${user.status === "Active" ? "border-[#e6e9e1] text-[#747d72] hover:border-[#d7a998] hover:text-[#a35e4b]" : "border-[#dce6d1] text-[#637e49] hover:bg-[#f3f7ee]"}`}>{user.status === "Active" ? "Suspend" : "Activate"}</button></td>
            </tr>)}
            {!isLoading && filteredUsers.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-xs text-[#858d82]">{loadError ? "Users could not be loaded." : "No users match these filters."}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredUsers.length} of {users.length} users</span><span>Demo data · changes aren’t saved to a backend</span></div>
    </section>
    {showForm && <AddUserForm roles={roles} branches={branches} onClose={() => setShowForm(false)} onSave={addUser} />}
  </AdminLayout>
}

export default UsersPage
