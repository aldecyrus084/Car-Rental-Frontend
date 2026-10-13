import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"

type AddUserFormProps = {
    roles: string[]
    branches: string[]
    onClose: () => void
    onSave: (values: Record<string, string>) => void
}

interface UserInformations {
    firstName: string;
    middleName: string | null;
    lastName: string;
    role: number;
    phoneNumber: string;
    branch: number;
    email: string;
    password: string;
    confirm_password: string;
}


function AddUserForm({ roles, branches, onClose, onSave }: AddUserFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState("")
    const [values, setValues] = useState<UserInformations>({
        firstName: "",
        middleName: "",
        lastName: "",
        role: 0,
        phoneNumber: "",
        branch: 0,
        email: "",
        password: "",
        confirm_password: "",
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        const userData: UserInformations = {
            ...values,
            middleName: values.middleName?.trim() || null,
        };

        if (userData.password !== userData.confirm_password) {
            setPasswordError("Passwords do not match.")
            return
        }

        onSave({
            name: [userData.firstName, userData.middleName, userData.lastName].filter(Boolean).join(" "),
            email: userData.email,
            role: roles[userData.role] ?? "",
            branch: branches[userData.branch] ?? "",
        })
    }

    return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
        <section role="dialog" aria-modal="true" aria-labelledby="user-form-title" className="max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><h2 id="user-form-title" className="text-lg font-semibold">Add user</h2><p className="mt-1 text-xs text-[#858d82]">Create an account for a member of your team.</p></div><button aria-label="Close user form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
            <form onSubmit={submit} className="mt-5 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="block text-xs font-medium text-[#596257]">First Name<input required autoComplete="given-name" value={values.firstName.trim()} onChange={(event) => setValues((current) => ({ ...current, firstName: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Middle Name<input autoComplete="additional-name" value={values.middleName?.trim() ?? ""} onChange={(event) => setValues((current) => ({ ...current, middleName: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Last Name<input required autoComplete="family-name" value={values.lastName} onChange={(event) => setValues((current) => ({ ...current, lastName: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Role<select value={values.role} onChange={(event) => setValues((current) => ({ ...current, role: Number(event.target.value) }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]">{roles.map((role, index) => <option key={role} value={index}>{role}</option>)}</select></label>
                <label className="block text-xs font-medium text-[#596257]">Phone Number<input required autoComplete="tel" value={values.phoneNumber} onChange={(event) => setValues((current) => ({ ...current, phoneNumber: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Email<input required autoComplete="email" value={values.email.trim()} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Password<span className="mt-1.5 flex h-10 items-center rounded-lg border border-[#e1e5dc] pr-2 focus-within:border-[#81945e]"><input required type={showPassword ? "text" : "password"} autoComplete="new-password" value={values.password} onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))} className="h-full min-w-0 flex-1 rounded-lg px-3 text-sm font-normal text-[#202720] outline-none" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="px-1 text-xs font-medium text-[#596257] hover:text-[#202720]">{showPassword ? "Hide" : "Show"}</button></span></label>
                <label className="block text-xs font-medium text-[#596257]">Confirm Password<span className="mt-1.5 flex h-10 items-center rounded-lg border border-[#e1e5dc] pr-2 focus-within:border-[#81945e]"><input required type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" value={values.confirm_password} onChange={(event) => { setValues((current) => ({ ...current, confirm_password: event.target.value })); setPasswordError("") }} className="h-full min-w-0 flex-1 rounded-lg px-3 text-sm font-normal text-[#202720] outline-none" /><button type="button" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} onClick={() => setShowConfirmPassword((visible) => !visible)} className="px-1 text-xs font-medium text-[#596257] hover:text-[#202720]">{showConfirmPassword ? "Hide" : "Show"}</button></span>{passwordError && <span role="alert" className="mt-1 block text-[11px] text-[#a35e4b]">{passwordError}</span>}</label>
                <label className="block text-xs font-medium text-[#596257]">Branch<select value={values.branch} onChange={(event) => setValues((current) => ({ ...current, branch: Number(event.target.value) }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]">{branches.map((branch, index) => <option key={branch} value={index}>{branch}</option>)}</select></label>
                <div className="col-span-full flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Create user</button></div>
            </form>
        </section>
    </div>
}

export default AddUserForm
