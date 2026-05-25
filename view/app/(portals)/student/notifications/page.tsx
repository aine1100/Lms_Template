export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Notifications</h1>
        <p className="text-slate-500">Stay updated with your library activities</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
       
        <h3 className="text-lg font-semibold text-slate-700 mb-1">No Notifications</h3>
        <p className="text-slate-500">You're all caught up!</p>
      </div>
    </div>
  );
}
