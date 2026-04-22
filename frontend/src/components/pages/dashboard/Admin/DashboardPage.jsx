const AdminDashboardPage = () => {
  return (
    <div className="p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Admin Overview</h2>
        <p className="mt-2 text-slate-600">This is where you can manage campus operations, resources, and users.</p>
        
        {/* Dashboard Stats/Content will go here */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
           <div className="rounded-lg bg-blue-50 p-6 border border-blue-100">
             <p className="text-sm font-medium text-blue-600">Active Resources</p>
             <p className="text-3xl font-bold text-blue-900">42</p>
           </div>
           <div className="rounded-lg bg-orange-50 p-6 border border-orange-100">
             <p className="text-sm font-medium text-orange-600">Pending Tickets</p>
             <p className="text-3xl font-bold text-orange-900">12</p>
           </div>
           <div className="rounded-lg bg-green-50 p-6 border border-green-100">
             <p className="text-sm font-medium text-green-600">Active Bookings</p>
             <p className="text-3xl font-bold text-green-900">156</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;