import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"
import type { CreateUserRequest } from "../../../features/users/users.api"
import type { UserRole } from "../../../features/users/user-roles.api"

type AddUserFormProps = {
    roles: UserRole[]
    rolesLoadError: string
    branches: string[]
    onClose: () => void
    onSave: (values: CreateUserRequest) => Promise<void>
}

interface UserInformations {
    firstName: string;
    middleName: string | null;
    lastName: string;
    role: string;
    phoneNumber: string;
    branch: number;
    email: string;
    password: string;
    confirm_password: string;
}


function AddUserForm({ roles, rolesLoadError, branches, onClose, onSave }: AddUserFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState("")
    const [submitError, setSubmitError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [values, setValues] = useState<UserInformations>({
        firstName: "",
        middleName: "",
        lastName: "",
        role: "",
        phoneNumber: "",
        branch: 0,
        email: "",
        password: "",
        confirm_password: "",
    });

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const userData: UserInformations = {
            ...values,
            middleName: values.middleName?.trim() || null,
        };

        if (userData.password !== userData.confirm_password) {
            setPasswordError("Passwords do not match.")
            return
        }

        setIsSubmitting(true)
        setSubmitError("")
        try {
            await onSave({
                firstName: userData.firstName,
                middleName: userData.middleName,
                lastName: userData.lastName,
                userRoleId: userData.role,
                phoneNumber: userData.phoneNumber,
                branch: branches[userData.branch] ?? "",
                email: userData.email,
                password: userData.password,
            })
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : "Unable to create user.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
        <section role="dialog" aria-modal="true" aria-labelledby="user-form-title" className="max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><h2 id="user-form-title" className="text-lg font-semibold">Add user</h2><p className="mt-1 text-xs text-[#858d82]">Create an account for a member of your team.</p></div><button aria-label="Close user form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
            <form onSubmit={submit} className="mt-5 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="block text-xs font-medium text-[#596257]">First Name<input required autoComplete="given-name" value={values.firstName.trim()} onChange={(event) => setValues((current) => ({ ...current, firstName: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Middle Name<input autoComplete="additional-name" value={values.middleName?.trim() ?? ""} onChange={(event) => setValues((current) => ({ ...current, middleName: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Last Name<input required autoComplete="family-name" value={values.lastName} onChange={(event) => setValues((current) => ({ ...current, lastName: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Role<select required value={values.role} disabled={roles.length === 0} onChange={(event) => setValues((current) => ({ ...current, role: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e] disabled:cursor-not-allowed disabled:bg-[#f3f4f1]"><option value="">{roles.length ? "Select a role" : "No active roles available"}</option>{roles.map((role) => <option key={role.userRoleId} value={role.userRoleId}>{role.name}</option>)}</select>{rolesLoadError && <span role="alert" className="mt-1 block text-[11px] text-[#a35e4b]">{rolesLoadError}</span>}</label>
                <label className="block text-xs font-medium text-[#596257]">Phone Number<input required autoComplete="tel" value={values.phoneNumber} onChange={(event) => setValues((current) => ({ ...current, phoneNumber: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Email<input required autoComplete="email" value={values.email.trim()} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Password<span className="mt-1.5 flex h-10 items-center rounded-lg border border-[#e1e5dc] pr-2 focus-within:border-[#81945e]"><input required type={showPassword ? "text" : "password"} autoComplete="new-password" value={values.password} onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))} className="h-full min-w-0 flex-1 rounded-lg px-3 text-sm font-normal text-[#202720] outline-none" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="px-1 text-xs font-medium text-[#596257] hover:text-[#202720]">{showPassword ? "Hide" : "Show"}</button></span></label>
                <label className="block text-xs font-medium text-[#596257]">Confirm Password<span className="mt-1.5 flex h-10 items-center rounded-lg border border-[#e1e5dc] pr-2 focus-within:border-[#81945e]"><input required type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={values.confirm_password} onChange={(event) => { setValues((current) => ({ ...current, confirm_password: event.target.value })); setPasswordError("") }} className="h-full min-w-0 flex-1 rounded-lg px-3 text-sm font-normal text-[#202720] outline-none" /><button type="button" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} onClick={() => setShowConfirmPassword((visible) => !visible)} className="px-1 text-xs font-medium text-[#596257] hover:text-[#202720]">{showConfirmPassword ? "Hide" : "Show"}</button></span>{passwordError && <span role="alert" className="mt-1 block text-[11px] text-[#a35e4b]">{passwordError}</span>}</label>
                <label className="block text-xs font-medium text-[#596257]">Branch<select value={values.branch} onChange={(event) => setValues((current) => ({ ...current, branch: Number(event.target.value) }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]">{branches.map((branch, index) => <option key={branch} value={index}>{branch}</option>)}</select></label>
                <div className="col-span-full flex items-center justify-between gap-3 border-t border-[#edf0e9] pt-4">{submitError && <p role="alert" className="text-xs text-[#a35e4b]">{submitError}</p>}<div className="ml-auto flex gap-2"><button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257] disabled:opacity-50">Cancel</button><button type="submit" disabled={isSubmitting} className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Creating…" : "Create user"}</button></div></div>
            </form>
        </section>
    </div>
}

export default AddUserForm
