import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", { email });
    navigate("/dashboard");
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
      {/* Mobile-only logo */}
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <img
          src="/zentro_logo.png"
          alt="Zentro Logo"
          className="h-10 w-auto"
        />
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-extrabold text-slate-900">
        Welcome back
      </h2>
      <p className="mt-2 text-base text-slate-500">
        Sign in to continue to the Operations Hub
      </p>

      {/* Form */}
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            Email Address
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@campus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-shadow focus:border-primary-dark focus:ring-2 focus:ring-primary-dark/20"
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-secondary-dark hover:text-secondary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none transition-shadow focus:border-primary-dark focus:ring-2 focus:ring-primary-dark/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-primary-dark transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <input
            id="login-remember"
            name="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-primary-dark focus:ring-primary-dark"
          />
          <label
            htmlFor="login-remember"
            className="text-sm text-slate-600"
          >
            Keep me signed in
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-lg bg-primary-dark py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-dark/30 transition-all duration-200 hover:bg-primary hover:shadow-primary/30 active:scale-[0.98]"
        >
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-medium uppercase tracking-wider text-slate-400">
            or continue with
          </span>
        </div>
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300"
        >
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300"
        >
          Microsoft
        </button>
      </div>

      {/* Footer text */}
      <p className="mt-8 text-center text-sm text-slate-500">
        Need campus access?{" "}
        <Link
          to="/contact"
          className="font-semibold text-secondary-dark hover:text-secondary transition-colors"
        >
          Contact your administrator
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
