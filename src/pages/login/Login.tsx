import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { API_REQUEST } from '../../types/apiRequest';
import { useLoadingModal } from '../../components/LoadingModalContext';
import { LOGIN_URI } from '../../services/api/endpoints';
import { useAuth } from '../../context/AuthContext';

type LoginResponse = {
  token: string;
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { showLoader, hideLoader } = useLoadingModal();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSubmitting(true);
    showLoader("Logging in, Please wait...");

    try {
      const response = await API_REQUEST<LoginResponse>(LOGIN_URI, {
        method: "POST",
        body: JSON.stringify({
          username,
          password
        })
      });

      if (!response.isSuccess) {
        throw new Error(response.message || "Login failed.");
      }

      // Save token and authenticate the user.
      login(response.data?.token, rememberMe);

      // Get the previously requested route.
      const from = (
        location.state as { from?: { pathname?: string } } | null
      )?.from?.pathname;

      // Determine default dashboard based on role.
      const decodedRoles = response.data.token;

      // The user state is updated by AuthContext.
      // Decode the token to determine the destination.
      const { jwtDecode } = await import("jwt-decode");

      const payload = jwtDecode<{
        role?: string | string[];
        roles?: string | string[];
        [key: string]: unknown;
      }>(decodedRoles);

      const roleClaim =
        payload.role ??
        payload.roles ??
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      const roles = Array.isArray(roleClaim)
        ? roleClaim
        : typeof roleClaim === "string"
          ? [roleClaim]
          : [];

      const normalizedRoles = roles.map(role => role.toLowerCase());

      let defaultRoute = "/unauthorized";

      if (normalizedRoles.includes("admin")) {
        defaultRoute = "/admin";
      } else if (normalizedRoles.includes("manager")) {
        defaultRoute = "/manager";
      } else if (normalizedRoles.includes("employee")) {
        defaultRoute = "/employee";
      }

      navigate(from ?? defaultRoute, { replace: true });

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false);
      hideLoader();
    }
  };


  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* LEFT SIDE: reserved image area for car hero / logo */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-slate-900">
        {/* Swap the src below with your own car image or logo */}
        <img
          src="/images/car-hero.jpg"
          alt="Car showcase"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT SIDE: login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo placeholder - swap with your own logo image */}
          <div className="flex justify-center mb-6">
            <img
              src="/images/logo.png"
              alt="Company logo"
              className="h-12 w-auto"
            />
          </div>

          <h1 className="text-2xl font-semibold text-slate-800 text-center mb-1">
            Admin Login
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            Sign in to manage your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800"
                required
              />
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300"
                />
                Remember me
              </label>

              <a href="/forgot-password" className="text-slate-800 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <button
              disabled={submitting}
              type="submit"
              className="w-full rounded-lg bg-slate-800 text-white py-2 font-medium hover:bg-slate-700 transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login