import { Navigate, Route, Routes } from "react-router-dom";
import UsersPage from "../pages/admin/users/UsersPage";
import RolesPage from "../pages/admin/roles/RolesPage";
import PaymentsPage from "../pages/admin/payments/PaymentsPage";
import BranchesPage from "../pages/admin/branches/BranchesPage";
import MaintenancePage from "../pages/admin/maintenance/MaintenancePage";
import CustomersPage from "../pages/admin/customers/CustomersPage";
import VehicleTypesPage from "../pages/admin/vehicle-types/VehicleTypesPage";
import PricingAreasPage from "../pages/admin/pricing-areas/PricingAreasPage";
import PricingPage from "../pages/admin/pricing/PricingPage";
import RentalsPage from "../pages/admin/rentals/RentalsPage";
import CarsPage from "../pages/admin/cars/CarsPage";
import AdminDashboard from "../pages/admin/AdminDashboard";

export default function AdminRoutes() {
    return (
        <Routes>
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
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/roles" element={<RolesPage />} />
            <Route path="/admin/:section" element={<Navigate to="/admin" replace />} />
            
        </Routes>
    )
}