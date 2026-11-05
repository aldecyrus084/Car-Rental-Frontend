import { BrowserRouter } from "react-router-dom"
import { LoadingModalProvider } from "./components/LoadingModalContext"
import AppRoutes from "./routes"
import { AuthProvider } from "./context/AuthContext"

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <LoadingModalProvider>
          <AppRoutes />
        </LoadingModalProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
