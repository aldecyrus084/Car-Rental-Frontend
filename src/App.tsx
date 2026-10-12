import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/login/Login"
import AdminDashboard from "./pages/admin/AdminDashboard"
import CarsPage from "./pages/admin/cars/CarsPage"
import CustomersPage from "./pages/admin/customers/CustomersPage"
import LocationsPage from "./pages/admin/locations/LocationsPage"
import MaintenancePage from "./pages/admin/maintenance/MaintenancePage"
import PaymentsPage from "./pages/admin/payments/PaymentsPage"
import UsersPage from "./pages/admin/users/UsersPage"

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/cars" element={<CarsPage />} />
        <Route path="/admin/customers" element={<CustomersPage />} />
        <Route path="/admin/maintenance" element={<MaintenancePage />} />
        <Route path="/admin/locations" element={<LocationsPage />} />
        <Route path="/admin/payments" element={<PaymentsPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/:section" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
