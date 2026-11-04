import { useEffect, useState } from "react"
import { Icon } from "../AdminSidebar"
import AdminLayout from "../layout/AdminLayout"
import { useLoadingModal } from "../../../components/LoadingModalContext"
import { getRoles, type UserRole } from "../../../features/roles/roles.api"


function RolesPage() {
  const { showLoader, hideLoader } = useLoadingModal()
  const [roles, setRoles] = useState<UserRole[]>([])
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadRoles() {
      try {
        showLoader("Loading roles...")
        setError(null)
        const data = await getRoles()
        if (!cancelled) setRoles(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load roles.")
        }
      } finally {
        if (!cancelled) hideLoader()
      }
    }

    loadRoles()
  }, [])

  const filteredRoles = roles.filter((role) =>
    `${role.name} ${role.description}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <AdminLayout
      eyebrow="Administration / Roles"
      title={<>MOTION <span className="font-normal text-[#899187]">· Role management</span></>}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Team administration</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Roles</h2>
        <p className="mt-1.5 text-sm text-[#798177]">Review role details and current availability.</p>
      </div>

      <section aria-label="Role summary" className="mt-7 grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-[#e7e9e2] bg-white p-5">
          <p className="text-xs font-medium text-[#788077]">Total roles</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">{roles.length.toString().padStart(2, "0")}</p>
        </article>
        <article className="rounded-xl border border-[#e7e9e2] bg-white p-5">
          <p className="text-xs font-medium text-[#788077]">Active roles</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">{roles.filter((role) => role.isActive).length}</p>
        </article>
        <article className="rounded-xl border border-[#e7e9e2] bg-white p-5">
          <p className="text-xs font-medium text-[#788077]">Inactive roles</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">{roles.filter((role) => !role.isActive).length}</p>
        </article>
      </section>

      <section className="mt-4 rounded-xl border border-[#e7e9e2] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-sm font-semibold">Role directory</h3>
            <p className="mt-1 text-xs text-[#858d82]">Names, descriptions, and current availability</p>
          </div>
          <label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187]">
            <Icon name="search" className="h-4 w-4" />
            <input
              aria-label="Search roles"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search roles"
              className="w-32 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197] sm:w-44"
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f1ed]">
              {error ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-xs text-[#a35e4b]">
                    {error}
                  </td>
                </tr>
              ) : filteredRoles.map((role) => (
                <tr key={role.userRoleId} className="text-xs hover:bg-[#fbfcf9]">
                  <td className="px-5 py-4 font-semibold text-[#343d34]">{role.name}</td>
                  <td className="max-w-[32rem] truncate px-5 py-4 text-[#687166]">{role.description || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${role.isActive ? "bg-[#edf5e5] text-[#638046]" : "bg-[#f8ece8] text-[#a35e4b]"}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {role.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]">
          <span>Showing {filteredRoles.length} of {roles.length} roles</span>
          <span>Loaded from API</span>
        </div>
      </section>
    </AdminLayout>
  )
}

export default RolesPage
