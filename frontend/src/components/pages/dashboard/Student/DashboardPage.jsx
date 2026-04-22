const StudentDashboardPage = () => {
  return (
    <div className="p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Student Overview</h2>
        <p className="mt-2 text-slate-600">Access your campus resources, book facilities, and track your requests.</p>
        
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
           <div className="rounded-lg border border-slate-100 bg-slate-50 p-6">
             <h3 className="font-semibold text-slate-800">My Bookings</h3>
             <p className="mt-1 text-sm text-slate-500">You have no upcoming bookings.</p>
           </div>
           <div className="rounded-lg border border-slate-100 bg-slate-50 p-6">
             <h3 className="font-semibold text-slate-800">Recent Tickets</h3>
             <p className="mt-1 text-sm text-slate-500">Your recent tickets will appear here.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;