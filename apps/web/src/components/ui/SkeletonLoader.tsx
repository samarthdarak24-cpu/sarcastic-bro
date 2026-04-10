import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg animate-pulse">
      <div className="h-12 w-12 bg-slate-200 rounded-2xl mb-4"></div>
      <div className="h-8 bg-slate-200 rounded-lg mb-2 w-24"></div>
      <div className="h-4 bg-slate-200 rounded w-32"></div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg animate-pulse">
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-16 w-16 bg-slate-200 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
            <div className="h-10 w-24 bg-slate-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map((j) => (
              <div key={j}>
                <div className="h-3 bg-slate-200 rounded w-16 mb-2"></div>
                <div className="h-5 bg-slate-200 rounded w-20"></div>
              </div>
            ))}
          </div>
          <div className="h-12 bg-slate-200 rounded-xl"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/3 mb-6"></div>
      <div className="h-64 flex items-end justify-between gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex-1 bg-slate-200 rounded-t-xl"
            style={{ height: `${Math.random() * 60 + 40}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg animate-pulse">
          <div className="h-48 bg-slate-200"></div>
          <div className="p-6">
            <div className="h-6 bg-slate-200 rounded mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-8 bg-slate-200 rounded w-20"></div>
              <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonLoader({ className = "", height = "h-4", width = "w-full" }: { className?: string, height?: string, width?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${height} ${width} ${className}`} />
  );
}
