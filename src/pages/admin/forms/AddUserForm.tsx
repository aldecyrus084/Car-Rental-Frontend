import { useState, type FormEvent } from "react"
import { Icon } from "../AdminSidebar"

type AddUserFormProps = {
    roles: string[]
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


function AddUserForm({ roles, onClose, onSave }: AddUserFormProps) {
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

        if(userData.password != userData.confirm_password)
        {
            console.log("User password not match.")
        }

        console.log(userData);
    }

    return <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
        <section role="dialog" aria-modal="true" aria-labelledby="user-form-title" className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4"><div><h2 id="user-form-title" className="text-lg font-semibold">Add user</h2><p className="mt-1 text-xs text-[#858d82]">Create an account for a member of your team.</p></div><button aria-label="Close user form" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button></div>
            <form onSubmit={submit} className="mt-5 space-y-4">
                <label className="block text-xs font-medium text-[#596257]">First Name<input required autoComplete="first name" value={values.firstName.trim()} onChange={(event) => setValues((current) => ({ ...current, firstName: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Middle Name<input autoComplete="middle name" value={values.middleName?.trim()} onChange={(event) => setValues((current) => ({ ...current, middleName: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Last Name<input required autoComplete="last name" value={values.lastName} onChange={(event) => setValues((current) => ({ ...current, lastName: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Role<select value={values.role} onChange={(event) => setValues((current) => ({ ...current, role: Number(event.target.value) }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]">{roles.map((role, index) => <option key={index} value={index}>{role}</option>)}</select></label>
                <label className="block text-xs font-medium text-[#596257]">Phone Number<input required autoComplete="phone number" value={values.phoneNumber} onChange={(event) => setValues((current) => ({ ...current, phoneNumber: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Email<input required autoComplete="email" value={values.email.trim()} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Password<input required value={values.password.trim()} onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Confirm Password<input required value={values.confirm_password.trim()} onChange={(event) => setValues((current) => ({ ...current, confirm_password: event.target.value }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]" /></label>
                <label className="block text-xs font-medium text-[#596257]">Branch<select value={values.branch} onChange={(event) => setValues((current) => ({ ...current, branch: Number(event.target.value) }))} className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e5dc] bg-white px-3 text-sm font-normal text-[#202720] outline-none focus:border-[#81945e]">{roles.map((role, index) => <option key={index} value={index}>{role}</option>)}</select></label>
                <div className="flex justify-end gap-2 border-t border-[#edf0e9] pt-4"><button type="button" onClick={onClose} className="rounded-lg border border-[#e1e5dc] px-4 py-2.5 text-xs font-semibold text-[#596257]">Cancel</button><button type="submit" className="rounded-lg bg-[#192820] px-4 py-2.5 text-xs font-semibold text-white">Create user</button></div>
            </form>
        </section>
    </div>
}

export default AddUserForm
