import { useState} from 'react'

const Login = () => {
  // Simple state for each field - easy to read and follow
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
 
    console.log({ username, password, rememberMe });
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
}

export default Login