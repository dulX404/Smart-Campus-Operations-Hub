import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

function NotFoundPage() {
  return (
    <section className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <PageHeader
        title="Page Not Found"
        description="The route you requested does not exist in the starter application."
      />
      <Link to="/" className="text-sm font-medium text-slate-700 underline">
        Return to dashboard
      </Link>
    </section>
  );
}

export default NotFoundPage;
