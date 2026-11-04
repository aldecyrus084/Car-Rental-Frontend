type CarLoadingModalProps = {
  isOpen: boolean
  message?: string
}

function CarLoadingModal({ isOpen, message = "Getting things ready..." }: CarLoadingModalProps) {
  if (!isOpen) return null

  return <div className="fixed inset-0 z-[100] grid place-items-center bg-[#101713]/55 p-4 backdrop-blur-sm">
    <section role="status" aria-live="polite" aria-label={message} className="w-full max-w-sm rounded-2xl border border-white/70 bg-white px-7 py-8 text-center shadow-2xl">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#f3f6ef]" aria-hidden="true">
        <span className="loading-spinner h-8 w-8 rounded-full border-[3px] border-[#dce5d1] border-t-[#718b4a]" />
      </div>
      <p className="mt-4 text-sm font-semibold text-[#263128]">{message}</p>
      <p className="mt-1 text-xs text-[#858d82]">Please wait a moment</p>
    </section>
  </div>
}

export default CarLoadingModal
