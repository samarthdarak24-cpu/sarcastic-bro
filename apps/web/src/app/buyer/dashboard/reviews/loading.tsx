/**
 * Loading State for Reviews Page
 * 
 * Displays a skeleton loader while the reviews page is loading.
 * This provides immediate visual feedback to users.
 */

export default function ReviewsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-10 w-64 bg-slate-200 rounded-lg" />
        <div className="h-5 w-96 bg-slate-200 rounded" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200">
            <div className="h-12 w-12 bg-slate-200 rounded-2xl mb-4" />
            <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-32 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      
      {/* Reviews skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 w-40 bg-slate-200 rounded mb-2" />
                <div className="h-4 w-48 bg-slate-200 rounded" />
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="h-4 w-4 bg-slate-200 rounded" />
                ))}
              </div>
            </div>
            <div className="h-4 w-full bg-slate-200 rounded mb-2" />
            <div className="h-4 w-3/4 bg-slate-200 rounded" />
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
