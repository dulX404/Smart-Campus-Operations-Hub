import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import authService from "../../../api/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(email.trim(), password);
      if (response.success && response.data.token) {
        login(response.data.token);
        
        // Decode token to check role
        const payload = JSON.parse(atob(response.data.token.split('.')[1]));
        const userRole = payload.role || "";

        if (userRole.includes("ROLE_ADMIN")) {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-light/20 blur-3xl" />
        <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-secondary-light/20 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-tertiary/70 bg-white shadow-2xl lg:grid-cols-2">
          <section className="relative hidden p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-tertiary-off" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <img src="/zentro_logo.png" alt="Smart Campus Logo" className="h-24 w-24" />
              </div>
              <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight text-orange-400">
                One Hub For Every Campus Operation
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                Coordinate bookings, monitor resources, and resolve tickets from one streamlined platform.
              </p>
            </div>

            <div className="relative z-10 space-y-3 rounded-2xl border border-secondary/25 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-orange-400">Highlights</p>
              <ul className="space-y-2 text-sm text-slate-200">
                <li>Role-based dashboards for students and staff</li>
                <li>Real-time ticket progress and notifications</li>
                <li>Centralized booking and resource tracking</li>
              </ul>
            </div>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
                  Welcome Back
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Sign In</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Enter your credentials to continue to the operations hub.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Campus Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@campus.edu"
                    className="w-full rounded-xl border border-tertiary px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary-light/40"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-tertiary px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary-light/40 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-tertiary text-secondary focus:ring-secondary-light"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="font-medium text-secondary transition hover:text-secondary-dark"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-secondary/25 transition hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing In..." : "Log In"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-600">
                Need access? Contact campus admin for account support.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
