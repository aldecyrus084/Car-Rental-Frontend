
import { Route, Routes } from "react-router-dom";

import AdminRoutes from "./adminRoutes";
import Login from "../pages/login/Login";

export default function AppRoutes() {

    return (
        <Routes>

            {/* Public routes */}
            <Route path="/" element={<Login />} />

            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Manager routes */}
            <Route path="/manager/*" element={<div>Manager Dashboard</div>} />

            {/* Employee routes */}
            <Route path="/employee/*" element={<div>Employee Dashboard</div>} />

            {/* Unauthorized */}
            <Route path="/unauthorized" element={<div>You are not authorized to access this page.</div>} />

            {/* Not Found */}
            <Route path="*" element={<div>Not Found</div>} />

        </Routes>
    );
}
