'use client';

export default function FarmerPage() {
  if (typeof window !== 'undefined') {
    window.location.href = '/farmer/dashboard';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );
}
