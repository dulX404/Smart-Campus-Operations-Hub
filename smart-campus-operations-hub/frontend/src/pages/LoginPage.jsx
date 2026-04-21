import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <PageHeader
          title="Login"
          description="Starter login page placeholder for future authentication flow."
        />

        <form className="space-y-4">
          <input
            type="email"
            placeholder="University email"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
          <button
            type="button"
            className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white"
          >
            Sign In
          </button>
        </form>

        <Link to="/" className="mt-4 inline-block text-sm text-slate-600 underline">
          Continue to starter dashboard
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
