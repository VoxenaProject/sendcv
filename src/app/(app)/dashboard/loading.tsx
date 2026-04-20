export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div><div className="h-7 w-32 bg-gray-200 rounded-lg" /><div className="h-4 w-20 bg-gray-100 rounded mt-2" /></div>
        <div className="h-10 w-40 bg-gray-200 rounded-xl" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-white border border-gray-100 rounded-2xl" />)}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white border border-gray-100 rounded-2xl" />)}
      </div>
    </div>
  );
}
