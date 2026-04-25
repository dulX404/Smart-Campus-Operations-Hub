import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-6 text-red-600">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-16 w-16">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11V7m0 8h.01" />
        </svg>
      </div>
      <h1 className="text-4xl font-black text-slate-900">Access Denied</h1>
      <p className="mt-4 max-w-md text-slate-500">
        You don't have the necessary permissions to view this page. If you believe this is a mistake, please contact your administrator.
      </p>
      <Link
        to="/login"
        className="mt-8 rounded-xl bg-primary px-8 py-3 font-bold text-white shadow-xl hover:bg-primary-dark transition"
      >
        Return to Safety
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
