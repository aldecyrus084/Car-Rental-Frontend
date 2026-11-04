import { useCallback, useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/login/Login"
import AdminDashboard from "./pages/admin/AdminDashboard"
import CarsPage from "./pages/admin/cars/CarsPage"
import CustomersPage from "./pages/admin/customers/CustomersPage"
import BranchesPage from "./pages/admin/branches/BranchesPage"
import MaintenancePage from "./pages/admin/maintenance/MaintenancePage"
import PaymentsPage from "./pages/admin/payments/PaymentsPage"
import UsersPage from "./pages/admin/users/UsersPage"
import VehicleTypesPage from "./pages/admin/vehicle-types/VehicleTypesPage"
import RentalsPage from "./pages/admin/rentals/RentalsPage"
import PricingPage from "./pages/admin/pricing/PricingPage"
import PricingAreasPage from "./pages/admin/pricing-areas/PricingAreasPage"
import RolesPage from "./pages/admin/roles/RolesPage"
import { LoadingModalProvider } from "./components/LoadingModalContext"

function App() {

  return (
    <BrowserRouter>
      <LoadingModalProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/cars" element={<CarsPage />} />
          <Route path="/admin/rentals" element={<RentalsPage />} />
          <Route path="/admin/pricing" element={<PricingPage />} />
          <Route path="/admin/pricing-areas" element={<PricingAreasPage />} />
          <Route path="/admin/vehicle-types" element={<VehicleTypesPage />} />
          <Route path="/admin/customers" element={<CustomersPage />} />
          <Route path="/admin/maintenance" element={<MaintenancePage />} />
          <Route path="/admin/branches" element={<BranchesPage />} />
          <Route path="/admin/locations" element={<Navigate to="/admin/branches" replace />} />
          <Route path="/admin/payments" element={<PaymentsPage />} />
          <Route path="/admin/users" element={<UsersPage/>} />
          <Route path="/admin/roles" element={<RolesPage/>} />
          <Route path="/admin/:section" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </LoadingModalProvider>
    </BrowserRouter>
  )
}

export default App
