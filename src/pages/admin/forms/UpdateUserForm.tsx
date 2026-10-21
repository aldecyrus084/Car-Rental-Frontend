import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"
import type { StaffUser, UpdateUserRequest, UserStatus } from "../../../features/users/users.api"
import type { UserRole } from "../../../features/users/user-roles.api"

type UpdateUserFormProps = {
  user: StaffUser
  roles: UserRole[]
  branches: string[]
  onClose: () => void
  onSave: (values: UpdateUserRequest) => Promise<void>
}

function UpdateUserForm({ user, roles, branches, onClose, onSave }: UpdateUserFormProps) {
  const [values, setValues] = useState(() => ({
    firstName: user.firstName,
    middleName: user.middleName ?? "",
    lastName: user.lastName,
    userRoleId: user.userRoleId ?? roles.find((role) => role.name === user.role)?.userRoleId ?? "",
    phoneNumber: user.phoneNumber,
    branch: user.branch,
    email: user.email,
    password: "",
    status: user.status,
  }))
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError("")
    setIsSubmitting(true)
    try {
      await onSave({
        firstName: values.firstName.trim(),
        middleName: values.middleName.trim() || null,
        lastName: values.lastName.trim(),
        userRoleId: values.userRoleId,
        phoneNumber: values.phoneNumber.trim(),
        branch: values.branch,
        email: values.email.trim(),
        ...(values.password ? { password: values.password } : {}),
        isActive: values.status === "Active",
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to update user.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = "mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]"
  const selectClass = `${inputClass} bg-white`
  const roleIsAvailable = roles.some((role) => role.userRoleId === values.userRoleId)

  return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="update-user-title" className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div><h2 id="update-user-title" className="text-lg font-semibold">Update user</h2><p className="mt-1 text-xs text-[#858d82]">Edit account details and access status.</p></div>
        <button type="button" aria-label="Close update user form" onClick={onClose} disabled={isSubmitting} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef] disabled:opacity-50"><Icon name="close" className="h-5 w-5" /></button>
      </div>
      <form onSubmit={submit} className="mt-5 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
        <label className="block text-xs font-medium text-[#596257]">First name<input required autoComplete="given-name" value={values.firstName} onChange={(event) => setValues((current) => ({ ...current, firstName: event.target.value }))} className={inputClass} /></label>
        <label className="block text-xs font-medium text-[#596257]">Middle name<input autoComplete="additional-name" value={values.middleName} onChange={(event) => setValues((current) => ({ ...current, middleName: event.target.value }))} className={inputClass} /></label>
        <label className="block text-xs font-medium text-[#596257]">Last name<input required autoComplete="family-name" value={values.lastName} onChange={(event) => setValues((current) => ({ ...current, lastName: event.target.value }))} className={inputClass} /></label>
        <label className="block text-xs font-medium text-[#596257]">Role<select required value={values.userRoleId} onChange={(event) => setValues((current) => ({ ...current, userRoleId: event.target.value }))} className={selectClass}>
          <option value="" disabled>Select a role</option>
          {!roleIsAvailable && values.userRoleId && <option value={values.userRoleId}>{user.role} (current)</option>}
          {roles.map((role) => <option key={role.userRoleId} value={role.userRoleId}>{role.name}</option>)}
        </select></label>
        <label className="block text-xs font-medium text-[#596257]">Phone number<input required autoComplete="tel" value={values.phoneNumber} onChange={(event) => setValues((current) => ({ ...current, phoneNumber: event.target.value }))} className={inputClass} /></label>
        <label className="block text-xs font-medium text-[#596257]">Email<input required type="email" autoComplete="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} className={inputClass} /></label>
        <label className="block text-xs font-medium text-[#596257]">Branch<select value={values.branch} onChange={(event) => setValues((current) => ({ ...current, branch: event.target.value }))} className={selectClass}>
          <option value="" disabled>Select a branch</option>
          {values.branch && !branches.includes(values.branch) && <option value={values.branch}>{values.branch} (current)</option>}
          {branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
        </select></label>
        <label className="block text-xs font-medium text-[#596257]">Status<select value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as UserStatus }))} className={selectClass}>
          <option value="Active">Active</option>
          <option value="Inactive">Deactivated</option>
        </select></label>
        <label className="block text-xs font-medium text-[#596257] sm:col-span-2">New password <span className="font-normal text-[#858d82]">(leave blank to keep the current password)</span><input type="password" autoComplete="new-password" value={values.password} onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))} className={inputClass} /></label>
        <div className="col-span-full flex items-center justify-between gap-3 border-t border-[#edf0e9] pt-4">
          {submitError && <p role="alert" className="text-xs text-[#a35e4b]">{submitError}</p>}
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257] disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={isSubmitting || !values.userRoleId} className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Saving…" : "Save changes"}</button>
          </div>
        </div>
      </form>
    </section>
  </div>
}

export default UpdateUserForm
