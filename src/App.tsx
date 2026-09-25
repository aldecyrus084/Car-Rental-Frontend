import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/login/login"

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
