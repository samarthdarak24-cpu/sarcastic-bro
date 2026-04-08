export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Loading AI Insights...</p>
      </div>
    </div>
  );
}
