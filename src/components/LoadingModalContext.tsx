import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import CarLoadingModal from "./CarLoadingModal"

type LoadingModalContextValue = {
  showLoader: (message?: string) => void
  hideLoader: () => void
}

const LoadingModalContext = createContext<LoadingModalContextValue | null>(null)

export function LoadingModalProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("Getting things ready...")
  const [isOpen, setIsOpen] = useState(false)

  const showLoader = useCallback((loaderMessage = "Getting things ready...") => {
    setMessage(loaderMessage)
    setIsOpen(true)
  }, [])
  const hideLoader = useCallback(() => setIsOpen(false), [])
  const value = useMemo(() => ({ showLoader, hideLoader }), [showLoader, hideLoader])

  return <LoadingModalContext.Provider value={value}>
    {children}
    <CarLoadingModal isOpen={isOpen} message={message} />
  </LoadingModalContext.Provider>
}

export function useLoadingModal() {
  const context = useContext(LoadingModalContext)
  if (!context) throw new Error("useLoadingModal must be used inside LoadingModalProvider.")
  return context
}
