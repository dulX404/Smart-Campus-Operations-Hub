import React from "react";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen bg-primary-dark">
      {/* ── Left Panel: Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12">
        {/* Top: Logo */}
        <div>
          <img
            src="/zentro_logo.png"
            alt="Zentro Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Center: Hero text */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold leading-tight text-white">
            Smart Campus
            <br />
            <span className="text-secondary-dark">Operations Hub</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-blue-200">
            Streamline your campus resources, bookings, and facility management
            — all from one place.
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              📊 Dashboard
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              🏢 Resources
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              📅 Bookings
            </span>
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
              🎫 Tickets
            </span>
          </div>
        </div>

        {/* Bottom: Footer */}
        <p className="text-sm text-blue-300">
          © 2026 Zentro Smart Campus Solutions
        </p>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
