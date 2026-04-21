import PageHeader from "../components/PageHeader";

function DashboardPage() {
  return (
    <section>
      <PageHeader
        title="Dashboard"
        description="High-level project landing page for shared team development."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {["Resources", "Bookings", "Tickets"].map((item) => (
          <div key={item} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold">{item}</h3>
            <p className="mt-2 text-sm text-slate-600">
              Placeholder card for the {item.toLowerCase()} module.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;
