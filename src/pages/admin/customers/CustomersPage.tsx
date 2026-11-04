import { useEffect, useRef, useState } from "react"
import { Icon } from "../AdminSidebar"
import AddCustomerForm, { type AddCustomerFormValues } from "../forms/AddCustomerForm"
import UpdateCustomerForm from "../forms/UpdateCustomerForm"
import AdminLayout from "../layout/AdminLayout"
import type { CustomerDetails, CustomerDocument, CustomerStatus, UpdateCustomerRequest } from "../../../features/customers/customers.api"
import CarLoadingModal from "../../../components/CarLoadingModal"

type Customer = {
  customerId?: string
  customer: string
  email: string
  phone: string
  rentals: string
  status: string
  customerNumber?: string
  firstName?: string
  middleName?: string | null
  lastName?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  city?: string
  province?: string
  postalCode?: string | null
  emergencyContactName?: string | null
  emergencyNumber?: string | null
  documents: CustomerFile[]
}
type CustomerFile = CustomerDocument
type CustomerColumn = "customer" | "email" | "phone" | "rentals" | "status"
const columns: { key: CustomerColumn; label: string }[] = [
  { key: "customer", label: "Customer" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "rentals", label: "Rentals" },
  { key: "status", label: "Status" },
]

function isImageDocument(document: CustomerFile) {
  return document.contentType?.startsWith("image/")
    || /\.(avif|bmp|gif|jpe?g|png|svg|webp)$/i.test(document.fileName)
}

const sampleDocuments: CustomerFile[] = [
  {
    fileName: "sample-customer-photo.svg",
    contentType: "image/svg+xml",
    fileUrl: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#e8eddf"/><circle cx="400" cy="230" r="95" fill="#b4c49a"/><path d="M210 560c18-120 89-180 190-180s172 60 190 180" fill="#718b4a"/><text x="400" y="530" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="white">SAMPLE IMAGE DOCUMENT</text></svg>')}`,
  },
  {
    fileName: "sample-rental-agreement.doc",
    contentType: "application/msword",
    fileUrl: `data:application/msword,${encodeURIComponent('<html><head><meta charset="utf-8"><title>Sample rental agreement</title></head><body><h1>Sample Rental Agreement</h1><p>This Word-compatible sample is for preview purposes only.</p><p>It is not an uploaded customer document.</p></body></html>')}`,
  },
]

function CustomerDocumentCard({ document, onPreview }: { document: CustomerFile; onPreview: (url: string) => void }) {
  const url = document.fileUrl ?? ""
  const image = isImageDocument(document)

  return <article className="overflow-hidden rounded-xl border border-[#e7e9e2] bg-white">
    <button type="button" onClick={() => image && url && onPreview(url)} disabled={!image || !url} aria-label={image ? `Preview ${document.fileName}` : undefined} className={`relative grid aspect-[4/3] w-full place-items-center overflow-hidden bg-[#f5f6f2] ${image && url ? "cursor-zoom-in" : "cursor-default"}`}>
      {image && url
        ? <img src={url} alt={document.fileName} className="h-full w-full object-cover transition-transform hover:scale-[1.03]" />
        : <div className="flex flex-col items-center gap-2 text-[#788077]"><span className="grid h-12 w-12 place-items-center rounded-xl bg-white text-xs font-semibold uppercase shadow-sm">{document.fileName.split(".").pop()?.slice(0, 5) ?? "FILE"}</span><span className="text-[10px]">Document</span></div>}
    </button>
    <div className="flex min-w-0 items-center justify-between gap-2 border-t border-[#edf0e9] px-3 py-2.5">
      <p title={document.fileName} className="truncate text-xs font-medium text-[#343d34]">{document.fileName}</p>
      {url && <a href={url} download={document.fileName} aria-label={`Download ${document.fileName}`} className="shrink-0 rounded-md p-1.5 text-[#788077] hover:bg-[#f2f4ef] hover:text-[#343d34]"><Icon name="download" className="h-4 w-4" /></a>}
    </div>
  </article>
}

function CustomerProfile({ customer, loading, error, uploading, uploadError, onUpload, onClose }: { customer: Customer; loading: boolean; error: string; uploading: boolean; uploadError: string; onUpload: (file: File) => void; onClose: () => void }) {
  const [activePart, setActivePart] = useState<"information" | "documents">("information")
  const [previewUrl, setPreviewUrl] = useState("")

  const value = (text?: string | null) => text?.trim() || "—"
  const formattedDateOfBirth = customer.dateOfBirth
    ? new Date(`${customer.dateOfBirth.slice(0, 10)}T00:00:00`).toLocaleDateString()
    : "—"
  const details: [string, string | null | undefined][] = [
    ["Customer number", customer.customerNumber],
    ["First name", customer.firstName],
    ["Middle name", customer.middleName],
    ["Last name", customer.lastName],
    ["Date of birth", formattedDateOfBirth],
    ["Gender", customer.gender],
    ["Email", customer.email],
    ["Phone number", customer.phone],
  ]
  const address: [string, string | null | undefined][] = [
    ["Street address", customer.address],
    ["City", customer.city],
    ["Province", customer.province],
    ["Postal code", customer.postalCode],
  ]

  return <><div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="customer-profile-title" className="max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#fbfcf9] shadow-2xl">
      <header className="flex items-start justify-between gap-4 border-b border-[#edf0e9] bg-white px-5 py-5 sm:px-7">
        <div className="min-w-0"><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8b9388]">Customer profile</p><h2 id="customer-profile-title" className="mt-1 truncate text-xl font-semibold tracking-tight text-[#202720]">{customer.customer}</h2><p className="mt-1 text-xs text-[#798177]">{customer.customerNumber ?? customer.customerId ?? "Customer details"}</p></div>
        <button type="button" aria-label="Close customer profile" onClick={onClose} className="rounded-lg p-1.5 text-[#788077] hover:bg-[#f2f4ef]"><Icon name="close" className="h-5 w-5" /></button>
      </header>
      <nav aria-label="Customer profile sections" className="flex gap-2 border-b border-[#edf0e9] bg-white px-5 sm:px-7">
        <button type="button" aria-current={activePart === "information" ? "page" : undefined} onClick={() => setActivePart("information")} className={`border-b-2 px-1 py-3 text-xs font-semibold ${activePart === "information" ? "border-[#718b4a] text-[#34412b]" : "border-transparent text-[#858d82] hover:text-[#343d34]"}`}>01 · Customer information</button>
        <button type="button" aria-current={activePart === "documents" ? "page" : undefined} onClick={() => setActivePart("documents")} className={`border-b-2 px-1 py-3 text-xs font-semibold ${activePart === "documents" ? "border-[#718b4a] text-[#34412b]" : "border-transparent text-[#858d82] hover:text-[#343d34]"}`}>02 · Documents <span className="ml-1 text-[10px] font-normal">({customer.documents.length || sampleDocuments.length})</span></button>
      </nav>
      <div className="p-5 sm:p-7">
        {loading && <p role="status" className="mb-4 rounded-lg border border-[#e7e9e2] bg-white px-3 py-2.5 text-xs text-[#687166]">Loading the latest customer details…</p>}
        {error && <p role="alert" className="mb-4 rounded-lg border border-[#f0d9d2] bg-[#fff8f5] px-3 py-2.5 text-xs text-[#a35e4b]">{error}</p>}
        {activePart === "information" ? <div className="space-y-4">
          <section className="rounded-xl border border-[#e7e9e2] bg-white p-4 sm:p-5">
            <div className="mb-4"><h3 className="text-sm font-semibold text-[#343d34]">Personal and contact details</h3><p className="mt-1 text-xs text-[#858d82]">Customer identity and primary contact information.</p></div>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{details.map(([label, detail]) => <div key={label} className="min-w-0"><dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#92998f]">{label}</dt><dd className="mt-1 break-words text-sm text-[#343d34]">{label === "Date of birth" ? detail : value(detail)}</dd></div>)}</dl>
          </section>
          <section className="rounded-xl border border-[#e7e9e2] bg-white p-4 sm:p-5">
            <h3 className="mb-4 text-sm font-semibold text-[#343d34]">Address and emergency contact</h3>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">{address.map(([label, detail]) => <div key={label}><dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#92998f]">{label}</dt><dd className="mt-1 break-words text-sm text-[#343d34]">{value(detail)}</dd></div>)}<div><dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#92998f]">Emergency contact name</dt><dd className="mt-1 break-words text-sm text-[#343d34]">{value(customer.emergencyContactName)}</dd></div><div><dt className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#92998f]">Emergency number</dt><dd className="mt-1 break-words text-sm text-[#343d34]">{value(customer.emergencyNumber)}</dd></div></dl>
          </section>
          <section className="flex items-center justify-between gap-3 rounded-xl border border-[#e7e9e2] bg-white p-4 sm:px-5"><div><h3 className="text-sm font-semibold text-[#343d34]">Account status</h3><p className="mt-1 text-xs text-[#858d82]">Current customer account standing</p></div><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${customer.status === "Active" ? "bg-[#edf5e5] text-[#638046]" : customer.status === "Blocked" ? "bg-[#f8ece8] text-[#a35e4b]" : "bg-[#f3f3ef] text-[#737a70]"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{customer.status}</span></section>
        </div> : <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h3 className="text-sm font-semibold text-[#343d34]">Customer documents</h3><p className="mt-1 text-xs text-[#858d82]">Images can be previewed. Download any file using its download button.</p></div><label className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-[#192820] px-3 text-xs font-semibold text-white hover:bg-[#293b30] ${uploading || loading || !customer.customerId ? "pointer-events-none opacity-50" : ""}`}><Icon name="plus" className="h-4 w-4" />{uploading ? "Uploading…" : "Add document"}<input type="file" className="sr-only" disabled={uploading || loading || !customer.customerId} onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(file); event.currentTarget.value = "" }} /></label></div>
          {!customer.customerId && <p className="mb-3 text-[11px] text-[#a35e4b]">Save this customer to the backend before uploading documents.</p>}
          {uploadError && <p role="alert" className="mb-3 rounded-lg border border-[#f0d9d2] bg-[#fff8f5] px-3 py-2.5 text-xs text-[#a35e4b]">{uploadError}</p>}
          {customer.documents.length > 0
            ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{customer.documents.map((document, index) => <CustomerDocumentCard key={document.documentId ?? `${document.fileName}-${index}`} document={document} onPreview={setPreviewUrl} />)}</div>
            : <><p className="mb-3 rounded-lg border border-[#e7e9e2] bg-[#f5f6f2] px-3 py-2.5 text-[11px] leading-5 text-[#687166]">Sample files for preview only. These are not uploaded to this customer.</p><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{sampleDocuments.map((document) => <CustomerDocumentCard key={document.fileName} document={document} onPreview={setPreviewUrl} />)}</div></>}
        </section>}
      </div>
    </section>
    {previewUrl && <div role="presentation" className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewUrl("") }}>
      <div role="dialog" aria-modal="true" aria-label="Image preview" className="relative max-h-full max-w-full">
        <button type="button" aria-label="Close image preview" onClick={() => setPreviewUrl("")} className="absolute -right-3 -top-3 z-10 rounded-full bg-white p-2 text-[#343d34] shadow"><Icon name="close" className="h-4 w-4" /></button>
        <img src={previewUrl} alt="Customer document preview" className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain" />
      </div>
    </div>}
  </div><CarLoadingModal isOpen={loading || uploading} message={uploading ? "Adding customer document..." : "Loading customer..."} /></>
}

function exportCustomers(records: Customer[]) {
  const rows = [columns.map(({ label }) => label), ...records.map((record) => columns.map(({ key }) => record[key]))]
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "customers.csv"
  link.click()
  URL.revokeObjectURL(url)
}

function CustomersPage() {
  const [records, setRecords] = useState<Customer[]>([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [profileUploading, setProfileUploading] = useState(false)
  const [profileUploadError, setProfileUploadError] = useState("")
  const [editingCustomer, setEditingCustomer] = useState<CustomerDetails | null>(null)
  const temporaryDocumentUrls = useRef<string[]>([])

  useEffect(() => () => {
    temporaryDocumentUrls.current.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  const filteredRecords = records.filter((record) => Object.values(record).join(" ").toLowerCase().includes(search.toLowerCase()))
  const activeCount = records.filter((record) => record.status === "Active").length

  const addCustomer = (values: AddCustomerFormValues) => {
    setRecords((current) => [{
      customerId: crypto.randomUUID(),
      customerNumber: values.customerNumber,
      customer: [values.firstName, values.middleName, values.lastName].filter(Boolean).join(" "),
      email: values.email,
      phone: values.phoneNumber,
      rentals: "—",
      status: "Active",
      firstName: values.firstName,
      middleName: values.middleName,
      lastName: values.lastName,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      address: values.address,
      city: values.city,
      province: values.province,
      postalCode: values.postalCode,
      emergencyContactName: values.emergencyContactName,
      emergencyNumber: values.emergencyNumber,
      documents: values.documents.map((file) => {
        const fileUrl = URL.createObjectURL(file)
        temporaryDocumentUrls.current.push(fileUrl)
        return { fileName: file.name, contentType: file.type, fileUrl }
      }),
    }, ...current])
    setShowForm(false)
  }

  const updateCustomerRecord = (customerId: string, changes: Partial<Customer>) => {
    setRecords((current) => current.map((record) => record.customerId === customerId ? { ...record, ...changes } : record))
    setSelectedCustomer((current) => current?.customerId === customerId ? { ...current, ...changes } : current)
    setEditingCustomer((current) => current?.customerId === customerId ? {
      ...current,
      ...(changes.firstName !== undefined ? { firstName: changes.firstName } : {}),
      ...(changes.middleName !== undefined ? { middleName: changes.middleName } : {}),
      ...(changes.lastName !== undefined ? { lastName: changes.lastName } : {}),
      ...(changes.dateOfBirth !== undefined ? { dateOfBirth: changes.dateOfBirth } : {}),
      ...(changes.gender !== undefined ? { gender: changes.gender } : {}),
      ...(changes.email !== undefined ? { email: changes.email } : {}),
      ...(changes.phone !== undefined ? { phoneNumber: changes.phone, contactNumber: changes.phone } : {}),
      ...(changes.address !== undefined ? { address: changes.address } : {}),
      ...(changes.city !== undefined ? { city: changes.city } : {}),
      ...(changes.province !== undefined ? { province: changes.province } : {}),
      ...(changes.postalCode !== undefined ? { postalCode: changes.postalCode } : {}),
      ...(changes.emergencyContactName !== undefined ? { emergencyContactName: changes.emergencyContactName } : {}),
      ...(changes.emergencyNumber !== undefined ? { emergencyNumber: changes.emergencyNumber } : {}),
      ...(changes.status !== undefined ? { status: changes.status } : {}),
    } : current)
  }

  const openUpdateForm = async (record: Customer) => {
    if (!record.customerId) return
    setEditingCustomer({
      customerId: record.customerId,
      customersNumber: record.customerNumber,
      customerNumber: record.customerNumber,
      firstName: record.firstName,
      middleName: record.middleName,
      lastName: record.lastName,
      dateOfBirth: record.dateOfBirth,
      gender: record.gender,
      email: record.email,
      phoneNumber: record.phone,
      contactNumber: record.phone,
      address: record.address,
      city: record.city,
      province: record.province,
      postalCode: record.postalCode,
      emergencyContactName: record.emergencyContactName,
      emergencyNumber: record.emergencyNumber,
      status: record.status,
      documents: record.documents,
    })
  }

  const saveCustomerChanges = async (changes: UpdateCustomerRequest) => {
    if (!editingCustomer) return
    const customerId = editingCustomer.customerId
    const customerName = [
      changes.firstName !== undefined ? changes.firstName : editingCustomer.firstName,
      changes.middleName !== undefined ? changes.middleName : editingCustomer.middleName,
      changes.lastName !== undefined ? changes.lastName : editingCustomer.lastName,
    ].filter(Boolean).join(" ")
    updateCustomerRecord(customerId, {
      ...(changes.firstName !== undefined ? { firstName: changes.firstName } : {}),
      ...(changes.middleName !== undefined ? { middleName: changes.middleName } : {}),
      ...(changes.lastName !== undefined ? { lastName: changes.lastName } : {}),
      ...(customerName ? { customer: customerName } : {}),
      ...(changes.dateOfBirth !== undefined ? { dateOfBirth: changes.dateOfBirth } : {}),
      ...(changes.gender !== undefined ? { gender: changes.gender } : {}),
      ...(changes.email !== undefined ? { email: changes.email } : {}),
      ...(changes.phoneNumber !== undefined ? { phone: changes.phoneNumber } : {}),
      ...(changes.address !== undefined ? { address: changes.address } : {}),
      ...(changes.city !== undefined ? { city: changes.city } : {}),
      ...(changes.province !== undefined ? { province: changes.province } : {}),
      ...(changes.postalCode !== undefined ? { postalCode: changes.postalCode } : {}),
      ...(changes.emergencyContactName !== undefined ? { emergencyContactName: changes.emergencyContactName } : {}),
      ...(changes.emergencyNumber !== undefined ? { emergencyNumber: changes.emergencyNumber } : {}),
    })
  }

  const saveCustomerStatus = async (status: CustomerStatus) => {
    if (!editingCustomer) return
    updateCustomerRecord(editingCustomer.customerId, { status })
  }

  const addCustomerDocument = async (file: File) => {
    if (!selectedCustomer?.customerId) return
    const customerId = selectedCustomer.customerId
    setProfileUploadError("")
    setProfileUploading(true)
    const fileUrl = URL.createObjectURL(file)
    temporaryDocumentUrls.current.push(fileUrl)
    const document = { fileName: file.name, contentType: file.type, fileUrl }
    setSelectedCustomer((current) => current?.customerId === customerId
      ? { ...current, documents: [...current.documents, document] }
      : current)
    setRecords((current) => current.map((record) => record.customerId === customerId
      ? { ...record, documents: [...record.documents, document] }
      : record))
    setProfileUploading(false)
  }

  const viewCustomer = async (record: Customer) => {
    setSelectedCustomer(record)
    setProfileError("")
    setProfileLoading(false)
  }

  const closeCustomerProfile = () => {
    setSelectedCustomer(null)
    setProfileLoading(false)
    setProfileError("")
  }

  return <AdminLayout eyebrow="Administration / Customers" title={<>MOTION <span className="font-normal text-[#899187]">· Customers</span></>}>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8b9388]">Customer workspace</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">Customers</h2><p className="mt-1.5 text-sm text-[#798177]">Review customer profiles and rental activity.</p></div>
      <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#192820] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#293b30]"><Icon name="plus" className="h-4 w-4" />Add customer</button>
    </div>

    <section aria-label="Customer summary" className="mt-7 grid gap-3 sm:grid-cols-3">
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Total customers</p><p className="mt-3 text-2xl font-semibold tracking-tight">{records.length.toString().padStart(2, "0")}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Active</p><p className="mt-3 text-2xl font-semibold tracking-tight">{activeCount}</p></article>
      <article className="rounded-xl border border-[#e7e9e2] bg-white p-5"><p className="text-xs font-medium text-[#788077]">Needs review</p><p className="mt-3 text-2xl font-semibold tracking-tight">{records.length - activeCount}</p></article>
    </section>

    <section className="mt-4 rounded-xl border border-[#e7e9e2] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0e9] px-5 py-4 sm:px-6">
        <div><h3 className="text-sm font-semibold">Customer records</h3><p className="mt-1 text-xs text-[#858d82]">Search and manage customer profiles</p></div>
        <div className="flex items-center gap-2">
          <label className="flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-2.5 text-[#899187]"><Icon name="search" className="h-4 w-4" /><input aria-label="Search customers" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers" className="w-32 bg-transparent text-xs text-[#202720] outline-none placeholder:text-[#9ba197] sm:w-44" /></label>
          <button onClick={() => exportCustomers(filteredRecords)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#e6e9e1] px-3 text-xs font-semibold text-[#596257] hover:bg-[#f8f9f6]"><Icon name="download" className="h-4 w-4" /><span className="hidden sm:inline">Export</span></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-170 text-left">
          <thead><tr className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa095]">{columns.map((column) => <th key={column.key} className="px-5 py-3">{column.label}</th>)}<th className="px-5 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-[#f0f1ed]">
            {filteredRecords.map((record) => 
            <tr key={record.customerId ?? record.email} className="text-xs hover:bg-[#fbfcf9]">
              {columns.map((column) => 
              <td key={column.key} className="px-5 py-4">
                {column.key === "status" ? 
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf5e5] px-2.5 py-1 text-[10px] font-medium text-[#638046]">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {record.status}
                  </span> : 
                  <span className={`${column.key === "customer" ? "font-semibold text-[#343d34]" : "text-[#687166]"}`}>{record[column.key]}</span>}
                    </td>)}
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button type="button" onClick={() => void viewCustomer(record)} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#596257] hover:bg-[#f8f9f6]">View</button>
                      <button type="button" onClick={() => void openUpdateForm(record)} disabled={!record.customerId} className="rounded-md border border-[#e6e9e1] px-2.5 py-1.5 text-[10px] font-medium text-[#596257] hover:bg-[#f8f9f6] disabled:cursor-wait disabled:opacity-50">Update</button>
                    </div>
                  </td></tr>)}
            {filteredRecords.length === 0 && <tr><td colSpan={columns.length + 1} className="px-6 py-12 text-center text-xs text-[#858d82]">No customers found. Try another search or add a customer.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-[#edf0e9] px-6 py-3 text-[11px] text-[#8c9489]"><span>Showing {filteredRecords.length} of {records.length} customers</span><span>Changes made here are temporary and aren’t saved to the backend.</span></div>
    </section>
    {showForm && <AddCustomerForm onClose={() => setShowForm(false)} onSave={addCustomer} />}
    {selectedCustomer && <CustomerProfile customer={selectedCustomer} loading={profileLoading} error={profileError} uploading={profileUploading} uploadError={profileUploadError} onUpload={(file) => { void addCustomerDocument(file) }} onClose={closeCustomerProfile} />}
    {editingCustomer && <UpdateCustomerForm key={editingCustomer.customerId} customer={editingCustomer} onClose={() => setEditingCustomer(null)} onSave={saveCustomerChanges} onStatusChange={saveCustomerStatus} />}
  </AdminLayout>
}

export default CustomersPage
