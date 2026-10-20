import { useEffect, useState, type FormEvent } from "react"
import { createUserRole, getAllUserRoles, updateUserRole, type UserRole } from "../../../features/users/user-roles.api"
import { Icon } from "../AdminSidebar"
import AdminLayout from "../layout/AdminLayout"

type RolesPageProps = {
  onRolesUpdated: (role: UserRole) => void
}

function RolesPage({ onRolesUpdated }: RolesPageProps) {
  const [roles, setRoles] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [saveError, setSaveError] = useState("")
  const [search, setSearch] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [statusNotice, setStatusNotice] = useState<{ title: string; message: string } | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    getAllUserRoles(controller.signal)
      .then(setRoles)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setLoadError(error instanceof Error ? error.message : "Unable to load user roles.")
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  const filteredRoles = roles.filter((role) => `${role.name} ${role.description}`.toLowerCase().includes(search.toLowerCase()))

  const saveRole = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const values = {
      name: String(formData.get("name")).trim(),
      description: String(formData.get("description")).trim(),
    }

    setIsSaving(true)
    setSaveError("")
    try {
      const savedRole = isCreating ? await createUserRole(values) : selectedRole ? (await updateUserRole({ ...selectedRole, ...values })).role : null
      if (!savedRole) return

      setRoles((current) => isCreating ? [savedRole, ...current] : current.map((role) => role.userRoleId === savedRole.userRoleId ? savedRole : role))
      onRolesUpdated(savedRole)
      if (isCreating) {
        setIsCreating(false)
      } else {
        setSelectedRole(savedRole)
        setIsEditing(false)
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to update user role.")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleRoleStatus = async () => {
    if (!selectedRole) return

    setIsSaving(true)
    setSaveError("")
    try {
      const { role: savedRole, message } = await updateUserRole({ ...selectedRole, isActive: !selectedRole.isActive })
      setRoles((current) => current.map((role) => role.userRoleId === savedRole.userRoleId ? savedRole : role))
      onRolesUpdated(savedRole)
      const action = savedRole.isActive ? "activated" : "deactivated"
      setSelectedRole(null)
      setIsEditing(false)
      setStatusNotice({
        title: `Role ${action}`,
        message: message || `Role "${savedRole.name}" was ${action} successfully.`,
      })
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to update role status.")
    } finally {
      setIsSaving(false)
    }
  }

  const closeDialog = () => {
    if (isSaving) return
    setSelectedRole(null)
    setIsCreating(false)
    setIsEditing(false)
    setSaveError("")
  }

  return <AdminLayout eyebrow="Administration / Roles" title={<>MOTION <span className="font-normal text-[#899187]">· Role management</span></>}>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Team administration</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Roles</h2><p className="mt-1.5 text-sm text-[#798177]">Review role details and keep access descriptions up to date.</p></div>
      <button type="button" onClick={() => { setIsCreating(true); setIsEditing(true); setSaveError("") }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]"><Icon name="plus" className="h-4 w-4" />Create role</button>
    </div>

    <section aria-label="Role summary" className="mt-7 grid gap-3 sm:grid-cols-3">
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Total roles</p><p className="mt-3 text-2xl font-semibold tracking-tight">{roles.length.toString().padStart(2, "0")}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Active roles</p><p className="mt-3 text-2xl font-semibold tracking-tight">{roles.filter((role) => role.isActive).length}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Inactive roles</p><p className="mt-3 text-2xl font-semibold tracking-tight">{roles.filter((role) => !role.isActive).length}</p></article>
    </section>

    <section className="mt-4 rounded-xl border border-[#e7e9e2] bg-white">
      {loadError && <p role="alert" className="border-b border-[#f0d9d2] bg-[#fff8f5] px-5 py-3 text-xs text-[#a35e4b]">{loadError}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6">
        <div><h3 className="text-sm font-semibold">Role directory</h3><p className="mt-1 text-xs text-[#858d82]">Names, descriptions, and current availability</p></div>
        <label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187]"><Icon name="search" className="h-4 w-4" /><input aria-label="Search roles" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search roles" className="w-32 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197] sm:w-44" /></label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead><tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]"><th className="px-5 py-3">Name</th><th className="px-5 py-3">Description</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-[#f0f1ed]">
            {isLoading && <tr><td colSpan={4} className="px-6 py-12 text-center text-xs text-[#858d82]">Loading roles…</td></tr>}
            {!isLoading && filteredRoles.map((role) => <tr key={role.userRoleId} className="text-xs hover:bg-[#fbfcf9]">
              <td className="px-5 py-4 font-semibold text-[#343d34]">{role.name}</td>
              <td className="max-w-[32rem] truncate px-5 py-4 text-[#687166]">{role.description || "—"}</td>
              <td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${role.isActive ? "bg-[#edf5e5] text-[#638046]" : "bg-[#f8ece8] text-[#a35e4b]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{role.isActive ? "Active" : "Inactive"}</span></td>
              <td className="px-5 py-4 text-right"><div className="inline-flex items-center gap-1"><button type="button" onClick={() => { setSelectedRole(role); setIsEditing(false) }} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#596257] hover:bg-[#f8f9f6]">View</button><button type="button" onClick={() => { setSelectedRole(role); setIsEditing(true); setSaveError("") }} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#596257] hover:bg-[#f8f9f6]">Edit</button></div></td>
            </tr>)}
            {!isLoading && filteredRoles.length === 0 && <tr><td colSpan={4} className="px-6 py-12 text-center text-xs text-[#858d82]">{loadError ? "Roles could not be loaded." : "No roles match your search."}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredRoles.length} of {roles.length} roles</span><span>Live role directory</span></div>
    </section>

    {(selectedRole || isCreating) && <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-[#101713]/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog() }}>
      <section role="dialog" aria-modal="true" aria-labelledby="role-dialog-title" className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/30 bg-white shadow-[0_24px_80px_-24px_rgba(15,25,19,0.55)]">
        <header className="flex items-start justify-between gap-4 bg-[#192820] px-6 py-5 text-white sm:px-7">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">{isCreating ? "New access level" : isEditing ? "Update role" : "Role details"}</p><h2 id="role-dialog-title" className="mt-1 text-xl font-semibold">{isCreating ? "Create role" : isEditing ? "Edit role" : selectedRole?.name}</h2></div>
          <button type="button" aria-label="Close role details" onClick={closeDialog} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/65 transition-colors hover:bg-white/10 hover:text-white"><Icon name="close" className="h-4 w-4" /></button>
        </header>
        <form key={`${isCreating ? "create" : selectedRole?.userRoleId}-${isEditing ? "edit" : "view"}`} onSubmit={saveRole}>
          <div className="space-y-4 px-6 py-5 sm:px-7 sm:py-6">
            <label className="block text-xs font-medium text-[#596257]">Name<input name="name" required maxLength={100} readOnly={!isEditing} defaultValue={selectedRole?.name ?? ""} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none read-only:bg-[#f8f9f6] focus:border-[#81945e]" /></label>
            <label className="block text-xs font-medium text-[#596257]">Description<textarea name="description" required rows={4} maxLength={500} readOnly={!isEditing} defaultValue={selectedRole?.description ?? ""} className="mt-1.5 w-full resize-y rounded-lg border border-[#e1e5dc] px-3 py-2.5 text-sm font-normal text-[#202720] outline-none read-only:bg-[#f8f9f6] focus:border-[#81945e]" /></label>
            {selectedRole && <p className="text-[11px] text-[#858d82]">Status: <span className={selectedRole.isActive ? "font-semibold text-[#638046]" : "font-semibold text-[#a35e4b]"}>{selectedRole.isActive ? "Active" : "Inactive"}</span></p>}
            {saveError && <p role="alert" className="text-xs text-[#a35e4b]">{saveError}</p>}
          </div>
          <footer className="flex justify-end gap-2 border-t border-[#edf0e9] bg-[#fafbf8] px-6 py-4 sm:px-7">
            {!isCreating && isEditing && selectedRole && <button type="button" onClick={toggleRoleStatus} disabled={isSaving} className={`mr-auto h-9 rounded-lg border px-3.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${selectedRole.isActive ? "border-[#efd7cf] text-[#a35e4b] hover:bg-[#fff8f5]" : "border-[#dce8ce] text-[#638046] hover:bg-[#f5f9ef]"}`}>{selectedRole.isActive ? "Deactivate role" : "Activate role"}</button>}
            <button type="button" onClick={isCreating ? closeDialog : isEditing ? () => { setIsEditing(false); setSaveError("") } : closeDialog} disabled={isSaving} className="h-9 rounded-lg border border-[#e2e5dd] px-3.5 text-xs font-semibold text-[#596257] hover:bg-white disabled:opacity-50">{isEditing ? "Cancel" : "Close"}</button>
            {isEditing && <button type="submit" disabled={isSaving} className="h-9 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white hover:bg-[#293b30] disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? (isCreating ? "Creating…" : "Updating…") : isCreating ? "Create role" : "Update role"}</button>}
          </footer>
        </form>
      </section>
    </div>}
    {statusNotice && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-[#101713]/60 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setStatusNotice(null) }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="role-status-title" aria-describedby="role-status-message" className="w-full max-w-md overflow-hidden rounded-xl border border-white/30 bg-white shadow-[0_24px_80px_-24px_rgba(15,25,19,0.55)]">
        <div className="px-6 py-6 sm:px-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#75816d]">Role status</p>
          <h2 id="role-status-title" className="mt-2 text-lg font-semibold text-[#202720]">{statusNotice.title}</h2>
          <p id="role-status-message" className="mt-2 break-words text-sm leading-6 text-[#687166]">{statusNotice.message}</p>
        </div>
        <footer className="flex justify-end border-t border-[#edf0e9] bg-[#fafbf8] px-6 py-4 sm:px-7">
          <button type="button" autoFocus onClick={() => setStatusNotice(null)} className="h-9 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white hover:bg-[#293b30]">OK</button>
        </footer>
      </section>
    </div>}
  </AdminLayout>
}

export default RolesPage