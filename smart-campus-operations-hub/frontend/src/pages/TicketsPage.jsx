import PageHeader from "../components/PageHeader";

function TicketsPage() {
  return (
    <section>
      <PageHeader
        title="Tickets"
        description="Starter page for support and issue reporting features."
      />
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        Ticket module UI will be added by the assigned team member.
      </div>
    </section>
  );
}

export default TicketsPage;
