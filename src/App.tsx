import { useEffect, useState } from "react"
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
import { cacheUserRoles, getUserRoles, readCachedUserRoles, type UserRole } from "./features/users/user-roles.api"

function App() {
  const [userRoles, setUserRoles] = useState<UserRole[]>(readCachedUserRoles)
  const [rolesLoadError, setRolesLoadError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    getUserRoles(controller.signal)
      .then((roles) => {
        setUserRoles(roles)
        cacheUserRoles(roles)
        setRolesLoadError("")
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setRolesLoadError(error instanceof Error ? error.message : "Unable to load user roles.")
        }
      })

    return () => controller.abort()
  }, [])

  return (
    <BrowserRouter>
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
        <Route path="/admin/users" element={<UsersPage roles={userRoles} rolesLoadError={rolesLoadError} />} />
        <Route path="/admin/roles" element={<RolesPage onRolesUpdated={(role) => {
          setUserRoles((current) => {
            const updatedRoles = current.some((item) => item.userRoleId === role.userRoleId)
              ? current.map((item) => item.userRoleId === role.userRoleId ? role : item).filter((item) => item.isActive)
              : role.isActive ? [...current, role] : current
            cacheUserRoles(updatedRoles)
            return updatedRoles
          })
        }} />} />
        <Route path="/admin/:section" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
